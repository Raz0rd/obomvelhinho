import { NextRequest, NextResponse } from 'next/server';

const UMBRELA_API_KEY = process.env.UMBRELA_API_KEY || '84f2022f-a84b-4d63-a727-1780e6261fe8';
const UMBRELA_API_URL = process.env.UMBRELA_API_URL || 'https://api-gateway.umbrellapag.com/api';
const UMBRELA_USER_AGENT = process.env.UMBRELA_USER_AGENT || 'UMBRELLAB2B/1.0';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados obrigatórios
    if (!body.customer?.name || !body.customer?.email || !body.customer?.document?.number) {
      return NextResponse.json(
        { error: 'Dados do cliente incompletos' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum item no pedido' },
        { status: 400 }
      );
    }

    // Preparar dados para a API Umbrela
    const umbrellaPayload = {
      amount: body.amount,
      currency: 'BRL',
      paymentMethod: 'PIX',
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        document: {
          number: body.customer.document.number.replace(/\D/g, ''), // Remove formatação
          type: 'CPF'
        },
        phone: body.customer.phone.replace(/\D/g, ''),
        externalRef: body.customer.externalRef || '',
        address: {
          street: body.customer.address.street,
          streetNumber: body.customer.address.streetNumber,
          complement: body.customer.address.complement || '',
          zipCode: body.customer.address.zipCode.replace(/\D/g, ''),
          neighborhood: body.customer.address.neighborhood,
          city: body.customer.address.city,
          state: body.customer.address.state,
          country: 'br'
        }
      },
      shipping: {
        fee: 0,
        address: {
          street: body.customer.address.street,
          streetNumber: body.customer.address.streetNumber,
          complement: body.customer.address.complement || '',
          zipCode: body.customer.address.zipCode.replace(/\D/g, ''),
          neighborhood: body.customer.address.neighborhood,
          city: body.customer.address.city,
          state: body.customer.address.state,
          country: 'br'
        }
      },
      items: body.items.map((item: any) => ({
        title: item.title,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        tangible: true,
        externalRef: item.externalRef || ''
      })),
      pix: {
        expiresInDays: 1
      },
      postbackUrl: '',
      metadata: JSON.stringify(body.metadata || {}),
      traceable: true,
      ip: request.headers.get('x-forwarded-for') || '0.0.0.0'
    };

    // Chamar API Umbrela
    const response = await fetch(`${UMBRELA_API_URL}/user/transactions`, {
      method: 'POST',
      headers: {
        'x-api-key': UMBRELA_API_KEY,
        'User-Agent': UMBRELA_USER_AGENT,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(umbrellaPayload)
    });

    const result = await response.json();

    if (result.status === 200 || response.ok) {
      return NextResponse.json({
        success: true,
        transactionId: result.data.id,
        qrCode: result.data.qrCode,
        status: result.data.status,
        amount: result.data.amount,
        expirationDate: result.data.pix?.expirationDate
      });
    }

    return NextResponse.json(
      { error: result.message || 'Erro ao criar transação' },
      { status: response.status }
    );

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar pagamento' },
      { status: 500 }
    );
  }
}
