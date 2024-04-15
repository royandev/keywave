'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/login', label: 'Login' },
  { href: '/sign-up', label: 'Sign Up' },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shadow-sm">
      <Link href="/" className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white grid place-items-center font-semibold">
          KC
        </div>
        <div>
          <p className="text-lg font-semibold leading-tight">Keywave Courier</p>
          <p className="text-sm text-slate-500">
            Wallet-first encrypted courier for tokenized threads
          </p>
        </div>
      </Link>
      <nav className="flex items-center gap-3 text-sm font-medium text-slate-600">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 transition hover:text-slate-900 hover:bg-slate-100 ${
                active ? 'bg-slate-900 text-white shadow-sm' : ''
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
