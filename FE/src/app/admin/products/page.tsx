'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Product, Category } from '@/types';
import ConfirmDialog from '@/components/ConfirmDialog';

interface FormData {
  productName: string; description: string; price: string;
  stockQuantity: string; imageUrl: string; categoryID: string; isActive: boolean;
}
const EMPTY: FormData = { productName: '', description: '', price: '', stockQuantity: '0', imageUrl: '', categoryID: '', isActive: true };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get<Product[]>('/api/products/all'),
        api.get<Category[]>('/api/categories/all'),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function validate(): boolean {
    const errs: Partial<FormData> = {};
    if (!form.productName.trim()) errs.productName = 'Name is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) errs.price = 'Valid price required';
    if (isNaN(Number(form.stockQuantity)) || Number(form.stockQuantity) < 0) errs.stockQuantity = 'Valid stock required';
    if (!form.categoryID) errs.categoryID = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      productName: form.productName,
      description: form.description || null,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      imageUrl: form.imageUrl || null,
      categoryID: Number(form.categoryID),
      isActive: form.isActive,
    };
    try {
      if (editId) {
        await api.put(`/api/products/${editId}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/api/products', payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.delete(`/api/products/${deleteId}`);
      toast.success('Product deactivated!');
      setDeleteId(null);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
      setDeleteId(null);
    }
  }

  const filtered = products.filter(p => p.productName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <button onClick={() => { setEditId(null); setForm(EMPTY); setErrors({}); setShowModal(true); }}
          className="btn-primary">+ New Product</button>
      </div>

      <div className="mb-4">
        <input className="input-field max-w-sm" placeholder="Search by name..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="text-gray-500">Loading...</div> : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-auto shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Stock</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.productID} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{p.productID}</td>
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.productName}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{p.categoryName}</td>
                  <td className="px-4 py-3 text-right font-medium text-orange-600">{p.price.toLocaleString('vi-VN')} ₫</td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">{p.stockQuantity}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => {
                        setEditId(p.productID);
                        setForm({ productName: p.productName, description: p.description || '', price: String(p.price), stockQuantity: String(p.stockQuantity), imageUrl: p.imageUrl || '', categoryID: String(p.categoryID), isActive: p.isActive });
                        setErrors({});
                        setShowModal(true);
                      }} className="text-blue-500 hover:underline text-xs font-medium">Edit</button>
                      <button onClick={() => setDeleteId(p.productID)}
                        className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-lg font-bold mb-5">{editId ? 'Edit Product' : 'New Product'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input className="input-field" value={form.productName}
                  onChange={e => setForm(f => ({ ...f, productName: e.target.value }))} />
                {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input-field resize-none h-20" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₫) *</label>
                  <input className="input-field" type="number" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input className="input-field" type="number" value={form.stockQuantity}
                    onChange={e => setForm(f => ({ ...f, stockQuantity: e.target.value }))} />
                  {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input className="input-field" value={form.imageUrl}
                  onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select className="input-field" value={form.categoryID}
                  onChange={e => setForm(f => ({ ...f, categoryID: e.target.value }))}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.categoryID} value={c.categoryID}>{c.categoryName}</option>)}
                </select>
                {errors.categoryID && <p className="text-red-500 text-xs mt-1">{errors.categoryID}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pIsActive" checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4" />
                <label htmlFor="pIsActive" className="text-sm text-gray-700">Active</label>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to deactivate this product? (Soft-delete: sets IsActive = false)"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}
