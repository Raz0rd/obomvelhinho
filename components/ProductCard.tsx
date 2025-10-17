import { Product } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.find(img => img.position === 0) || product.images[0];
  
  // Usar preço da primeira variante se existir, senão usar preço do produto
  const getFirstVariantPrice = () => {
    if (product.variants.length > 0) {
      const firstVariant = product.variants.find(v => v.position === 0) || product.variants[0];
      if (firstVariant && firstVariant.options.length > 0) {
        const firstOption = firstVariant.options.find(o => o.position === 0) || firstVariant.options[0];
        return firstOption.price;
      }
    }
    return product.priceWithDiscount > 0 ? product.priceWithDiscount : product.price;
  };

  const displayPrice = getFirstVariantPrice();
  const originalPrice = product.price;
  const discountPercentage = displayPrice < originalPrice
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  return (
    <Link href={`/produto/${product.slug}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col group">
        <div className="relative aspect-square bg-gray-100">
          {mainImage && (
            <Image
              src={mainImage.imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
          )}
          
          {discountPercentage > 0 && (
            <div className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
              -{discountPercentage}%
            </div>
          )}
        </div>

        <div className="p-2 flex flex-col flex-grow">
          <h3 className="text-xs font-medium text-gray-700 line-clamp-2 mb-2 min-h-[2rem]">
            {product.title}
          </h3>

          <div className="mt-auto">
            {discountPercentage > 0 ? (
              <div className="space-y-0.5">
                <p className="text-[10px] text-gray-400 line-through">
                  De R$ {originalPrice.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm font-bold text-red-600">
                  R$ {displayPrice.toFixed(2).replace('.', ',')}
                </p>
              </div>
            ) : (
              <p className="text-sm font-bold text-red-600">
                R$ {displayPrice.toFixed(2).replace('.', ',')}
              </p>
            )}
            
            <p className="text-[10px] text-gray-500 mt-0.5">
              12x sem juros
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
