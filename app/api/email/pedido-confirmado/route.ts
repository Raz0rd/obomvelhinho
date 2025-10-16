import { NextRequest, NextResponse } from 'next/server';
import { enviarEmailPedidoConfirmado } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { nomeCliente, email, transactionId, items, total, endereco } = body;

    // Validação básica
    if (!nomeCliente || !email || !transactionId || !items || !total || !endereco) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Enviar email
    const result = await enviarEmailPedidoConfirmado({
      nomeCliente,
      email,
      transactionId,
      items,
      total,
      endereco,
    });

    if (!result.success) {
      throw new Error('Falha ao enviar email');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email enviado com sucesso',
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
