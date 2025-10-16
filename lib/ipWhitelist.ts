import { headers } from 'next/headers';

export function checkIpWhitelist(): { allowed: boolean; clientIp: string } {
  const headersList = headers();
  
  // Obter IP do cliente (considerar proxies e Cloudflare)
  const forwarded = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const cfConnectingIp = headersList.get('cf-connecting-ip'); // Cloudflare
  
  const clientIp = cfConnectingIp || realIp || forwarded?.split(',')[0] || '127.0.0.1';
  
  // Obter whitelist do .env
  const whitelist = process.env.ADMIN_IP_WHITELIST || '127.0.0.1,::1';
  const allowedIps = whitelist.split(',').map(ip => ip.trim());
  
  // Verificar se o IP está na whitelist
  const allowed = allowedIps.includes(clientIp);
  
  console.log(`[IP Check] Cliente: ${clientIp} | Permitido: ${allowed}`);
  
  return { allowed, clientIp };
}
