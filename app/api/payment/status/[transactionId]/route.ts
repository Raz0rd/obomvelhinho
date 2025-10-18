import { NextRequest, NextResponse } from 'next/server';

const UMBRELA_API_KEY = process.env.UMBRELA_API_KEY || '84f2022f-a84b-4d63-a727-1780e6261fe8';
const UMBRELA_API_URL = process.env.UMBRELA_API_URL || 'https://api-gateway.umbrellapag.com/api';
const UMBRELA_USER_AGENT = process.env.UMBRELA_USER_AGENT || 'UMBRELLAB2B/1.0';

// Desabilitar cache para esta rota (importante para polling de pagamento)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = params;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'ID da transação não fornecido' },
        { status: 400 }
      );
    }

    console.log('🔍 [STATUS-API] Consultando status na Umbrela...');
    console.log('🔍 [STATUS-API] Transaction ID:', transactionId);
    console.log('🔍 [STATUS-API] URL:', `${UMBRELA_API_URL}/user/transactions/${transactionId}`);

    // Consultar status na API Umbrela
    const response = await fetch(
      `${UMBRELA_API_URL}/user/transactions/${transactionId}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': UMBRELA_API_KEY,
          'User-Agent': UMBRELA_USER_AGENT
        },
        cache: 'no-store' // Forçar não usar cache
      }
    );

    const result = await response.json();
    
    console.log('📊 [STATUS-API] Resposta da Umbrela:');
    console.log('📊 [STATUS-API] Status HTTP:', response.status);
    console.log('📊 [STATUS-API] Status Transação:', result.data?.status);
    console.log('📊 [STATUS-API] Pago?:', result.data?.status === 'PAID');

    if (result.status === 200 || response.ok) {
      return NextResponse.json({
        success: true,
        transactionId: result.data.id,
        status: result.data.status,
        amount: result.data.amount,
        paymentMethod: result.data.paymentMethod,
        paidAt: result.data.paidAt,
        isPaid: result.data.status === 'PAID'
      });
    }

    return NextResponse.json(
      { error: result.message || 'Erro ao consultar transação' },
      { status: response.status }
    );

  } catch (error) {
    console.error('Erro ao consultar status:', error);
    return NextResponse.json(
      { error: 'Erro interno ao consultar pagamento' },
      { status: 500 }
    );
  }
}
