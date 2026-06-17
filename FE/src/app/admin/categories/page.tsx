'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Category } from '@/types';
import ConfirmDialog from '@/components/ConfirmDialog';

interface FormData { categoryName: string; categoryDescription: string; isActive: boolean; }
const EMPTY: FormData = { categoryName: '', categoryDescription: '', isActive: true };

export default function AdminCategoriesPage() {
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
      const res = await api.get<Category[]>('/api/categories/all');
      setCategories(res.data);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function validate(): boolean {
    const errs: Partial<FormData> = {};
    if (!form.categoryName.trim()) errs.categoryName = 'Name is required';
    else if (form.categoryName.length > 100) errs.categoryName = 'Max 100 characters';
    if (!form.categoryDescription.trim()) errs.categoryDescription = 'Description is required';
    else if (form.categoryDescription.length > 250) errs.categoryDescription = 'Max 250 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/api/categories/${editId}`, form);
        toast.success('Category updated!');
      } else {
        await api.post('/api/categories', form);
        toast.success('Category created!');
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
      await api.delete(`/api/categories/${deleteId}`);
      toast.success('Category deleted!');
      setDeleteId(null);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
      setDeleteId(null);
    }
  }

  const filtered = categories.filter(c =>
    c.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
        <button onClick={() => { setEditId(null); setForm(EMPTY); setErrors({}); setShowModal(true); }}
          className="btn-primary">+ New Category</button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input className="input-field max-w-sm" placeholder="Search by name..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      {loading ? <div className="text-gray-500">Loading...</div> : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Description</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.categoryID} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{c.categoryID}</td>
                  <td className="px-4 py-3 font-medium">{c.categoryName}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate">{c.categoryDescription}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => { setEditId(c.categoryID); setForm({ categoryName: c.categoryName, categoryDescription: c.categoryDescription, isActive: c.isActive }); setErrors({}); setShowModal(true); }}
                        className="text-blue-500 hover:underline text-xs font-medium">Edit</button>
                      <button onClick={() => setDeleteId(c.categoryID)}
                        className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No categories found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-5">{editId ? 'Edit Category' : 'New Category'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input className="input-field" value={form.categoryName}
                  onChange={e => setForm(f => ({ ...f, categoryName: e.target.value }))} />
                {errors.categoryName && <p className="text-red-500 text-xs mt-1">{errors.categoryName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea className="input-field resize-none h-24" value={form.categoryDescription}
                  onChange={e => setForm(f => ({ ...f, categoryDescription: e.target.value }))} />
                {errors.categoryDescription && <p className="text-red-500 text-xs mt-1">{errors.categoryDescription}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4" />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
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

      {/* Confirm Delete */}
      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this category? This will fail if products are linked."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}
