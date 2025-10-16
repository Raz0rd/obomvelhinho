import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { checkIpWhitelist } from '@/lib/ipWhitelist';

export async function GET() {
  // Verificar IP whitelist
  const { allowed, clientIp } = checkIpWhitelist();
  
  if (!allowed) {
    console.warn(`[API Pedidos] Acesso negado para IP: ${clientIp}`);
    return NextResponse.json(
      { success: false, error: 'Acesso negado' },
      { status: 403 }
    );
  }

  try {
    const stmt = db.prepare(`
      SELECT * FROM pedidos 
      ORDER BY created_at DESC
    `);

    const pedidos = stmt.all();

    // Parse items JSON
    const pedidosFormatados = pedidos.map((pedido: any) => ({
      ...pedido,
      items: JSON.parse(pedido.items),
      enviado: Boolean(pedido.enviado)
    }));

    return NextResponse.json({
      success: true,
      pedidos: pedidosFormatados
    });
  } catch (error: any) {
    console.error('Erro ao listar pedidos:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
