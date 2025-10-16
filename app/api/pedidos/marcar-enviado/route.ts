import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { checkIpWhitelist } from '@/lib/ipWhitelist';

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

    stmt.run(codigoRastreio || null, dataEnvio, ...pedidoIds);

    return NextResponse.json({
      success: true,
      message: `${pedidoIds.length} pedido(s) marcado(s) como enviado(s)`
    });
  } catch (error: any) {
    console.error('Erro ao marcar como enviado:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
