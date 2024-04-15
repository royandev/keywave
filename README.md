# Keywave Courier

Wallet-aware encrypted courier built with Next.js 14 + TypeScript. Messages are planned to be AES-CTR protected, RSA signed, and anchored to a lightweight ledger so every thread can follow wallet approvals and tokens.

## Getting Started

```bash
npm run dev
```

Then open http://localhost:3000.

## Roadmap (short)
- Wallet-focused sign-up/login with AES-CTR protected credentials.
- Token/approval controls for who can deliver into your inbox.
- Ledger-backed message receipts with signature verification.
- Minimal JSON persistence for quick local runs.
