'use client';

import { useEffect, useState, useRef } from 'react';
import { CheckCircle, Copy, Loader2, QrCode as QrCodeIcon, X } from 'lucide-react';
import QRCode from 'qrcode';

interface PixPaymentProps {
  transactionId: string;
  qrCode: string;
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
  customerEmail?: string;
  customerData?: {
    nome: string;
    telefone: string;
    cpf: string;
  };
  items?: Array<{
    titulo: string;
    quantidade: number;
    preco: number;
  }>;
}

export default function PixPayment({ 
  transactionId, 
  qrCode, 
  amount, 
  onSuccess, 
  onClose,
  customerEmail,
  customerData,
  items 
}: PixPaymentProps) {
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'waiting' | 'paid' | 'error'>('waiting');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const pollingRef = useRef<NodeJS.Timeout>();

  // Gerar imagem do QR Code
  useEffect(() => {
    QRCode.toDataURL(qrCode, { width: 300, margin: 1 })
      .then(setQrCodeImage)
      .catch(() => {});
  }, [qrCode]);

  // Polling para verificar pagamento
  useEffect(() => {
    const checkPayment = async () => {
      try {
        const response = await fetch(`/api/payment/status/${transactionId}`);
        const data = await response.json();

        if (data.success && data.isPaid) {
          
          setStatus('paid');
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
          }
          
          // 1. Atualizar status no banco de dados
          try {
            await fetch('/api/pedidos/atualizar-status', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                transactionId: transactionId,
                status: 'PAID'
              })
            });
          } catch (err) {
            // Erro ao atualizar status
          }

          // 2. Disparar conversão Google Ads
          const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';
          const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || '';
          
          if (typeof window !== 'undefined' && (window as any).gtag && GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL) {
            const conversionTag = `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`;
            const valorReal = amount / 100;
            
            (window as any).gtag('event', 'conversion', {
              'send_to': conversionTag,
              'value': valorReal,
              'currency': 'BRL',
              'transaction_id': transactionId
            });
          }

          // 3. Enviar evento PAID para Utmify
          if (customerEmail && items) {
            try {
              await fetch('/api/utmify/evento', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  evento: 'paid',
                  transactionId: transactionId,
                  email: customerEmail,
                  nome: customerData?.nome || '',
                  telefone: customerData?.telefone || '',
                  cpf: customerData?.cpf || '',
                  valor: amount / 100,
                  items: items
                })
              });
            } catch (utmifyError) {
              // Erro ao enviar evento Utmify
            }
          }
        }
      } catch (error) {
        // Erro ao verificar pagamento
      }
    };

    // Verificar a cada 5 segundos
    pollingRef.current = setInterval(checkPayment, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [transactionId, onSuccess]);

  // Timer de expiração
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'paid') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full my-8">
          <div className="text-center mb-6">
            <CheckCircle className="mx-auto text-green-600 mb-4 animate-bounce" size={80} />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">🎉 Pagamento Confirmado!</h2>
            <p className="text-lg text-gray-600">Seu pedido foi recebido com sucesso!</p>
          </div>

          {/* Informações do Pedido */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 font-medium text-center">
              Número do Pedido: <span className="font-mono text-base">{transactionId}</span>
            </p>
            {customerEmail && (
              <p className="text-sm text-green-700 mt-2 text-center">
                📧 Enviamos um email de confirmação para: <strong>{customerEmail}</strong>
              </p>
            )}
          </div>

          {/* Próximos Passos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-blue-900 mb-4 text-lg">📦 Próximos Passos:</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start gap-3">
                <span className="font-bold text-lg">1.</span>
                <div>
                  <p className="font-semibold">Preparação do Pedido</p>
                  <p className="text-blue-700">Vamos separar e embalar seus produtos com todo cuidado.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-lg">2.</span>
                <div>
                  <p className="font-semibold">Envio para Transportadora</p>
                  <p className="text-blue-700">Assim que enviarmos, você receberá um <strong>email com o código de rastreio</strong> para acompanhar a entrega.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-lg">3.</span>
                <div>
                  <p className="font-semibold">Acompanhe sua Entrega</p>
                  <p className="text-blue-700">Use o código de rastreio para ver onde seu pedido está em tempo real.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botão para Continuar */}
          <button
            onClick={onSuccess}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Continuar Navegando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Pagamento via PIX</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Timer */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-center">
          <p className="text-sm text-red-800">
            ⏱️ Tempo restante: <strong>{formatTime(timeLeft)}</strong>
          </p>
        </div>

        {/* Valor */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-gray-600 mb-1">Valor a pagar</p>
          <p className="text-3xl font-bold text-red-600">
            R$ {(amount / 100).toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* QR Code */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 flex items-center gap-2">
              <QrCodeIcon className="text-red-600" size={24} />
              <p className="font-semibold text-gray-800">Escaneie o QR Code</p>
            </div>
            
            {qrCodeImage ? (
              <img src={qrCodeImage} alt="QR Code PIX" className="w-64 h-64" />
            ) : (
              <div className="w-64 h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <Loader2 className="animate-spin text-red-600" size={20} />
              <p className="text-sm text-gray-600">Aguardando pagamento...</p>
            </div>
          </div>
        </div>

        {/* Código PIX Copia e Cola */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ou pague com PIX Copia e Cola
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrCode}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-gray-50"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle size={18} />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Como pagar:</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Abra o app do seu banco</li>
            <li>2. Escolha pagar com PIX</li>
            <li>3. Escaneie o QR Code ou cole o código</li>
            <li>4. Confirme o pagamento</li>
            <li>5. Pronto! Você receberá a confirmação aqui</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
