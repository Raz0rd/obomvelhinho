import { NextResponse } from 'next/server';
import { checkIpWhitelist } from '@/lib/ipWhitelist';

export async function GET() {
  const { allowed, clientIp } = checkIpWhitelist();

  if (!allowed) {
    console.warn(`[ADMIN] Acesso negado para IP: ${clientIp}`);
    return NextResponse.json(
      {
        allowed: false,
        clientIp,
        message: 'Acesso negado. IP não autorizado.'
      },
      { status: 403 }
    );
  }

  console.log(`[ADMIN] Acesso permitido para IP: ${clientIp}`);
  return NextResponse.json({
    allowed: true,
    clientIp,
    message: 'Acesso autorizado.'
  });
}
