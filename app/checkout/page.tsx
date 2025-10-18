'use client';

import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, Truck, Shield } from 'lucide-react';
import PixPayment from '@/components/PixPayment';

// Forçar página a ser dinâmica (não fazer pre-render estático)
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cepLoaded, setCepLoaded] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [pixData, setPixData] = useState<{
    transactionId: string;
    qrCode: string;
    amount: number;
  } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    // Dados Pessoais
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    
    // Endereço
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    
    // Pagamento
    metodoPagamento: 'pix',
  });

  // Redirecionar se carrinho estiver vazio (apenas no cliente)
  useEffect(() => {
    if (items.length === 0) {
      router.push('/carrinho');
    }
  }, [items.length, router]);

  // Não renderizar nada se carrinho estiver vazio
  if (items.length === 0) {
    return null;
  }

  const total = getCartTotal();

  // Função para formatar CPF: XXX.XXX.XXX-XX
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  // Função para formatar telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        // Formato: (XX) XXXX-XXXX
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        // Formato: (XX) XXXXX-XXXX
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    return value;
  };

  // Função para formatar CEP: XXXXX-XXX
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  // Função para remover formatação (enviar apenas números)
  const removeFormatting = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Aplicar formatação conforme o campo
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
      
      // Buscar CEP automaticamente quando completar 8 dígitos
      const cepNumeros = value.replace(/\D/g, '');
      if (cepNumeros.length === 8 && !loadingCep) {
        // Aguardar um pouco para garantir que o estado foi atualizado
        setTimeout(() => {
          buscarCepAutomatico(cepNumeros);
        }, 100);
      } else if (cepNumeros.length < 8 && cepLoaded) {
        // Limpar campos se o usuário apagar o CEP
        setCepLoaded(false);
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mostrar modal de confirmação primeiro
    setShowConfirmModal(true);
  };

  const processPayment = async () => {
    setIsProcessing(true);

    try {
      // Preparar dados do pedido
      const totalCentavos = Math.round(total * 100);
      
      const payload = {
        amount: totalCentavos,
        customer: {
          name: formData.nome,
          email: formData.email,
          document: {
            number: removeFormatting(formData.cpf) // Remove formatação do CPF
          },
          phone: removeFormatting(formData.telefone), // Remove formatação do telefone
          address: {
            street: formData.endereco,
            streetNumber: formData.numero,
            complement: formData.complemento,
            zipCode: removeFormatting(formData.cep), // Remove formatação do CEP
            neighborhood: formData.bairro,
            city: formData.cidade,
            state: formData.estado
          }
        },
        items: items.map(item => {
          const preco = item.selectedVariant?.price || item.product.priceWithDiscount || item.product.price;
          return {
            title: item.product.title + (item.selectedVariant ? ` - ${item.selectedVariant.name}` : ''),
            unitPrice: Math.round(preco * 100),
            quantity: item.quantity,
            externalRef: item.product.id
          };
        }),
        metadata: {
          items: items.map(item => ({
            produtoId: item.product.id,
            slug: item.product.slug,
            varianteId: item.selectedVariant?.id,
            quantidade: item.quantity
          }))
        }
      };

      // Chamar API de pagamento
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        // Salvar pedido no banco de dados
        await fetch('/api/pedidos/criar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            transactionId: data.transactionId,
            nome: formData.nome,
            email: formData.email,
            telefone: removeFormatting(formData.telefone),
            cpf: removeFormatting(formData.cpf),
            cep: removeFormatting(formData.cep),
            endereco: formData.endereco,
            numero: formData.numero,
            complemento: formData.complemento,
            bairro: formData.bairro,
            cidade: formData.cidade,
            estado: formData.estado,
            items: items.map(item => ({
              produtoId: item.product.id,
              titulo: item.product.title,
              slug: item.product.slug,
              varianteId: item.selectedVariant?.id,
              variante: item.selectedVariant?.name,
              quantidade: item.quantity,
              preco: item.selectedVariant?.price || item.product.priceWithDiscount || item.product.price
            })),
            total: total,
            status: 'AGUARDANDO_PAGAMENTO'
          })
        });

        // Enviar email de QR Code gerado (pedido aguardando pagamento)
        try {
          await fetch('/api/email/aguardando-pagamento', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nomeCliente: formData.nome,
              email: formData.email,
              transactionId: data.transactionId,
              items: items.map(item => ({
                titulo: item.product.title + (item.selectedVariant ? ` - ${item.selectedVariant.name}` : ''),
                quantidade: item.quantity,
                preco: item.selectedVariant?.price || item.product.priceWithDiscount || item.product.price
              })),
              total: total,
              endereco: {
                cep: removeFormatting(formData.cep),
                endereco: formData.endereco,
                numero: formData.numero,
                complemento: formData.complemento,
                bairro: formData.bairro,
                cidade: formData.cidade,
                estado: formData.estado
              }
            })
          });
          console.log('📧 Email de QR Code gerado enviado');
        } catch (emailError) {
          console.error('⚠️ Erro ao enviar email de QR Code:', emailError);
          // Não bloqueia o fluxo se email falhar
        }

        // Enviar evento PENDING para Utmify
        try {
          await fetch('/api/utmify/evento', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              evento: 'pending',
              transactionId: data.transactionId,
              email: formData.email,
              nome: formData.nome,
              telefone: removeFormatting(formData.telefone),
              cpf: removeFormatting(formData.cpf),
              valor: total,
              items: items.map(item => ({
                titulo: item.product.title + (item.selectedVariant ? ` - ${item.selectedVariant.name}` : ''),
                quantidade: item.quantity,
                preco: item.selectedVariant?.price || item.product.priceWithDiscount || item.product.price
              }))
            })
          });
          console.log('🔔 Evento PENDING enviado para Utmify');
        } catch (utmifyError) {
          console.error('⚠️ Erro ao enviar evento Utmify:', utmifyError);
          // Não bloqueia o fluxo se Utmify falhar
        }

        // Exibir modal do PIX
        setPixData({
          transactionId: data.transactionId,
          qrCode: data.qrCode,
          amount: data.amount
        });
      } else {
        throw new Error(data.error || 'Erro ao criar pagamento');
      }
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      alert('Erro ao processar pedido. Tente novamente.');
      setIsProcessing(false);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handlePixSuccess = () => {
    clearCart();
    
    // Redirecionar para página de sucesso com dados do pedido
    const params = new URLSearchParams({
      transactionId: pixData?.transactionId || '',
      valor: (pixData?.amount ? (pixData.amount / 100).toFixed(2) : '0'),
      email: formData.email
    });
    
    router.push(`/sucesso?${params.toString()}`);
  };

  const handlePixClose = () => {
    setPixData(null);
    setIsProcessing(false);
  };

  const buscarCepAutomatico = async (cep: string) => {
    if (cep.length !== 8) return;

    setLoadingCep(true);

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
      
      if (!response.ok) {
        throw new Error('CEP não encontrado');
      }

      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        endereco: data.street || '',
        bairro: data.neighborhood || '',
        cidade: data.city || '',
        estado: data.state || '',
      }));

      setCepLoaded(true);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alert('CEP não encontrado. Verifique e tente novamente.');
      setCepLoaded(false);
    } finally {
      setLoadingCep(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Dados Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    required
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Endereço de Entrega */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Endereço de Entrega</h2>
              
              {/* Campo CEP */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    required
                    placeholder="00000-000"
                    maxLength={9}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {loadingCep && (
                    <p className="text-sm text-blue-600 mt-1">🔍 Buscando endereço...</p>
                  )}
                </div>

                {/* Campos que aparecem após buscar CEP */}
                {cepLoaded && (
                  <>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                      <Truck className="text-gray-700 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-gray-800">Prazo de Entrega</p>
                        <p className="text-sm text-gray-700">Receba em 7 a 15 dias úteis após a confirmação do pagamento</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
                        <input
                          type="text"
                          name="endereco"
                          value={formData.endereco}
                          onChange={handleInputChange}
                          required
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                        <input
                          type="text"
                          name="bairro"
                          value={formData.bairro}
                          onChange={handleInputChange}
                          required
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                        <input
                          type="text"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          required
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                        <input
                          type="text"
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          required
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                      <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleInputChange}
                        required
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                      <input
                        type="text"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleInputChange}
                        placeholder="Apto, Bloco, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Forma de Pagamento</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-red-500 bg-red-50 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="metodoPagamento"
                    value="pix"
                    checked={formData.metodoPagamento === 'pix'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600"
                  />
                  <CreditCard className="text-red-600" size={24} />
                  <div>
                    <p className="font-medium text-red-700">PIX</p>
                    <p className="text-sm text-red-600">Aprovação imediata • Desconto de 5%</p>
                  </div>
                </label>
                
                {/* Opções desabilitadas */}
                <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed bg-gray-50">
                  <input
                    type="radio"
                    disabled
                    className="w-4 h-4"
                  />
                  <CreditCard className="text-gray-400" size={24} />
                  <div>
                    <p className="font-medium text-gray-500">Boleto Bancário</p>
                    <p className="text-sm text-gray-400">Indisponível no momento</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed bg-gray-50">
                  <input
                    type="radio"
                    disabled
                    className="w-4 h-4"
                  />
                  <CreditCard className="text-gray-400" size={24} />
                  <div>
                    <p className="font-medium text-gray-500">Cartão de Crédito</p>
                    <p className="text-sm text-gray-400">Indisponível no momento</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
            </button>
          </form>
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h2>

            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {items.map((item) => {
                const price = item.selectedVariant?.price || item.product.priceWithDiscount || item.product.price;
                const mainImage = item.product.images.find(img => img.position === 0) || item.product.images[0];

                return (
                  <div key={`${item.product.id}-${item.selectedVariant?.id || 'no-variant'}`} className="flex gap-3">
                    {mainImage && (
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={mainImage.imageUrl}
                          alt={item.product.title}
                          fill
                          className="object-cover rounded"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.product.title}</p>
                      {item.selectedVariant && (
                        <p className="text-xs text-gray-600">{item.selectedVariant.name}</p>
                      )}
                      <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                      <p className="text-sm font-bold text-red-600">
                        R$ {(price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span className="text-red-600 font-medium">Grátis</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-3">
                <span>Total</span>
                <span className="text-red-600">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-red-600" />
                <span>Frete grátis para todo o Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-red-600" />
                <span>Compra 100% segura</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Confirme seus dados antes de continuar</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-sm text-gray-800 leading-relaxed">
                  Por favor, <strong>revise seus dados com atenção</strong>. Informações incorretas podem causar problemas na entrega e na emissão da nota fiscal.
                </p>
              </div>

              {/* Dados Pessoais */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 text-lg border-b pb-2">Dados Pessoais</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Nome:</span>
                    <span className="text-gray-800">{formData.nome}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Email:</span>
                    <span className="text-gray-800">{formData.email}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Telefone:</span>
                    <span className="text-gray-800">{formData.telefone}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">CPF:</span>
                    <span className="text-gray-800">{formData.cpf}</span>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 text-lg border-b pb-2">Endereço de Entrega</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">CEP:</span>
                    <span className="text-gray-800">{formData.cep}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Endereço:</span>
                    <span className="text-gray-800">{formData.endereco}, {formData.numero}</span>
                  </div>
                  {formData.complemento && (
                    <div className="flex">
                      <span className="font-semibold text-gray-700 w-32">Complemento:</span>
                      <span className="text-gray-800">{formData.complemento}</span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Bairro:</span>
                    <span className="text-gray-800">{formData.bairro}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Cidade:</span>
                    <span className="text-gray-800">{formData.cidade} - {formData.estado}</span>
                  </div>
                </div>
              </div>

              {/* Avisos Importantes */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-gray-800 mb-3">📌 Informações Importantes:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">•</span>
                    <span><strong>Email:</strong> Certifique-se de que o email está correto. Você receberá atualizações do pedido neste endereço.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">•</span>
                    <span><strong>CPF:</strong> O CPF será usado para emissão da nota fiscal. Dados incorretos podem causar problemas fiscais.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">•</span>
                    <span><strong>Endereço:</strong> Confira se o endereço está completo. Use o campo "Complemento" para informações adicionais (apartamento, bloco, etc).</span>
                  </li>
                </ul>
              </div>

              {/* Botões */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                  disabled={isProcessing}
                >
                  ← Voltar e Corrigir
                </button>
                <button
                  type="button"
                  onClick={processPayment}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
                >
                  {isProcessing ? 'Gerando QR Code...' : 'Confirmar e Gerar QR Code →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento PIX */}
      {pixData && (
        <PixPayment
          transactionId={pixData.transactionId}
          qrCode={pixData.qrCode}
          amount={pixData.amount}
          onSuccess={handlePixSuccess}
          onClose={handlePixClose}
          customerEmail={formData.email}
          customerData={{
            nome: formData.nome,
            telefone: removeFormatting(formData.telefone),
            cpf: removeFormatting(formData.cpf)
          }}
          items={items.map(item => ({
            titulo: item.product.title + (item.selectedVariant ? ` - ${item.selectedVariant.name}` : ''),
            quantidade: item.quantity,
            preco: item.selectedVariant?.price || item.product.priceWithDiscount || item.product.price
          }))}
        />
      )}
    </>
  );
}
