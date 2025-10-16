'use client';

import { ProductImage } from '@/types/product';
import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const sortedImages = [...images].sort((a, b) => a.position - b.position);

  if (sortedImages.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
        <p className="text-gray-400">Sem imagem</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Imagem Principal */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={sortedImages[selectedImage].imageUrl}
          alt={`${title} - Imagem ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Miniaturas */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-green-600 ring-2 ring-green-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={`${title} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
