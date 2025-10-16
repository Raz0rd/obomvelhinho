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

interface PedidoConfirmadoProps {
  nomeCliente: string;
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

export default function PedidoConfirmado({
  nomeCliente = 'Cliente',
  transactionId = 'XXXX-XXXX',
  items = [],
  total = 0,
  endereco = {
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
  },
}: PedidoConfirmadoProps) {
  return (
    <Html>
      <Head />
      <Preview>🎉 Pagamento Confirmado - Pedido #{transactionId}</Preview>
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
          <Heading style={h1}>✅ Pagamento Confirmado!</Heading>
          
          <Text style={text}>
            Olá <strong>{nomeCliente}</strong>,
          </Text>

          <Text style={text}>
            Ótimas notícias! Seu pagamento foi confirmado com sucesso! 🎉
          </Text>

          <Text style={text}>
            Seu pedido já está <strong>em processamento</strong> e será preparado para envio em breve.
          </Text>

          {/* Box de Destaque */}
          <Section style={statusBox}>
            <Text style={statusTitle}>✅ Pedido em Processamento</Text>
            <Text style={statusText}>
              Aguarde! Em breve você receberá mais informações no email, incluindo o código de rastreio para acompanhar seu pedido. 📦
            </Text>
          </Section>

          {/* Detalhes do Pedido */}
          <Section style={orderSection}>
            <Text style={orderTitle}>📋 Detalhes do Pedido</Text>
            <Text style={orderNumber}>Número: <strong>#{transactionId}</strong></Text>
            
            <Hr style={hr} />

            {/* Itens */}
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <div>
                  <Text style={itemTitle}>{item.titulo}</Text>
                  {item.variante && <Text style={itemVariant}>{item.variante}</Text>}
                  <Text style={itemQty}>Quantidade: {item.quantidade}</Text>
                </div>
                <Text style={itemPrice}>R$ {item.preco.toFixed(2).replace('.', ',')}</Text>
              </div>
            ))}

            <Hr style={hr} />

            <div style={totalRow}>
              <Text style={totalLabel}>Total:</Text>
              <Text style={totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
            </div>
          </Section>

          {/* Endereço de Entrega */}
          <Section style={addressSection}>
            <Text style={addressTitle}>📍 Endereço de Entrega</Text>
            <Text style={addressText}>
              {endereco.endereco}, {endereco.numero}
              {endereco.complemento && ` - ${endereco.complemento}`}
              <br />
              {endereco.bairro} - {endereco.cidade}/{endereco.estado}
              <br />
              CEP: {endereco.cep}
            </Text>
          </Section>

          {/* Prazo de Entrega */}
          <Section style={deliveryBox}>
            <Text style={deliveryTitle}>🚚 Prazo de Entrega</Text>
            <Text style={deliveryText}>
              Seu pedido será entregue em <strong>7 a 15 dias úteis</strong> após a confirmação do pagamento.
            </Text>
          </Section>

          {/* Próximos Passos */}
          <Section style={infoBox}>
            <Text style={infoTitle}>📦 Próximos Passos</Text>
            <Text style={infoText}>
              1. Estamos separando e embalando seus produtos com todo cuidado<br />
              2. Em breve você receberá o código de rastreio por email<br />
              3. Fique de olho na sua caixa de entrada! 📧
            </Text>
          </Section>

          {/* CTA */}
          <Section style={buttonSection}>
            <Link href="https://obomvelhinho.store" style={button}>
              Continuar Comprando
            </Link>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Obom Velhinho - Árvores e Decorações de Natal</strong><br />
              CNPJ: 57.161.373/0001-61<br />
              AV CORBELIA, 470 - SALA 01<br />
              MORUMBI - CASCAVEL/PR<br />
              CEP: 85.817-775<br />
              Telefone: (45) 9111-9366<br />
              Site: obomvelhinho.store<br />
              Email: sac@obomvelhinho.store
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

const statusBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #86efac',
  borderRadius: '8px',
  padding: '20px',
  margin: '30px 40px',
  textAlign: 'center' as const,
};

const statusTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#166534',
  marginBottom: '10px',
};

const statusText = {
  fontSize: '14px',
  color: '#15803d',
  margin: 0,
};

const statusSteps = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px',
};

const stepActive = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px',
  backgroundColor: '#dcfce7',
  borderRadius: '6px',
};

const stepPending = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px',
};

const stepNumber = {
  backgroundColor: '#16a34a',
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

const stepLabel = {
  fontSize: '14px',
  color: '#374151',
  margin: 0,
};

const orderSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 40px',
};

const orderTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginBottom: '10px',
};

const orderNumber = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '15px',
};

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '12px 0',
};

const itemTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 4px 0',
};

const itemVariant = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '0 0 4px 0',
};

const itemQty = {
  fontSize: '13px',
  color: '#9ca3af',
  margin: 0,
};

const itemPrice = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#dc2626',
  margin: 0,
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '15px 0',
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '10px',
};

const totalLabel = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: 0,
};

const totalValue = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#dc2626',
  margin: 0,
};

const addressSection = {
  backgroundColor: '#fef3c7',
  border: '2px solid #fbbf24',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 40px',
};

const addressTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#78350f',
  marginBottom: '10px',
};

const addressText = {
  fontSize: '14px',
  color: '#92400e',
  lineHeight: '20px',
  margin: 0,
};

const deliveryBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #86efac',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 40px',
  textAlign: 'center' as const,
};

const deliveryTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#166534',
  marginBottom: '10px',
};

const deliveryText = {
  fontSize: '14px',
  color: '#15803d',
  lineHeight: '20px',
  margin: 0,
};

const infoBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 40px',
};

const infoTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1e40af',
  marginBottom: '10px',
};

const infoText = {
  fontSize: '14px',
  color: '#1e3a8a',
  lineHeight: '22px',
  margin: 0,
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 40px',
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
