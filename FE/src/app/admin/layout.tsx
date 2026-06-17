'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { clearAuth, isAuthenticated } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') { setChecked(true); return; }
    if (!isAuthenticated()) router.replace('/admin/login');
    else setChecked(true);
  }, [pathname, router]);

  if (!checked) return null;
  if (pathname === '/admin/login') return <>{children}</>;

  const navLinks = [
    { href: '/admin', label: '📊 Dashboard' },
    { href: '/admin/categories', label: '🏷️ Categories' },
    { href: '/admin/products', label: '📦 Products' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col py-6 px-4 hidden md:flex">
        <Link href="/" className="text-xl font-bold text-orange-400 mb-8 block">🛒 SimpleShop</Link>
        <nav className="flex-1 space-y-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href ? 'bg-orange-500 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => { clearAuth(); router.push('/admin/login'); }}
          className="text-sm text-slate-400 hover:text-white mt-4 text-left px-3 py-2">
          🚪 Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between md:hidden">
          <span className="font-bold text-slate-800">Admin Panel</span>
          <button onClick={() => { clearAuth(); router.push('/admin/login'); }}
            className="text-sm text-red-500">Logout</button>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
