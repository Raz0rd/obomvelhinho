# 📧 Sistema de Emails - Obom Velhinho

Sistema automatizado de envio de emails transacionais usando **Resend**.

## 🎯 Funcionalidades

### **1. Email de Confirmação de Pagamento**
- ✅ Enviado automaticamente quando o status do pedido muda para **PAID**
- 📋 Contém:
  - Dados do cliente
  - Número do pedido
  - Itens comprados com variantes e quantidades
  - Total do pedido
  - Endereço de entrega
  - Status visual com steps (1. Pagamento Confirmado → 2. Em Processamento → 3. Preparando Envio → 4. A Caminho)

### **2. Email de Pedido Enviado**
- 📦 Enviado quando o admin marca pedidos como enviados no painel
- 🔍 Contém:
  - Código de rastreio destacado
  - Link direto para rastreamento nos Correios
  - Status atualizado do pedido
  - Informações importantes sobre a entrega

## 🔧 Configuração

### **1. Configurar Resend**

No `.env.local`:
```bash
RESEND_API_KEY=re_hqZFi9AH_PyRnumWZsB418EsdnvURe6sJ
```

### **2. Configurar Domínio no Resend**

1. Acesse: https://resend.com/domains
2. Adicione o domínio: `obomvelhinho.store`
3. Configure os registros DNS:

```
Type: TXT
Name: resend._domainkey
Value: [valor fornecido pelo Resend]

Type: TXT  
Name: @
Value: v=spf1 include:resend.com ~all
```

4. Aguarde verificação (pode levar até 72h)

### **3. Verificar Email Remetente**

- Remetente: `sac@obomvelhinho.store`
- Certifique-se de que o domínio está verificado

## 📂 Estrutura de Arquivos

```
emails/
├── PedidoConfirmado.tsx    # Template de confirmação
└── PedidoEnviado.tsx        # Template de rastreio

lib/
└── email.ts                 # Funções de envio

app/api/
├── email/
│   ├── pedido-confirmado/route.ts
│   └── pedido-enviado/route.ts
├── pedidos/
│   ├── atualizar-status/route.ts  # Envia email quando PAID
│   └── marcar-enviado/route.ts    # Envia email com rastreio
```

## 🚀 Fluxo de Envio

### **Pagamento Confirmado:**
```
1. Cliente paga via PIX
2. Status muda para PAID
3. API atualizar-status detecta mudança
4. Busca dados do pedido no banco
5. Envia email de confirmação
6. Cliente recebe email com detalhes
```

### **Pedido Enviado:**
```
1. Admin marca pedidos como enviados
2. Adiciona código de rastreio
3. API marcar-enviado atualiza banco
4. Envia email para cada cliente
5. Cliente recebe código de rastreio
```

## 📧 Templates de Email

### **Design:**
- ✅ Logo da empresa no topo
- ✅ Layout responsivo
- ✅ Cores da marca (vermelho #dc2626, verde #16a34a)
- ✅ Footer com informações da empresa
- ✅ Links para políticas

### **Conteúdo do Footer:**
- Nome da empresa
- CNPJ
- Endereço
- Email de contato
- WhatsApp
- Links: Política de Privacidade | Termos de Uso

## 🧪 Teste Local

```bash
# Instalar dependências
npm install

# Testar envio de email (exemplo)
curl -X POST http://localhost:3000/api/email/pedido-confirmado \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCliente": "João Silva",
    "email": "seu-email@exemplo.com",
    "transactionId": "TEST123",
    "items": [{
      "titulo": "Árvore de Natal 1,80m",
      "quantidade": 1,
      "preco": 199.90
    }],
    "total": 199.90,
    "endereco": {
      "cep": "01234-567",
      "endereco": "Rua Teste",
      "numero": "123",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP"
    }
  }'
```

## 📊 Monitoramento

### **Logs no Servidor:**
```bash
# Ver logs do PM2
pm2 logs obomvelhinho | grep -i email

# Ver apenas emails enviados
pm2 logs obomvelhinho | grep "Email.*enviado"

# Ver erros de email
pm2 logs obomvelhinho | grep "Erro ao enviar email"
```

### **Dashboard do Resend:**
- Acesse: https://resend.com/emails
- Ver emails enviados, abertos, clicados
- Ver taxa de entrega e bounces

## ⚠️ Importante

1. **Domínio Verificado**: Certifique-se de que `obomvelhinho.store` está verificado no Resend
2. **Rate Limits**: Resend tem limites de envio (verifique seu plano)
3. **Email de Teste**: Teste primeiro com seu próprio email
4. **Fallback**: Se o email falhar, o pedido ainda é processado (não bloqueia)
5. **Logs**: Sempre verifique logs para debugar problemas

## 🔐 Segurança

- ✅ API Key armazenada em variável de ambiente
- ✅ Não expõe dados sensíveis nos emails
- ✅ Validação de dados antes do envio
- ✅ Tratamento de erros robusto

## 📝 Checklist de Deploy

- [ ] Configurar `RESEND_API_KEY` no `.env.local` do servidor
- [ ] Adicionar domínio no Resend
- [ ] Configurar DNS (SPF, DKIM)
- [ ] Aguardar verificação do domínio
- [ ] Testar envio de email
- [ ] Verificar recebimento
- [ ] Monitorar logs

## 🆘 Troubleshooting

### **Email não está sendo enviado:**
1. Verificar se `RESEND_API_KEY` está configurada
2. Checar logs: `pm2 logs obomvelhinho`
3. Verificar se domínio está verificado no Resend
4. Testar API manualmente

### **Email vai para spam:**
1. Configurar SPF e DKIM corretamente
2. Evitar palavras de spam no assunto
3. Usar domínio verificado
4. Aquecer IP gradualmente

### **Template não está renderizando:**
1. Verificar se `@react-email/components` está instalado
2. Checar erros de build
3. Testar template localmente

## 📞 Suporte

Email SAC: sac@obomvelhinho.store
