import { NextRequest, NextResponse } from 'next/server';
import { enviarEmailPedidoConfirmado } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 [TEST-EMAIL] Endpoint de teste de email chamado');
    
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    console.log('🧪 [TEST-EMAIL] Enviando email de teste para:', email);

    // Dados de teste
    const testData = {
      nomeCliente: 'Cliente Teste',
      email: email,
      transactionId: 'TEST-' + Date.now(),
      items: [
        {
          titulo: 'Árvore de Natal Teste 1,80m',
          variante: 'Tamanho: 1,80m',
          quantidade: 1,
          preco: 199.90
        }
      ],
      total: 199.90,
      endereco: {
        cep: '01234-567',
        endereco: 'Rua Teste',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    };

    console.log('🧪 [TEST-EMAIL] Dados do email:', JSON.stringify(testData, null, 2));

    const result = await enviarEmailPedidoConfirmado(testData);

    if (result.success) {
      console.log('✅ [TEST-EMAIL] Email enviado com sucesso!');
      return NextResponse.json({
        success: true,
        message: 'Email de teste enviado com sucesso!',
        data: result.data
      });
    } else {
      console.error('❌ [TEST-EMAIL] Falha ao enviar email');
      return NextResponse.json(
        { success: false, error: 'Falha ao enviar email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ [TEST-EMAIL] Erro no endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Erro no servidor', message: error.message },
      { status: 500 }
    );
  }
}

// GET para verificar se o endpoint está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de teste de email funcionando',
    usage: 'POST /api/test-email com body: { "email": "seu-email@example.com" }'
  });
}
