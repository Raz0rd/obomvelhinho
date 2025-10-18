'use client';

import { useState } from 'react';
import { CheckCircle, Zap } from 'lucide-react';

export default function TesteConversaoPage() {
  const [enviado, setEnviado] = useState(false);
  const [ultimaConversao, setUltimaConversao] = useState<any>(null);

  const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';
  const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || '';

  const enviarConversao = () => {
    if (typeof window !== 'undefined' && (window as any).gtag && GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL) {
      const conversionTag = `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`;
      const valorTeste = 1.00;
      const transactionIdTeste = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      (window as any).gtag('event', 'conversion', {
        'send_to': conversionTag,
        'value': valorTeste,
        'currency': 'BRL',
        'transaction_id': transactionIdTeste
      });
      
      setEnviado(true);
      setUltimaConversao({
        tag: conversionTag,
        valor: valorTeste,
        transactionId: transactionIdTeste,
        timestamp: new Date().toLocaleString('pt-BR')
      });
      
      setTimeout(() => setEnviado(false), 3000);
    } else {
      alert('❌ Google Ads não configurado! Verifique as variáveis de ambiente NEXT_PUBLIC_GOOGLE_ADS_ID e NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL');
    }
  };

  const configurado = GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL;
  const gtagDisponivel = typeof window !== 'undefined' && !!(window as any).gtag;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-6">
              <Zap className="mx-auto text-blue-600 mb-4" size={60} />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🧪 Teste de Conversão Google Ads
              </h1>
              <p className="text-gray-600">
                Use esta página para testar e ativar o rastreamento de conversões.
              </p>
            </div>

            {/* Status de Configuração */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">📋 Status da Configuração:</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Google Ads ID:</span>
                  <span className={`font-mono text-sm px-3 py-1 rounded ${GOOGLE_ADS_ID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {GOOGLE_ADS_ID || '❌ NÃO CONFIGURADO'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Conversion Label:</span>
                  <span className={`font-mono text-sm px-3 py-1 rounded ${GOOGLE_ADS_CONVERSION_LABEL ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {GOOGLE_ADS_CONVERSION_LABEL || '❌ NÃO CONFIGURADO'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">gtag() disponível:</span>
                  <span className={`font-mono text-sm px-3 py-1 rounded ${gtagDisponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {gtagDisponivel ? '✅ SIM' : '❌ NÃO'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botão de Teste */}
            <div className="text-center">
              <button
                onClick={enviarConversao}
                disabled={!configurado || !gtagDisponivel}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                  configurado && gtagDisponivel
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {enviado ? '✅ Conversão Enviada!' : '🚀 Enviar Conversão de Teste'}
              </button>
              
              {!configurado && (
                <p className="text-red-600 text-sm mt-3">
                  ⚠️ Configure as variáveis de ambiente antes de testar
                </p>
              )}
            </div>
          </div>

          {/* Última Conversão Enviada */}
          {ultimaConversao && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-600" size={32} />
                <h3 className="font-bold text-green-900 text-xl">Última Conversão Enviada</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-800 font-semibold">Tag de Conversão:</span>
                  <code className="bg-white px-2 py-1 rounded text-green-900">{ultimaConversao.tag}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-800 font-semibold">Valor:</span>
                  <code className="bg-white px-2 py-1 rounded text-green-900">R$ {ultimaConversao.valor.toFixed(2)}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-800 font-semibold">Transaction ID:</span>
                  <code className="bg-white px-2 py-1 rounded text-green-900 text-xs">{ultimaConversao.transactionId}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-800 font-semibold">Horário:</span>
                  <code className="bg-white px-2 py-1 rounded text-green-900">{ultimaConversao.timestamp}</code>
                </div>
              </div>
            </div>
          )}

          {/* Instruções */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="font-bold text-gray-800 mb-3 text-lg">📖 Como Usar:</h3>
            <ol className="space-y-2 text-gray-700 text-sm">
              <li><strong>1.</strong> Certifique-se de que as variáveis de ambiente estão configuradas</li>
              <li><strong>2.</strong> Clique no botão "Enviar Conversão de Teste"</li>
              <li><strong>3.</strong> A conversão será enviada para o Google Ads com valor de R$ 1,00</li>
              <li><strong>4.</strong> Aguarde alguns minutos e verifique no Google Ads se a conversão foi registrada</li>
              <li><strong>5.</strong> Use esta página quantas vezes precisar para ativar/testar</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
}
