'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-orange-400 tracking-tight">
          🛒 SimpleShop
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
          <Link href="/search" className="hover:text-orange-400 transition-colors">Search</Link>
          <Link href="/admin/login" className="bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-lg transition-colors">
            Admin
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="text-2xl">☰</span>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-slate-800 px-4 pb-4 flex flex-col gap-3 text-sm">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/search" onClick={() => setMenuOpen(false)}>Search</Link>
          <Link href="/admin/login" onClick={() => setMenuOpen(false)}>Admin</Link>
        </div>
      )}
    </nav>
  );
}
