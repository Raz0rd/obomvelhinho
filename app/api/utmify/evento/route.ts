import { NextRequest, NextResponse } from 'next/server';
import { enviarEventoUtmify } from '@/lib/utmify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { evento, transactionId, email, nome, telefone, cpf, valor, items } = body;

    // Validação
    if (!evento || !transactionId || !email || !valor || !items) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    if (evento !== 'pending' && evento !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Evento deve ser "pending" ou "paid"' },
        { status: 400 }
      );
    }

    console.log(`🔔 [API-UTMIFY] Recebido evento: ${evento}`);
    console.log(`🔔 [API-UTMIFY] Transaction ID: ${transactionId}`);

    // Enviar para Utmify
    const result = await enviarEventoUtmify(evento, {
      transactionId,
      email,
      nome,
      telefone,
      cpf,
      valor,
      items
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Evento ${evento} enviado para Utmify com sucesso`,
        data: result.data
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Falha ao enviar para Utmify', details: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ [API-UTMIFY] Erro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro no servidor', message: error.message },
      { status: 500 }
    );
  }
}
