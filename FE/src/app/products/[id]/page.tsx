import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Product } from '@/types';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-500 text-xl">Product not found.</p>
        <Link href="/" className="text-orange-500 hover:underline mt-4 inline-block">← Go Home</Link>
      </main>
    </>
  );

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <Link href={`/category/${product.categoryID}`} className="text-orange-500 hover:underline text-sm mb-6 inline-block">
          ← Back to {product.categoryName}
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-80 h-72 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.productName} width={320} height={288}
                className="object-contain w-full h-full" unoptimized />
            ) : (
              <span className="text-6xl">📦</span>
            )}
          </div>
          <div className="flex-1">
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
              {product.categoryName}
            </span>
            <h1 className="text-2xl font-bold text-slate-800 mt-3 mb-2">{product.productName}</h1>
            <p className="text-3xl font-bold text-orange-500 mb-4">
              {product.price.toLocaleString('vi-VN')} ₫
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">{product.description || 'No description available.'}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Added: {new Date(product.createdDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
