import Link from "next/link"

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      <p className="text-6xl font-bold font-mono-num" style={{ color: "var(--text-muted)" }}>
        404
      </p>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Page not found.
      </p>
      <Link
        href="/"
        className="text-sm underline"
        style={{ color: "var(--accent)" }}
      >
        Go home
      </Link>
    </div>
  )
}
