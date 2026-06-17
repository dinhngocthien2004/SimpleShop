'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { Product, Category } from '@/types';

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    api.get('/api/categories').then(r => setCategories(r.data)).catch(() => {});
    doSearch();
  }, []);

  async function doSearch() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (name) params.append('name', name);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (categoryId) params.append('categoryId', categoryId);
      const res = await api.get(`/api/products/search?${params}`);
      setProducts(res.data);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Search Products</h1>

        {/* Filters */}
        <div className="card mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input className="input-field" value={name} onChange={e => setName(e.target.value)}
              placeholder="Search by name..." onKeyDown={e => e.key === 'Enter' && doSearch()} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="input-field" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.categoryID} value={c.categoryID}>{c.categoryName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₫)</label>
            <input className="input-field" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₫)</label>
            <input className="input-field" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="999999999" />
          </div>
          <div className="sm:col-span-2 md:col-span-4 flex gap-3">
            <button onClick={doSearch} className="btn-primary">Search</button>
            <button onClick={() => { setName(''); setMinPrice(''); setMaxPrice(''); setCategoryId(''); doSearch(); }}
              className="btn-secondary">Clear</button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Searching...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <Link key={p.productID} href={`/products/${p.productID}`}
                className="card hover:shadow-md hover:border-orange-300 transition-all group">
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.productName} width={200} height={160}
                      className="object-contain w-full h-full" unoptimized />
                  ) : <span className="text-4xl">📦</span>}
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 text-sm">
                  {p.productName}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{p.categoryName}</p>
                <p className="text-orange-500 font-bold mt-2 text-sm">{p.price.toLocaleString('vi-VN')} ₫</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
