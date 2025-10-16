import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      transactionId,
      nome,
      email,
      telefone,
      cpf,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      items,
      total,
      status
    } = data;

    // Inserir pedido no banco
    const stmt = db.prepare(`
      INSERT INTO pedidos (
        transaction_id, nome, email, telefone, cpf,
        cep, endereco, numero, complemento, bairro, cidade, estado,
        items, total, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      transactionId,
      nome,
      email,
      telefone,
      cpf,
      cep,
      endereco,
      numero,
      complemento || '',
      bairro,
      cidade,
      estado,
      JSON.stringify(items),
      total,
      status || 'AGUARDANDO_PAGAMENTO'
    );

    return NextResponse.json({
      success: true,
      pedidoId: result.lastInsertRowid
    });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
