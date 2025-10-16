import { Product, ProductsResponse } from '@/types/product';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

async function getProduct(slug: string): Promise<Product | null> {
  const filePath = path.join(process.cwd(), 'products.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data: ProductsResponse = JSON.parse(fileContents);
  
  const product = data.items.find(item => item.slug === slug);
  return product || null;
}

async function getAllProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'products.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data: ProductsResponse = JSON.parse(fileContents);
  return data.items;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    return {
      title: 'Produto não encontrado',
    };
  }

  return {
    title: `${product.title} - Vila Do Natal`,
    description: product.seoDescription || product.title,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Voltar para produtos</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={product.images} title={product.title} />
        <ProductInfo product={product} />
      </div>

      {/* Produtos Relacionados */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Você pode adicionar lógica para mostrar produtos relacionados aqui */}
        </div>
      </div>
    </div>
  );
}
