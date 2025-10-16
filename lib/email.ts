import { Resend } from 'resend';
import { render } from '@react-email/components';
import PedidoConfirmado from '@/emails/PedidoConfirmado';
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

export async function enviarEmailPedidoConfirmado(data: PedidoData) {
  try {
    const emailHtml = await render(PedidoConfirmado(data));

    const response = await resend.emails.send({
      from: 'Obom Velhinho <sac@obomvelhinho.store>',
      to: data.email,
      subject: `🎉 Pagamento Confirmado - Pedido #${data.transactionId}`,
      html: emailHtml,
    });

    console.log('✅ Email de confirmação enviado:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ Erro ao enviar email de confirmação:', error);
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
