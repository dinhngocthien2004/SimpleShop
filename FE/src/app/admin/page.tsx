'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Category, Product } from '@/types';

export default function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/api/categories/all'),
      api.get<Product[]>('/api/products/all'),
    ]).then(([catRes, prodRes]) => {
      setCategories(catRes.data);
      setProducts(prodRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Categories', value: categories.length, icon: '🏷️', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Products', value: products.length, icon: '📦', color: 'bg-orange-50 text-orange-600' },
    { label: 'Active Products', value: products.filter(p => p.isActive).length, icon: '✅', color: 'bg-green-50 text-green-600' },
    { label: 'Inactive Products', value: products.filter(p => !p.isActive).length, icon: '❌', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(s => (
            <div key={s.label} className={`card flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
