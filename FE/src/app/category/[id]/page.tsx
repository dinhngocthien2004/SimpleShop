import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Product } from '@/types';

async function getProducts(categoryId: string): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${categoryId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const products = await getProducts(params.id);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <Link href="/" className="text-orange-500 hover:underline text-sm mb-4 inline-block">← Back to categories</Link>
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Products</h1>
        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-16">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.productID} href={`/products/${p.productID}`}
                className="card hover:shadow-md hover:border-orange-300 transition-all group">
                <div className="w-full h-44 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.productName} width={200} height={176}
                      className="object-contain w-full h-full" unoptimized />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {p.productName}
                </h3>
                <p className="text-orange-500 font-bold mt-2">{p.price.toLocaleString('vi-VN')} ₫</p>
                <p className="text-xs text-gray-400 mt-1">Stock: {p.stockQuantity}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
