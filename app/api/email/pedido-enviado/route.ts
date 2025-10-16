import { NextRequest, NextResponse } from 'next/server';
import { enviarEmailPedidoEnviado } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { nomeCliente, email, transactionId, codigoRastreio } = body;

    // Validação básica
    if (!nomeCliente || !email || !transactionId || !codigoRastreio) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Enviar email
    const result = await enviarEmailPedidoEnviado({
      nomeCliente,
      email,
      transactionId,
      codigoRastreio,
    });

    if (!result.success) {
      throw new Error('Falha ao enviar email');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email de rastreio enviado com sucesso',
      data: result.data
    });
  } catch (error) {
    console.error('Erro ao processar envio de email:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao enviar email' },
      { status: 500 }
    );
  }
}
