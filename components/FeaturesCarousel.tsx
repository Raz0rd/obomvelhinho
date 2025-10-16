'use client';

import { useState, useEffect } from 'react';
import { Truck, Headphones, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'FRETE GRÁTIS',
    description: 'Entrega gratuita para todo Brasil.',
  },
  {
    icon: Headphones,
    title: 'SUPORTE AO CLIENTE',
    description: 'Eficiência e confiabilidade garantidas.',
  },
  {
    icon: ShieldCheck,
    title: 'COMPRA SEGURA',
    description: 'Ambiente 100% seguro',
  },
];

export default function FeaturesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="w-full">
      <div className="relative w-full bg-gray-50 rounded-lg p-6">
        <div className="relative h-40 max-w-7xl mx-auto overflow-hidden">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center transition-opacity duration-500 px-4 ${
                  currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="mb-2 text-emerald-500">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'bg-emerald-500 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white text-emerald-500"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white text-emerald-500"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
