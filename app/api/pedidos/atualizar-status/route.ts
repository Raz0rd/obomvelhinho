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
      console.log('💳 [ATUALIZAR-STATUS] Status PAID detectado! Preparando envio de email...');
      console.log('💳 [ATUALIZAR-STATUS] Transaction ID:', transactionId);
      
      try {
        console.log('💳 [ATUALIZAR-STATUS] Buscando pedido no banco de dados...');
        const pedido = db.prepare(`
          SELECT * FROM pedidos WHERE transaction_id = ?
        `).get(transactionId) as any;

        if (pedido) {
          console.log('💳 [ATUALIZAR-STATUS] Pedido encontrado!');
          console.log('💳 [ATUALIZAR-STATUS] Cliente:', pedido.nome);
          console.log('💳 [ATUALIZAR-STATUS] Email:', pedido.email);
          
          // Parse dos items
          const items = JSON.parse(pedido.items);
          console.log('💳 [ATUALIZAR-STATUS] Items parseados:', items.length, 'itens');

          console.log('💳 [ATUALIZAR-STATUS] Chamando enviarEmailPedidoConfirmado...');
          
          // Enviar email de confirmação
          const emailResult = await enviarEmailPedidoConfirmado({
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

          if (emailResult.success) {
            console.log(`✅ [ATUALIZAR-STATUS] Email de confirmação enviado para ${pedido.email}`);
          } else {
            console.error(`❌ [ATUALIZAR-STATUS] Falha ao enviar email para ${pedido.email}`);
            console.error('❌ [ATUALIZAR-STATUS] Erro:', emailResult.error);
          }

          // Enviar evento PAID para Utmify
          console.log('🔔 [ATUALIZAR-STATUS] Enviando evento PAID para Utmify...');
          try {
            const utmifyResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/utmify/evento`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                evento: 'paid',
                transactionId: pedido.transaction_id,
                email: pedido.email,
                valor: pedido.total,
                items: items
              })
            });
            
            if (utmifyResponse.ok) {
              console.log('✅ [ATUALIZAR-STATUS] Evento PAID enviado para Utmify');
            } else {
              console.error('❌ [ATUALIZAR-STATUS] Falha ao enviar evento PAID para Utmify');
            }
          } catch (utmifyError) {
            console.error('⚠️ [ATUALIZAR-STATUS] Erro ao enviar evento Utmify:', utmifyError);
          }
        } else {
          console.error('❌ [ATUALIZAR-STATUS] Pedido não encontrado no banco!');
        }
      } catch (emailError: any) {
        console.error('⚠️ [ATUALIZAR-STATUS] EXCEÇÃO ao enviar email (pedido atualizado com sucesso)');
        console.error('⚠️ [ATUALIZAR-STATUS] Erro:', emailError);
        console.error('⚠️ [ATUALIZAR-STATUS] Stack:', emailError?.stack);
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
