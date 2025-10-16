'use client';

import { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';

export default function TopBanner() {
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    '🎄 ANTECIPE SUAS COMPRAS DE NATAL',
    '⭐ PROMOÇÃO ESPECIAL - 20% OFF',
    '🎁 FRETE GRÁTIS ACIMA DE R$ 100',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Barra Superior - Vinho Neon */}
      <div 
        className="w-full flex items-center justify-center font-bold p-3 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #C41E3A 0%, #8B0046 25%, #6E1032 50%, #8B0046 75%, #C41E3A 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 8s ease infinite',
          color: '#ffffff',
          height: '40px',
          boxShadow: '0 0 25px rgba(255, 0, 110, 0.6), 0 0 40px rgba(255, 0, 110, 0.3), inset 0 0 25px rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="transition-all duration-700 ease-in-out transform">
          <span className="text-sm tracking-widest uppercase animate-pulse-glow font-extrabold">
            {messages[currentMessage]}
          </span>
        </div>
        
        {/* Efeito de brilho animado */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'shine 3s infinite',
          }}
        />
      </div>

      {/* Barra Inferior - Verde Neon */}
      <div 
        className="w-full flex items-center justify-center font-bold p-2 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 25%, #10a66e 50%, #0d7d4d 75%, #0a5f38 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 8s ease infinite',
          color: '#00ff88',
          height: '36px',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.5), 0 0 35px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.1)',
        }}
      >
        <Truck size={18} className="mr-2 animate-bounce-subtle" />
        <span className="text-xs font-extrabold tracking-wide uppercase drop-shadow-[0_0_8px_rgba(0,255,136,0.9)]">
          🚚 Frete grátis em pedidos acima de R$ 100
        </span>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}
