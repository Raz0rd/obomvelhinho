'use client';

import { Product } from '@/types/product';
import { useState } from 'react';
import { ShoppingCart, Truck, Shield, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const discountPercentage = product.priceWithDiscount > 0
    ? Math.round(((product.price - product.priceWithDiscount) / product.price) * 100)
    : 0;

  const currentPrice = product.priceWithDiscount > 0 ? product.priceWithDiscount : product.price;

  // Limpar HTML da descrição para exibição
  const cleanDescription = product.description
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .substring(0, 500);

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
        {discountPercentage > 0 && (
          <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Preço */}
      <div className="border-t border-b py-4">
        {product.priceWithDiscount > 0 && (
          <p className="text-lg text-gray-400 line-through">
            De R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        )}
        <p className="text-4xl font-bold text-red-600">
          R$ {currentPrice.toFixed(2).replace('.', ',')}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          ou 12x de R$ {(currentPrice / 12).toFixed(2).replace('.', ',')} sem juros
        </p>
      </div>

      {/* Variantes */}
      {product.variants.length > 0 && (
        <div className="space-y-4">
          {product.variants.map((variant) => (
            <div key={variant.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {variant.optionName}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {variant.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedVariant(variant.id);
                      setSelectedOption(option.id);
                    }}
                    className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      selectedOption === option.id
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <div>{option.name}</div>
                    <div className="text-xs mt-1">
                      R$ {option.price.toFixed(2).replace('.', ',')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão Comprar */}
      <button 
        onClick={() => {
          // Se tem variantes, validar seleção
          if (product.variants.length > 0 && !selectedOption) {
            alert('Por favor, selecione uma opção antes de adicionar ao carrinho');
            return;
          }

          // Encontrar a variante selecionada
          const variant = product.variants
            .flatMap(v => v.options)
            .find(opt => opt.id === selectedOption);

          // Adicionar ao carrinho
          addToCart(product, variant, 1);

          // Redirecionar para o carrinho
          router.push('/carrinho');
        }}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
      >
        <ShoppingCart size={20} />
        Comprar Agora
      </button>

      {/* Benefícios */}
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Truck className="text-red-600" size={20} />
          <span>Entrega para todo o Brasil</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <CreditCard className="text-red-600" size={20} />
          <span>Parcelamento em até 12x sem juros</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Shield className="text-red-600" size={20} />
          <span>Compra 100% segura</span>
        </div>
      </div>

      {/* Descrição */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Descrição</h2>
        <div 
          className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
}
