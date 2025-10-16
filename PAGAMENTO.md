# 💳 Sistema de Pagamento PIX - Umbrela (Liberpay)

## ✅ Integração Implementada

### **Arquivos Criados**

#### **Backend (API Routes)**
- `app/api/payment/create/route.ts` - Criar transação PIX
- `app/api/payment/status/[transactionId]/route.ts` - Verificar status

#### **Frontend (Componentes)**
- `components/PixPayment.tsx` - Modal de pagamento PIX
- `app/checkout/page.tsx` - Atualizado com integração

#### **Configuração**
- `.env.example` - Exemplo de variáveis de ambiente

## 🔧 Instalação

### **1. Instalar Dependências**
```bash
npm install qrcode
npm install --save-dev @types/qrcode
```

### **2. Criar Arquivo .env.local**
Crie um arquivo `.env.local` na raiz do projeto:
```env
UMBRELA_API_KEY=84f2022f-a84b-4d63-a727-1780e6261fe8
UMBRELA_API_URL=https://api-gateway.umbrellapag.com/api
UMBRELA_USER_AGENT=UMBRELLAB2B/1.0
```

### **3. Reiniciar Servidor**
```bash
npm run dev
```

## 🚀 Como Funciona

### **Fluxo de Pagamento**

```
1. Cliente preenche dados no checkout
        ↓
2. Clica em "Finalizar Pedido"
        ↓
3. Sistema cria transação na API Umbrela
        ↓
4. Retorna QR Code PIX
        ↓
5. Modal exibe QR Code + Código copia e cola
        ↓
6. Sistema inicia polling (5 em 5 segundos)
        ↓
7. Verifica status até status = PAID
        ↓
8. Quando PAID: Limpa carrinho e redireciona
```

## 📋 Dados Enviados para API

### **Criar Transação**
```typescript
POST /api/payment/create

Body: {
  amount: 7920, // Valor em centavos (R$ 79,20)
  customer: {
    name: "João Silva",
    email: "joao@email.com",
    document: {
      number: "12345678900" // CPF sem formatação
    },
    phone: "11999999999",
    address: {
      street: "Rua Exemplo",
      streetNumber: "123",
      complement: "Apto 101",
      zipCode: "01000000",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP"
    }
  },
  items: [{
    title: "Árvore de Natal - 1.50m",
    unitPrice: 7920,
    quantity: 1,
    externalRef: "produto-id"
  }],
  metadata: {
    items: [/* dados extras do pedido */]
  }
}
```

### **Resposta**
```typescript
{
  success: true,
  transactionId: "uuid",
  qrCode: "00020126580014br.gov.bcb.pix...",
  status: "WAITING_PAYMENT",
  amount: 7920,
  expirationDate: "2025-04-23T00:00:00.000Z"
}
```

## 🎨 Componente PixPayment

### **Features**
- ✅ QR Code gerado automaticamente
- ✅ Código PIX copia e cola
- ✅ Botão "Copiar" com feedback visual
- ✅ Timer de expiração (15 minutos)
- ✅ Polling automático (verifica a cada 5s)
- ✅ Animações de loading
- ✅ Mensagem de sucesso ao pagar
- ✅ Modal responsivo
- ✅ Botão fechar (X)
- ✅ Instruções de pagamento

### **Estados**
- `waiting` - Aguardando pagamento
- `paid` - Pagamento confirmado ✅
- `error` - Erro no processamento

## 🔄 Polling de Status

O sistema verifica o status do pagamento automaticamente:

```typescript
// A cada 5 segundos
setInterval(async () => {
  const status = await fetch(`/api/payment/status/${transactionId}`);
  
  if (status.isPaid) {
    // Pagamento confirmado!
    clearInterval();
    onSuccess();
  }
}, 5000);

// Para após 15 minutos
setTimeout(() => clearInterval(), 15 * 60 * 1000);
```

## 📊 Status Possíveis

| Status | Descrição | Ação |
|--------|-----------|------|
| `PROCESSING` | Processando | Continuar polling |
| `AUTHORIZED` | Autorizado | Continuar polling |
| **`PAID`** | **✅ Pago** | **Confirmar pedido** |
| `WAITING_PAYMENT` | Aguardando | Continuar polling |
| `REFUSED` | Recusado | Mostrar erro |
| `CANCELED` | Cancelado | Mostrar erro |

**IMPORTANTE:** Apenas `PAID` confirma pagamento!

## 🔐 Segurança

✅ **API Key no backend** - Nunca exposta no frontend
✅ **Validação de dados** - Antes de enviar para API
✅ **CPF sem formatação** - Remove caracteres especiais
✅ **HTTPS obrigatório** - Todas as requisições
✅ **Variáveis de ambiente** - Credenciais protegidas
✅ **Timeout no polling** - Para após 15 minutos

## 🧪 Como Testar

### **1. Teste Local**
```bash
# Inicie o servidor
npm run dev

# Acesse
http://localhost:3002
```

### **2. Fluxo de Teste**
1. Adicione produtos ao carrinho
2. Vá para checkout
3. Preencha os dados (use CPF de teste: 12345678900)
4. Clique em "Finalizar Pedido"
5. Verá o modal do PIX com QR Code
6. **Atenção:** Pagamento real será cobrado!

### **3. Testar Status (Manual)**
```bash
# Via browser ou Postman
GET http://localhost:3002/api/payment/status/TRANSACTION_ID
```

## 💡 Próximos Passos

### **Recomendações de Implementação:**

1. **✉️ Email de Confirmação**
   - Enviar quando status = PAID
   - Incluir detalhes do pedido
   - QR Code de rastreio

2. **💾 Banco de Dados**
   - Salvar transações
   - Histórico de pedidos
   - Status de entrega

3. **📱 Notificações**
   - Push notification quando pago
   - SMS de confirmação
   - WhatsApp com detalhes

4. **🔔 Webhook**
   - Configurar postbackUrl
   - Receber notificações da Umbrela
   - Atualizar status automaticamente

5. **📈 Dashboard Admin**
   - Listar pedidos
   - Filtrar por status
   - Exportar relatórios

6. **🎫 Boleto (Futuro)**
   - Adicionar opção de boleto
   - API similar à do PIX

## ⚠️ Pontos de Atenção

### **CPF Obrigatório**
```typescript
// Sempre remova formatação
cpf: formData.cpf.replace(/\D/g, '')
```

### **Valor em Centavos**
```typescript
// R$ 79,20 = 7920 centavos
const centavos = Math.round(valor * 100);
```

### **Endereço Completo**
Todos os campos são obrigatórios:
- street, streetNumber, zipCode
- neighborhood, city, state

### **Polling**
- Verificar a cada 5-10 segundos
- Parar após 15 minutos ou PAID
- Não fazer requests demais (rate limit)

## 📞 Suporte

**API Umbrela:**
- Docs: https://docs.umbrellapag.com
- Email: suporte@umbrellapag.com

**Código:**
- Verificar logs no console
- Erros aparecem no alert
- Status code 200 = sucesso

## 🎯 Testes de Integração

### **Teste 1: Criar Transação**
```bash
curl -X POST http://localhost:3002/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "customer": {
      "name": "Teste",
      "email": "teste@email.com",
      "document": { "number": "12345678900" },
      "phone": "11999999999",
      "address": {
        "street": "Rua Teste",
        "streetNumber": "123",
        "zipCode": "01000000",
        "neighborhood": "Centro",
        "city": "São Paulo",
        "state": "SP"
      }
    },
    "items": [{
      "title": "Produto Teste",
      "unitPrice": 1000,
      "quantity": 1
    }]
  }'
```

### **Teste 2: Verificar Status**
```bash
curl http://localhost:3002/api/payment/status/TRANSACTION_ID
```

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] npm install completo
- [ ] Teste de criação de transação
- [ ] Teste de verificação de status
- [ ] QR Code renderizando
- [ ] Polling funcionando
- [ ] Redirecionamento após pagamento
- [ ] Mensagens de erro adequadas
- [ ] Logs para debug
- [ ] HTTPS configurado

## 🎄 Pronto para Produção!

Após completar o checklist, o sistema estará pronto para receber pagamentos reais via PIX!

**IMPORTANTE:** Teste com valores baixos primeiro (R$ 1,00) antes de ir para produção.
