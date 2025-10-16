import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Página não encontrada</h2>
        <p className="text-gray-500 max-w-md">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
