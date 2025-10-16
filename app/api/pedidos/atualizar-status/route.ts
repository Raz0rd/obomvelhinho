import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { transactionId, status } = await request.json();

    if (!transactionId || !status) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID e status são obrigatórios' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      UPDATE pedidos 
      SET status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE transaction_id = ?
    `);

    stmt.run(status, transactionId);

    return NextResponse.json({
      success: true,
      message: 'Status atualizado com sucesso'
    });
  } catch (error: any) {
    console.error('Erro ao atualizar status:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
