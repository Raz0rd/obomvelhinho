// Integração com Utmify para rastreamento de conversões

const UTMIFY_API_URL = 'https://api.utmify.com.br/api-credentials/orders';
const UTMIFY_API_KEY = process.env.UTMIFY_API_KEY || 'SSgDqupTYOTlYTlKgcqE4bIJCoqFQvHwnnNr';

interface UtmifyEventData {
  transactionId: string;
  email: string;
  nome?: string;
  telefone?: string;
  cpf?: string;
  valor: number;
  items: Array<{
    titulo: string;
    quantidade: number;
    preco: number;
  }>;
}

export async function enviarEventoUtmify(evento: 'pending' | 'paid', dados: UtmifyEventData) {
  try {
    console.log(`🔔 [UTMIFY] Enviando evento: ${evento}`);
    console.log(`🔔 [UTMIFY] Transaction ID: ${dados.transactionId}`);
    console.log(`🔔 [UTMIFY] Valor: R$ ${dados.valor}`);

    // Mapear evento para status do Utmify
    const statusMap = {
      'pending': 'waiting_payment',
      'paid': 'paid'
    };

    // Preparar dados no formato do Utmify
    const payload = {
      orderId: dados.transactionId,
      platform: 'Obom Velhinho',
      paymentMethod: 'pix',
      status: statusMap[evento],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      approvedDate: evento === 'paid' ? new Date().toISOString().replace('T', ' ').substring(0, 19) : null,
      refundedAt: null,
      customer: {
        name: dados.nome || 'Cliente',
        email: dados.email,
        phone: dados.telefone || '',
        document: dados.cpf || '',
        country: 'BR',
        ip: ''
      },
      products: dados.items.map((item, index) => ({
        id: `product-${index}`,
        name: item.titulo,
        planId: null,
        planName: null,
        quantity: item.quantidade,
        priceInCents: Math.round(item.preco * 100) // Converter para centavos
      })),
      trackingParameters: {
        src: null,
        sck: null,
        utm_source: null,
        utm_campaign: null,
        utm_medium: null,
        utm_content: null,
        utm_term: null
      },
      commission: {
        totalPriceInCents: Math.round(dados.valor * 100),
        gatewayFeeInCents: 0,
        userCommissionInCents: Math.round(dados.valor * 100)
      },
      isTest: false
    };

    console.log('🔔 [UTMIFY] Payload:', JSON.stringify(payload, null, 2));

    // Enviar para Utmify
    const response = await fetch(UTMIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': UTMIFY_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log('🔔 [UTMIFY] Response status:', response.status);
    console.log('🔔 [UTMIFY] Response body:', responseText);

    if (response.ok) {
      console.log(`✅ [UTMIFY] Evento ${evento} enviado com sucesso!`);
      return { success: true, data: responseText };
    } else {
      console.error(`❌ [UTMIFY] Erro ao enviar evento ${evento}:`, responseText);
      return { success: false, error: responseText };
    }
  } catch (error: any) {
    console.error(`❌ [UTMIFY] Exceção ao enviar evento ${evento}:`, error);
    console.error(`❌ [UTMIFY] Message:`, error?.message);
    return { success: false, error };
  }
}
