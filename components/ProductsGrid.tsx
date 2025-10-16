'use client';

import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductsGridProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 12;

const CATEGORIES = [
  { id: 'all', label: 'Todos os Produtos' },
  { id: 'arvores', label: 'Árvores de Natal' },
  { id: 'enfeites', label: 'Enfeites e Decoração' },
  { id: 'loucas', label: 'Louças e Conjuntos' },
  { id: 'acessorios', label: 'Acessórios' },
];

export default function ProductsGrid({ products }: ProductsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const title = product.title.toLowerCase();
        switch (selectedCategory) {
          case 'arvores':
            return title.includes('árvore');
          case 'enfeites':
            return title.includes('guirlanda') || title.includes('luz') || title.includes('festão') || title.includes('boneco');
          case 'loucas':
            return title.includes('porcelana') || title.includes('conjunto') || title.includes('talher') || title.includes('mesa');
          case 'acessorios':
            return title.includes('saia') || title.includes('bolinha') || title.includes('presépio');
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [products, searchTerm, selectedCategory]);

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page quando filtros mudam
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
        />
      </div>

      {/* Filtros por Categoria */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Contador de Resultados */}
      <div className="text-gray-600">
        Mostrando {paginatedProducts.length} de {filteredProducts.length} produtos
        {searchTerm && ` para "${searchTerm}"`}
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mensagem se não houver resultados */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Mostrar apenas algumas páginas (primeira, última, atual e adjacentes)
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === page
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="px-2">...</span>;
            }
            return null;
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
