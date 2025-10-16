'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck } from 'lucide-react';
import Link from 'next/link';

function SucessoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const transactionId = searchParams.get('transactionId');
  const valor = searchParams.get('valor');
  const email = searchParams.get('email');

  useEffect(() => {
    // Se não tem transactionId, redireciona para home
    if (!transactionId) {
      router.push('/');
      return;
    }

    // Google Ads Conversion Tracking - Dispara quando STATUS = PAID
    if (typeof window !== 'undefined' && (window as any).gtag) {
      console.log('🎯 Disparando conversão Google Ads (PAID)');
      console.log('🎯 Send To: AW-17655865530/QnNvCP_jsq4bELrB_OJB');
      console.log('🎯 Transaction ID:', transactionId);
      console.log('🎯 Valor:', valor);
      
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-17655865530/QnNvCP_jsq4bELrB_OJB',
        'value': valor ? parseFloat(valor) : 1.0,
        'currency': 'BRL',
        'transaction_id': transactionId
      });
      
      console.log('✅ Conversão Google Ads disparada com sucesso!');
    }

    // Google Analytics 4 - Purchase Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: valor ? parseFloat(valor) : 0,
        currency: 'BRL',
        items: []
      });
    }

    // Meta Pixel - Purchase Event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: valor ? parseFloat(valor) : 0,
        currency: 'BRL',
        transaction_id: transactionId
      });
    }
  }, [transactionId, valor, router]);

  if (!transactionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Sucesso */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
            <div className="mb-6">
              <CheckCircle className="mx-auto text-green-600 animate-bounce" size={80} />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              🎉 Pagamento Confirmado!
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Obrigado pela sua compra! Seu pedido foi confirmado e está sendo processado.
            </p>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 font-medium">
                Número do Pedido: <span className="font-mono">{transactionId}</span>
              </p>
              {email && (
                <p className="text-sm text-green-700 mt-2">
                  Enviamos um email de confirmação para: <strong>{email}</strong>
                </p>
              )}
            </div>

            {valor && (
              <p className="text-2xl font-bold text-green-600 mb-6">
                Valor: R$ {parseFloat(valor).toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>

          {/* Próximos Passos */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Próximos Passos</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Package className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">1. Preparação do Pedido</h3>
                  <p className="text-gray-600 text-sm">
                    Vamos separar e embalar seus produtos com todo cuidado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <Truck className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">2. Envio</h3>
                  <p className="text-gray-600 text-sm">
                    Você receberá o código de rastreio por email assim que o pedido for enviado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 rounded-full p-3">
                  <CheckCircle className="text-yellow-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">3. Recebimento</h3>
                  <p className="text-gray-600 text-sm">
                    Acompanhe a entrega e prepare-se para receber seu pedido!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-center transition"
            >
              Continuar Comprando
            </Link>
            <Link 
              href="/contato"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg text-center transition"
            >
              Precisa de Ajuda?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}
