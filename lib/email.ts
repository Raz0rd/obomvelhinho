import { Resend } from 'resend';
import { render } from '@react-email/components';
import PedidoConfirmado from '@/emails/PedidoConfirmado';
import PedidoAguardandoPagamento from '@/emails/PedidoAguardandoPagamento';
import PedidoEnviado from '@/emails/PedidoEnviado';

const resend = new Resend(process.env.RESEND_API_KEY);

interface PedidoData {
  nomeCliente: string;
  email: string;
  transactionId: string;
  items: Array<{
    titulo: string;
    variante?: string;
    quantidade: number;
    preco: number;
  }>;
  total: number;
  endereco: {
    cep: string;
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

interface RastreioData {
  nomeCliente: string;
  email: string;
  transactionId: string;
  codigoRastreio: string;
}

export async function enviarEmailAguardandoPagamento(data: PedidoData) {
  console.log('📧 [EMAIL] Iniciando envio de email de pedido aguardando pagamento...');
  console.log('📧 [EMAIL] Destinatário:', data.email);
  console.log('📧 [EMAIL] Transaction ID:', data.transactionId);
  console.log('📧 [EMAIL] RESEND_API_KEY configurada:', !!process.env.RESEND_API_KEY);
  
  try {
    console.log('📧 [EMAIL] Renderizando template de aguardando pagamento...');
    const emailHtml = await render(PedidoAguardandoPagamento(data));
    console.log('📧 [EMAIL] Template renderizado com sucesso');

    console.log('📧 [EMAIL] Enviando via Resend...');
    const response = await resend.emails.send({
      from: 'Obom Velhinho <sac@obomvelhinho.store>',
      to: data.email,
      subject: `✅ Pedido Confirmado - Aguardando Pagamento #${data.transactionId}`,
      html: emailHtml,
    });

    console.log('✅ [EMAIL] Email de aguardando pagamento enviado com sucesso!');
    console.log('✅ [EMAIL] Response:', JSON.stringify(response, null, 2));
    return { success: true, data: response };
  } catch (error: any) {
    console.error('❌ [EMAIL] ERRO ao enviar email de aguardando pagamento!');
    console.error('❌ [EMAIL] Erro completo:', error);
    console.error('❌ [EMAIL] Erro message:', error?.message);
    console.error('❌ [EMAIL] Erro stack:', error?.stack);
    return { success: false, error };
  }
}

export async function enviarEmailPedidoConfirmado(data: PedidoData) {
  console.log('📧 [EMAIL] Iniciando envio de email de confirmação...');
  console.log('📧 [EMAIL] Destinatário:', data.email);
  console.log('📧 [EMAIL] Transaction ID:', data.transactionId);
  console.log('📧 [EMAIL] RESEND_API_KEY configurada:', !!process.env.RESEND_API_KEY);
  
  try {
    console.log('📧 [EMAIL] Renderizando template...');
    const emailHtml = await render(PedidoConfirmado(data));
    console.log('📧 [EMAIL] Template renderizado com sucesso');

    console.log('📧 [EMAIL] Enviando via Resend...');
    const response = await resend.emails.send({
      from: 'Obom Velhinho <sac@obomvelhinho.store>',
      to: data.email,
      subject: `🎉 Pagamento Confirmado - Pedido #${data.transactionId}`,
      html: emailHtml,
    });

    console.log('✅ [EMAIL] Email de confirmação enviado com sucesso!');
    console.log('✅ [EMAIL] Response:', JSON.stringify(response, null, 2));
    return { success: true, data: response };
  } catch (error: any) {
    console.error('❌ [EMAIL] ERRO ao enviar email de confirmação!');
    console.error('❌ [EMAIL] Erro completo:', error);
    console.error('❌ [EMAIL] Erro message:', error?.message);
    console.error('❌ [EMAIL] Erro stack:', error?.stack);
    return { success: false, error };
  }
}

export async function enviarEmailPedidoEnviado(data: RastreioData) {
  try {
    const emailHtml = await render(PedidoEnviado(data));

    const response = await resend.emails.send({
      from: 'Obom Velhinho <sac@obomvelhinho.store>',
      to: data.email,
      subject: `📦 Seu Pedido Foi Enviado - Código de Rastreio #${data.transactionId}`,
      html: emailHtml,
    });

    console.log('✅ Email de rastreio enviado:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ Erro ao enviar email de rastreio:', error);
    return { success: false, error };
  }
}
