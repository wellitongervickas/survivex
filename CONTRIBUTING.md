# Contributing to SurviveX

Thanks for your interest in contributing. This is a small, focused tool — contributions that keep it simple and privacy-first are most welcome.

---

## What we're looking for

- Bug fixes
- Simulation accuracy improvements
- UI/UX improvements (especially mobile)
- New currency support or exchange rate provider fallbacks
- Accessibility improvements

What we're **not** looking for:
- Backend integrations or server-side features
- Cloud sync or account systems
- Third-party analytics or telemetry
- Breaking changes to the encryption scheme without thorough discussion

---

## Ground rules

- **No backend.** This app is and will remain fully client-side.
- **No plaintext storage.** All writes to IndexedDB must go through `encrypt()`.
- **No `any` types.** TypeScript strict mode is enforced.
- **No new dependencies** without opening an issue first.
- **CSS variables only** — no hardcoded color values in components.

---

## Development setup

```bash
git clone https://github.com/gervickasjs/survivex
cd survivex
npm install
npm run dev
```

Before submitting a PR, make sure these all pass:

```bash
npx tsc --noEmit   # zero type errors
npm run lint       # zero lint errors
npm run build      # produces /out cleanly
```

---

## Submitting a pull request

1. Fork the repo and create a branch from `main`.
2. Make your changes — keep them focused. One concern per PR.
3. Test manually in the browser: create vault → add data → refresh (F5) → verify data persists → lock → unlock → verify restored.
4. Open a PR with a clear description of what changed and why.

If your change touches the encryption or simulation logic, explain your reasoning in the PR description.

---

## Reporting bugs

Open a GitHub issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser and OS

Do **not** include your vault password or any financial data in bug reports.

---

## Questions

Open a discussion or issue — happy to help clarify the architecture before you start building.
