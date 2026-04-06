import { openDB } from "idb"
import type { EncryptedBlob } from "@/types"

const DB_NAME = "survivex"
const STORE_NAME = "vault"
const RECORD_KEY = "state"
const SESSION_STORAGE_KEY = "sx_session"
const PBKDF2_ITERATIONS = 310_000

export type SessionKey = {
  key: CryptoKey
  salt: Uint8Array
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) { db.createObjectStore(STORE_NAME) },
  })
}

function buf(arr: Uint8Array): ArrayBuffer {
  return arr.buffer.slice(arr.byteOffset, arr.byteOffset + arr.byteLength) as ArrayBuffer
}

function toBase64(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr))
}

function fromBase64(s: string): Uint8Array {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  )
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: buf(salt), iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true, // extractable so we can persist the session key in sessionStorage
    ["encrypt", "decrypt"],
  )
}

async function saveBlob(blob: EncryptedBlob): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, blob, RECORD_KEY)
}

async function loadBlob(): Promise<EncryptedBlob | null> {
  const db = await getDB()
  const record = await db.get(STORE_NAME, RECORD_KEY)
  return record ? (record as EncryptedBlob) : null
}

// ─── Session storage (survives F5, cleared on tab close) ───────────────────────

async function persistSession(session: SessionKey): Promise<void> {
  const jwk = await crypto.subtle.exportKey("jwk", session.key)
  sessionStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ jwk, salt: toBase64(session.salt) }),
  )
}

async function restoreSession(): Promise<SessionKey | null> {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const { jwk, salt: saltB64 } = JSON.parse(raw) as { jwk: JsonWebKey; salt: string }
    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    )
    return { key, salt: fromBase64(saltB64) }
  } catch {
    return null
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEY)
}

// ─── Public API ────────────────────────────────────────────────────────────────

export async function vaultExists(): Promise<boolean> {
  return (await loadBlob()) !== null
}

/**
 * Try to restore a session from sessionStorage (survives F5 within the same tab).
 * Returns null if no session is stored or if the vault data can't be decrypted with it.
 */
export async function tryRestoreSession(): Promise<{ session: SessionKey; plaintext: string } | null> {
  const session = await restoreSession()
  if (!session) return null
  try {
    const blob = await loadBlob()
    if (!blob) return null
    const plainBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: buf(blob.iv) },
      session.key,
      blob.data,
    )
    return { session, plaintext: new TextDecoder().decode(plainBuffer) }
  } catch {
    clearSession()
    return null
  }
}

export async function createVault(password: string, plaintext: string): Promise<SessionKey> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await deriveKey(password, salt)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const data = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: buf(iv) },
    key,
    new TextEncoder().encode(plaintext),
  )
  await saveBlob({ salt, iv, data })
  const session: SessionKey = { key, salt }
  await persistSession(session)
  return session
}

export async function unlockVault(
  password: string,
): Promise<{ session: SessionKey; plaintext: string }> {
  const blob = await loadBlob()
  if (!blob) throw new Error("No vault found")
  const key = await deriveKey(password, blob.salt)
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: buf(blob.iv) },
    key,
    blob.data,
  )
  const session: SessionKey = { key, salt: blob.salt }
  await persistSession(session)
  return { session, plaintext: new TextDecoder().decode(plainBuffer) }
}

export async function saveWithSession(plaintext: string, session: SessionKey): Promise<void> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const data = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: buf(iv) },
    session.key,
    new TextEncoder().encode(plaintext),
  )
  await saveBlob({ salt: session.salt, iv, data })
}
