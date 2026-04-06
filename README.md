# SurviveX

**How long can you survive on your savings?**

SurviveX is a privacy-first financial runway tracker that answers that question with a clear, month-by-month simulation. Everything runs in your browser — no accounts, no cloud sync, no server ever sees your data.

---

## What it does

You give it your:
- **Balances** — savings accounts, wallets, any currency
- **Bills** — recurring expenses (monthly, weekly, yearly, one-time)
- **Income** — freelance payments, scheduled inflows
- **Safe point** — a floor below which you consider yourself at risk (absolute amount or % of balance)

It simulates your financial runway month by month and tells you:
- How many months you have before hitting your safe point
- Exactly which month you need to act by
- A breakdown of income vs expenses per month

All amounts are converted to your chosen base currency using live exchange rates.

---

## Privacy

Your data never leaves your device. Everything is encrypted with **AES-GCM 256-bit** using a password you choose. The encrypted blob lives in your browser's IndexedDB. The password is never stored — only the derived key is held in memory for the session.

Refreshing the page keeps you logged in via a secure session stored in `sessionStorage`. Closing the tab clears the session completely.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| UI | shadcn/ui + Base UI + Tailwind CSS v4 |
| Charts | Recharts |
| Crypto | Web Crypto API (PBKDF2 → AES-GCM) |
| Storage | IndexedDB via `idb` |
| Fonts | DM Sans + JetBrains Mono |
| Deploy | Vercel (static, zero backend) |

---

## Getting started

```bash
git clone https://github.com/gervickasjs/survivex
cd survivex
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On first load, you'll be prompted to create a vault with a password.

---

## Commands

```bash
npm run dev          # dev server at localhost:3000
npm run build        # static export → /out
npm run lint         # ESLint
npx tsc --noEmit     # type check
```

---

## Deployment

The app exports as a fully static site. Deploy anywhere that serves static files:

**Vercel** (recommended) — connect the repo, it picks up `vercel.json` automatically.

**Manual** — run `npm run build`, then serve the `/out` directory.

---

## License

MIT — see [LICENSE](LICENSE).
