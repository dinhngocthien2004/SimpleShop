import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Category } from '@/types';

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Hero */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl p-10 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Welcome to SimpleShop</h1>
          <p className="text-slate-300 text-lg">Discover quality products across all categories</p>
          <Link href="/search" className="inline-block mt-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Browse All Products →
          </Link>
        </section>

        {/* Categories */}
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Shop by Category</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.categoryID}
                href={`/category/${cat.categoryID}`}
                className="card hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <span className="text-2xl">🏷️</span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-orange-600 transition-colors">
                  {cat.categoryName}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.categoryDescription}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
