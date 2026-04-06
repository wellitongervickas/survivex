import { openDB } from "idb"
import type { EncryptedBlob } from "@/types"

const DB_NAME = "survivex"
const STORE_NAME = "vault"
const RECORD_KEY = "state"
const PBKDF2_ITERATIONS = 310_000

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME)
    },
  })
}

function toBufferSource(arr: Uint8Array): BufferSource {
  return arr.buffer.slice(arr.byteOffset, arr.byteOffset + arr.byteLength) as ArrayBuffer
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
  usage: KeyUsage[],
): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  )
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: toBufferSource(salt), iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    usage,
  )
}

export async function encrypt(plaintext: string, password: string): Promise<EncryptedBlob> {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt, ["encrypt"])
  const data = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: toBufferSource(iv) },
    key,
    enc.encode(plaintext),
  )
  return { salt, iv, data }
}

export async function decrypt(blob: EncryptedBlob, password: string): Promise<string> {
  const dec = new TextDecoder()
  const key = await deriveKey(password, blob.salt, ["decrypt"])
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: toBufferSource(blob.iv) },
    key,
    blob.data,
  )
  return dec.decode(plainBuffer)
}

export async function saveToVault(blob: EncryptedBlob): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, blob, RECORD_KEY)
}

export async function loadFromVault(): Promise<EncryptedBlob | null> {
  const db = await getDB()
  const record = await db.get(STORE_NAME, RECORD_KEY)
  if (!record) return null
  return record as EncryptedBlob
}

export async function vaultExists(): Promise<boolean> {
  const blob = await loadFromVault()
  return blob !== null
}
