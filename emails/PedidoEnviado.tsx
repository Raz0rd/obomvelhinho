import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface PedidoEnviadoProps {
  nomeCliente: string;
  transactionId: string;
  codigoRastreio: string;
  linkRastreio?: string;
}

export default function PedidoEnviado({
  nomeCliente = 'Cliente',
  transactionId = 'XXXX-XXXX',
  codigoRastreio = 'AA123456789BR',
  linkRastreio,
}: PedidoEnviadoProps) {
  const rastreioUrl = linkRastreio || `https://rastreamento.correios.com.br/app/index.php?codigo=${codigoRastreio}`;

  return (
    <Html>
      <Head />
      <Preview>📦 Seu pedido foi enviado! - #{transactionId}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src="https://obomvelhinho.store/logoOBomvelhinho.webp"
              width="120"
              height="120"
              alt="Obom Velhinho"
              style={logo}
            />
          </Section>

          {/* Título */}
          <Heading style={h1}>📦 Seu Pedido Foi Enviado!</Heading>
          
          <Text style={text}>
            Olá <strong>{nomeCliente}</strong>,
          </Text>

          <Text style={text}>
            Ótimas notícias! Seu pedido foi enviado e está a caminho. 🚚✨
          </Text>

          {/* Box de Código de Rastreio */}
          <Section style={trackingBox}>
            <Text style={trackingTitle}>🔍 Código de Rastreio</Text>
            <Text style={trackingCode}>{codigoRastreio}</Text>
            <Text style={trackingSubtext}>
              Copie o código acima e cole no site dos Correios para acompanhar seu pedido
            </Text>
          </Section>

          {/* CTA Rastreio */}
          <Section style={buttonSection}>
            <Link href={rastreioUrl} style={button}>
              Rastrear Pedido nos Correios
            </Link>
          </Section>

          {/* Status do Pedido */}
          <Section style={statusBox}>
            <Text style={statusTitle}>Status do Pedido #{transactionId}</Text>
            <div style={statusSteps}>
              <div style={stepCompleted}>
                <Text style={stepNumberCompleted}>✓</Text>
                <Text style={stepLabel}>Pagamento Confirmado</Text>
              </div>
              <div style={stepCompleted}>
                <Text style={stepNumberCompleted}>✓</Text>
                <Text style={stepLabel}>Pedido Processado</Text>
              </div>
              <div style={stepActive}>
                <Text style={stepNumberActive}>3</Text>
                <Text style={stepLabelActive}>🚚 Em Transporte</Text>
              </div>
              <div style={stepPending}>
                <Text style={stepNumberPending}>4</Text>
                <Text style={stepLabel}>Entregue</Text>
              </div>
            </div>
          </Section>

          {/* Informações Importantes */}
          <Section style={infoBox}>
            <Text style={infoTitle}>📌 Informações Importantes</Text>
            <Text style={infoText}>
              • O prazo de entrega começa a contar a partir da postagem<br />
              • Você pode rastrear seu pedido a qualquer momento<br />
              • Em caso de dúvidas, entre em contato pelo email sac@obomvelhinho.store<br />
              • Certifique-se de que alguém estará no endereço para receber
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Obom Velhinho - Árvores e Decorações de Natal</strong><br />
              CNPJ: XX.XXX.XXX/0001-XX<br />
              Endereço: Rua Exemplo, 123 - São Paulo, SP<br />
              Email: sac@obomvelhinho.store<br />
              WhatsApp: (11) 9xxxx-xxxx
            </Text>
            
            <Text style={footerLinks}>
              <Link href="https://obomvelhinho.store/politica-de-privacidade" style={footerLink}>
                Política de Privacidade
              </Link>
              {' | '}
              <Link href="https://obomvelhinho.store/termos-de-uso" style={footerLink}>
                Termos de Uso
              </Link>
            </Text>

            <Text style={footerDisclaimer}>
              Este é um email automático, por favor não responda. Para falar conosco, utilize sac@obomvelhinho.store
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Estilos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection = {
  padding: '20px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 40px',
};

const trackingBox = {
  backgroundColor: '#dbeafe',
  border: '3px dashed #3b82f6',
  borderRadius: '12px',
  padding: '30px',
  margin: '30px 40px',
  textAlign: 'center' as const,
};

const trackingTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1e40af',
  marginBottom: '15px',
};

const trackingCode = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1e3a8a',
  fontFamily: 'monospace',
  backgroundColor: '#ffffff',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '10px',
  letterSpacing: '2px',
};

const trackingSubtext = {
  fontSize: '13px',
  color: '#1e40af',
  margin: 0,
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 40px',
};

const statusBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '30px 40px',
};

const statusTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginBottom: '15px',
  textAlign: 'center' as const,
};

const statusSteps = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px',
};

const stepCompleted = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px',
  backgroundColor: '#dcfce7',
  borderRadius: '6px',
};

const stepActive = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px',
  backgroundColor: '#dbeafe',
  borderRadius: '6px',
};

const stepPending = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px',
};

const stepNumberCompleted = {
  backgroundColor: '#16a34a',
  color: '#ffffff',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: 0,
};

const stepNumberActive = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: 0,
};

const stepNumberPending = {
  backgroundColor: '#d1d5db',
  color: '#6b7280',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: 0,
};

const stepLabel = {
  fontSize: '14px',
  color: '#374151',
  margin: 0,
};

const stepLabelActive = {
  fontSize: '14px',
  color: '#1e40af',
  fontWeight: 'bold' as const,
  margin: 0,
};

const infoBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 40px',
};

const infoTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#78350f',
  marginBottom: '10px',
};

const infoText = {
  fontSize: '14px',
  color: '#92400e',
  lineHeight: '22px',
  margin: 0,
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const footer = {
  padding: '20px 40px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
  marginBottom: '10px',
};

const footerLinks = {
  color: '#6b7280',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginBottom: '10px',
};

const footerLink = {
  color: '#dc2626',
  textDecoration: 'underline',
};

const footerDisclaimer = {
  color: '#9ca3af',
  fontSize: '11px',
  textAlign: 'center' as const,
  fontStyle: 'italic',
};
