# SurviveX

<img width="1614" height="807" alt="image" src="https://github.com/user-attachments/assets/3da6079b-4df9-42c9-b938-021ba630e158" />


**Know exactly how long your savings can sustain you.**

SurviveX is a financial runway tracker for freelancers, indie hackers, and anyone living off savings. You tell it what you have, what you spend, and what you earn — it tells you how many months you can survive, when you need to act, and what your month-by-month balance looks like.

Everything runs in your browser. No accounts. No cloud. No server ever sees your data.

---

## Features

- **Multi-currency balances** — add savings in any currency, converted to your base currency using live exchange rates
- **Bills** — recurring (monthly, weekly, yearly) and one-time expenses; each bill has a slider to test adjusted amounts without editing the original
- **Income streams** — monthly salary, freelance payments, one-time inflows with specific dates
- **Safe point** — define a floor below which you consider yourself at risk, either as an absolute amount or a percentage of your total balance
- **Runway simulation** — month-by-month projection showing balance, income, and expenses for each month
- **"Act by here" marker** — highlights the last month where you're still above your safe point, so you know your real deadline
- **Live FX rates** — fetches current exchange rates from [open.er-api.com](https://open.er-api.com) with a fallback to Frankfurter; rates are editable manually too
- **AES-GCM 256-bit encryption** — your data is encrypted with a password you choose before it ever touches storage; the password is never stored anywhere
- **Session persistence** — refreshing the page keeps you logged in; closing the tab logs you out automatically
- **Fully static** — no backend, no API keys required, deployable anywhere

---

## How it works

On first visit, you create a **vault** with a password. SurviveX derives an AES-GCM key from that password using PBKDF2 (310,000 iterations, SHA-256) and encrypts your state before writing it to IndexedDB in your browser. The password never leaves your device — not even in memory after the key is derived.

When you refresh the page, the session key is restored from `sessionStorage` (which survives F5 but is cleared when you close the tab). Your data is decrypted and you're back where you left off. Lock manually using the lock button in the header.

Every change you make is auto-saved within 400ms — no save button needed.

---

## Getting started

```bash
git clone https://github.com/gervickasjs/survivex
cd survivex
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

1. Create a vault with a password (min 8 characters)
2. Add your balances — savings accounts, wallets, any currency
3. Add your bills — rent, subscriptions, one-off costs
4. Add any income — salary, freelance payments
5. Set your safe point — the balance floor below which you're in danger
6. Watch the runway chart show your financial future month by month

---

## Commands

```bash
npm run dev          # dev server at localhost:3000
npm run build        # static export → /out
npm run lint         # ESLint
npx tsc --noEmit     # type check
```

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| UI | shadcn/ui + Base UI + Tailwind CSS v4 |
| Charts | Recharts |
| Crypto | Web Crypto API (PBKDF2 → AES-GCM 256-bit) |
| Storage | IndexedDB via `idb` |
| Exchange rates | open.er-api.com + Frankfurter fallback |
| Fonts | DM Sans + JetBrains Mono |
| Deploy | Vercel (static, zero backend) |

---

## Deployment

The build output is a fully static site in `/out`. Deploy anywhere:

**Vercel** — connect the repo, it picks up `vercel.json` automatically.

**Manual** — run `npm run build`, serve the `/out` directory from any static host (Netlify, Cloudflare Pages, GitHub Pages, etc.).

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT
