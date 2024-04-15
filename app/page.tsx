import { SiteShell } from "@/components/SiteShell";

export default function Home() {
  return (
    <SiteShell>
      <div className="rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 p-10">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm">
          Wallet-native courier
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
          Send encrypted threads that travel with your wallet tokens.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Keywave Courier pairs AES-CTR payload protection with RSA signing so
          every inbox event is linked to wallet identity and approval tokens.
          Build trust without handing custody to a central inbox.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-white font-semibold shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Create wallet profile
          </a>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-slate-800 font-semibold transition hover:bg-slate-50"
          >
            Access inbox
          </a>
          <span className="text-sm text-slate-500">
            Upcoming: token-gated approvals, ledger-backed receipts, AES CTR
            wallet vaults.
          </span>
        </div>
      </div>
    </SiteShell>
  );
}
