// Integração com Utmify para rastreamento de conversões

export async function enviarEventoUtmify(evento: 'pending' | 'paid', dados: {
  transactionId: string;
  email: string;
  valor: number;
  items: Array<{
    titulo: string;
    quantidade: number;
    preco: number;
  }>;
}) {
  try {
    console.log(`🔔 [UTMIFY] Enviando evento: ${evento}`);
    console.log(`🔔 [UTMIFY] Transaction ID: ${dados.transactionId}`);
    console.log(`🔔 [UTMIFY] Valor: R$ ${dados.valor}`);

    // Preparar dados para Utmify
    const payload = {
      event: evento,
      transaction_id: dados.transactionId,
      email: dados.email,
      value: dados.valor,
      currency: 'BRL',
      items: dados.items.map(item => ({
        name: item.titulo,
        quantity: item.quantidade,
        price: item.preco
      }))
    };

    // Enviar para Utmify
    const response = await fetch('https://api.utmify.com.br/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Adicione sua API Key do Utmify se necessário
        // 'Authorization': `Bearer ${process.env.UTMIFY_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ [UTMIFY] Evento ${evento} enviado com sucesso!`);
      console.log(`✅ [UTMIFY] Response:`, result);
      return { success: true, data: result };
    } else {
      const error = await response.text();
      console.error(`❌ [UTMIFY] Erro ao enviar evento ${evento}:`, error);
      return { success: false, error };
    }
  } catch (error: any) {
    console.error(`❌ [UTMIFY] Exceção ao enviar evento ${evento}:`, error);
    console.error(`❌ [UTMIFY] Message:`, error?.message);
    return { success: false, error };
  }
}
