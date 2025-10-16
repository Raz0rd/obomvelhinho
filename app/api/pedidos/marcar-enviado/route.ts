import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { checkIpWhitelist } from '@/lib/ipWhitelist';
import { enviarEmailPedidoEnviado } from '@/lib/email';

export async function POST(request: NextRequest) {
  // Verificar IP whitelist
  const { allowed, clientIp } = checkIpWhitelist();
  
  if (!allowed) {
    console.warn(`[API Marcar Enviado] Acesso negado para IP: ${clientIp}`);
    return NextResponse.json(
      { success: false, error: 'Acesso negado' },
      { status: 403 }
    );
  }

  try {
    const { pedidoIds, codigoRastreio } = await request.json();

    if (!pedidoIds || !Array.isArray(pedidoIds) || pedidoIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDs de pedidos inválidos' },
        { status: 400 }
      );
    }

    if (!codigoRastreio) {
      return NextResponse.json(
        { success: false, error: 'Código de rastreio é obrigatório' },
        { status: 400 }
      );
    }

    const dataEnvio = new Date().toISOString();
    
    // Atualizar múltiplos pedidos
    const placeholders = pedidoIds.map(() => '?').join(',');
    const stmt = db.prepare(`
      UPDATE pedidos 
      SET enviado = 1, 
          codigo_rastreio = ?,
          data_envio = ?,
          status = 'ENVIADO',
          updated_at = CURRENT_TIMESTAMP
      WHERE id IN (${placeholders})
    `);

    stmt.run(codigoRastreio, dataEnvio, ...pedidoIds);

    // Buscar dados dos pedidos e enviar emails
    const selectStmt = db.prepare(`
      SELECT * FROM pedidos WHERE id IN (${placeholders})
    `);
    const pedidos = selectStmt.all(...pedidoIds) as any[];

    let emailsEnviados = 0;
    let emailsFalhados = 0;

    for (const pedido of pedidos) {
      try {
        await enviarEmailPedidoEnviado({
          nomeCliente: pedido.nome,
          email: pedido.email,
          transactionId: pedido.transaction_id,
          codigoRastreio: codigoRastreio,
        });
        
        console.log(`✅ Email de rastreio enviado para ${pedido.email}`);
        emailsEnviados++;
      } catch (emailError) {
        console.error(`⚠️ Erro ao enviar email para ${pedido.email}:`, emailError);
        emailsFalhados++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${pedidoIds.length} pedido(s) marcado(s) como enviado(s)`,
      emails: {
        enviados: emailsEnviados,
        falhados: emailsFalhados
      }
    });
  } catch (error: any) {
    console.error('Erro ao marcar como enviado:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
