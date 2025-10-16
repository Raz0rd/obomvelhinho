'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CarrinhoPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <ShoppingBag size={80} className="mx-auto text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-800">Seu carrinho está vazio</h1>
          <p className="text-gray-600">Adicione produtos ao carrinho para continuar comprando.</p>
          <Link
            href="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Produtos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.selectedVariant?.price || item.product.priceWithDiscount || item.product.price;
            const mainImage = item.product.images.find(img => img.position === 0) || item.product.images[0];

            return (
              <div key={`${item.product.id}-${item.selectedVariant?.id || 'no-variant'}`} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex gap-4">
                  {/* Imagem */}
                  <Link href={`/produto/${item.product.slug}`} className="relative w-24 h-24 flex-shrink-0">
                    {mainImage && (
                      <Image
                        src={mainImage.imageUrl}
                        alt={item.product.title}
                        fill
                        className="object-cover rounded-md"
                        sizes="96px"
                      />
                    )}
                  </Link>

                  {/* Informações */}
                  <div className="flex-grow">
                    <Link href={`/produto/${item.product.slug}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-green-600 line-clamp-2">
                        {item.product.title}
                      </h3>
                    </Link>
                    
                    {item.selectedVariant && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.selectedVariant.name}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      {/* Controles de Quantidade */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Preço e Remover */}
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-red-600">
                          R$ {(price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remover item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 border-b pb-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span className="text-red-600 font-medium">Grátis</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span className="text-red-600">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-3"
            >
              Finalizar Compra
            </button>

            <Link
              href="/"
              className="block text-center text-red-600 hover:text-red-700 font-medium"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
