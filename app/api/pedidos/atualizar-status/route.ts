import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { enviarEmailPedidoConfirmado } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { transactionId, status } = await request.json();

    if (!transactionId || !status) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID e status são obrigatórios' },
        { status: 400 }
      );
    }

    // Atualizar status no banco
    const stmt = db.prepare(`
      UPDATE pedidos 
      SET status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE transaction_id = ?
    `);

    stmt.run(status, transactionId);

    // Se o status for PAID, buscar dados do pedido e enviar email
    if (status === 'PAID') {
      try {
        const pedido = db.prepare(`
          SELECT * FROM pedidos WHERE transaction_id = ?
        `).get(transactionId) as any;

        if (pedido) {
          // Parse dos items
          const items = JSON.parse(pedido.items);

          // Enviar email de confirmação
          await enviarEmailPedidoConfirmado({
            nomeCliente: pedido.nome,
            email: pedido.email,
            transactionId: pedido.transaction_id,
            items: items,
            total: pedido.total,
            endereco: {
              cep: pedido.cep,
              endereco: pedido.endereco,
              numero: pedido.numero,
              complemento: pedido.complemento,
              bairro: pedido.bairro,
              cidade: pedido.cidade,
              estado: pedido.estado,
            },
          });

          console.log(`✅ Email de confirmação enviado para ${pedido.email}`);
        }
      } catch (emailError) {
        console.error('⚠️ Erro ao enviar email (pedido atualizado com sucesso):', emailError);
        // Não falha a requisição se o email falhar
      }
    }

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
