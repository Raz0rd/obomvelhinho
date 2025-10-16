'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="bg-white shadow-sm sticky z-40" style={{ top: '76px' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logoOBomvelhinho.webp"
              alt="Obom Velhinho"
              className="h-16 w-auto object-contain"
            />
            <h1 className="text-2xl font-bold text-red-700">Obom Velhinho</h1>
          </Link>

          <Link href="/carrinho" className="relative">
            <div className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-800 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
