# SurviveX

Personal financial runway tracker. Client-side only. No backend. No database.

## Commands
- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — static export to /out
- `npm run lint` — ESLint check
- `npx tsc --noEmit` — type check

## Architecture
- All data lives in IndexedDB, encrypted with AES-GCM (see src/lib/crypto.ts)
- Simulation engine is a pure function in src/lib/simulate.ts
- State: React Context + useReducer in src/context/AppContext.tsx
- No server actions, no API routes, no auth providers

## Critical Rules
- NEVER store password or derived key in React state or module scope
- NEVER write plaintext to IndexedDB — all writes go through encrypt()
- NEVER add `any` types — strict mode enforced
- NEVER add dependencies not listed in package.json without explicit approval
- NEVER use `localStorage` — IndexedDB only
- Output is static export — no Node.js server features allowed

## Code Style
- Named exports only (no default exports except page.tsx and layout.tsx)
- Functional components with hooks
- CSS variables for all colors — no hardcoded hex in components
- JetBrains Mono for all numeric/monetary values via `font-mono-num` class
