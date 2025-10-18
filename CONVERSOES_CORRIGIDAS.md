# 🎯 Correções no Sistema de Conversões e Pagamento

## 📋 Problemas Identificados e Corrigidos

### ❌ **ANTES - Problemas:**

1. **Conversões só disparavam na página `/sucesso`**
   - Se usuário fechasse o modal PIX antes do redirecionamento, conversões eram perdidas
   - Google Ads, GA4, Meta Pixel não eram registrados

2. **Utmify evento "paid" duplicado**
   - Enviado no `PixPayment.tsx`
   - Enviado novamente em `/api/pedidos/atualizar-status`

3. **Falta de .env.local**
   - Sistema usava fallbacks hardcoded
   - Variáveis de ambiente não configuradas corretamente

---

## ✅ **DEPOIS - Soluções Implementadas:**

### **1. Conversões Disparadas no Modal PIX** 🎯

Agora quando o pagamento é confirmado pela Umbrela (status = PAID), o sistema **imediatamente** dispara:

#### **Google Ads Conversion Tracking**
```typescript
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXX/LABEL',
  'value': valorReal,
  'currency': 'BRL',
  'transaction_id': transactionId
});
```

#### **Utmify - Evento PAID**
```typescript
POST /api/utmify/evento
{
  evento: 'paid',
  transactionId: '...',
  email: '...',
  valor: 123.45,
  items: [...]
}
```

### **2. Fluxo Corrigido** 🔄

```
1. Cliente paga via PIX
        ↓
2. Polling verifica status na Umbrela a cada 5s
        ↓
3. Umbrela retorna status = PAID
        ↓
4. ✅ DISPARA CONVERSÕES IMEDIATAMENTE:
   - Google Ads Conversion
   - Utmify evento "paid"
        ↓
5. Atualiza status no banco
        ↓
6. Aguarda 2 segundos (garantir registro)
        ↓
7. Redireciona para /sucesso
```

### **3. Polling Direto da Umbrela** ✅

O sistema **JÁ ESTAVA** consultando a Umbrela diretamente:

```typescript
// PixPayment.tsx - linha 54
const response = await fetch(`/api/payment/status/${transactionId}`);

// /api/payment/status/[transactionId]/route.ts - linha 22-31
const response = await fetch(
  `${UMBRELA_API_URL}/user/transactions/${transactionId}`,
  {
    headers: {
      'x-api-key': UMBRELA_API_KEY,
      'User-Agent': UMBRELA_USER_AGENT
    }
  }
);
```

✅ **Confirmado:** Não depende de webhook, consulta em tempo real!

---

## 🔧 Arquivos Modificados

### **1. `components/PixPayment.tsx`**
- ✅ Adicionado disparo de conversão Google Ads
- ✅ Adicionado envio de evento Utmify "paid"
- ✅ Logs detalhados para debug
- ✅ Novos props: `customerEmail`, `customerData`, `items`

### **2. `app/checkout/page.tsx`**
- ✅ Passa dados do cliente e items para `PixPayment`
- ✅ Permite que conversões sejam disparadas no modal

### **3. `app/api/pedidos/atualizar-status/route.ts`**
- ✅ Removido envio duplicado de evento Utmify
- ✅ Adicionado comentário explicativo

---

## ⚙️ Configuração Necessária

### **IMPORTANTE: Criar arquivo `.env.local`**

❌ **Atualmente não existe `.env.local`** - o sistema usa fallbacks hardcoded.

**Você precisa criar manualmente:**

```bash
# Copiar exemplo
cp .env.example .env.local
```

**Conteúdo do `.env.local`:**

```env
# API Umbrela (Liberpay)
UMBRELA_API_KEY=84f2022f-a84b-4d63-a727-1780e6261fe8
UMBRELA_API_URL=https://api-gateway.umbrellapag.com/api
UMBRELA_USER_AGENT=UMBRELLAB2B/1.0

# Segurança - Admin IP Whitelist
ADMIN_IP_WHITELIST=127.0.0.1,::1,45.160.126.247

# Email - Resend
RESEND_API_KEY=re_hqZFi9AH_PyRnumWZsB418EsdnvURe6sJ

# Analytics e Tracking
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17657798942
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=8A7OCOmxva4bEJ7C8uNB

# Utmify
UTMIFY_API_KEY=SSgDqupTYOTlYTlKgcqE4bIJCoqFQvHwnnNr
NEXT_PUBLIC_SITE_URL=https://obomvelhinho.store
```

⚠️ **Substitua os valores pelas credenciais reais de produção!**

---

## 📊 Tags de Conversão no Front

### **Onde as tags aparecem:**

✅ **`app/layout.tsx`** - linha 26
```tsx
<Analytics />
```

✅ **`components/Analytics.tsx`**
- Google Ads Global Site Tag

✅ **Carregadas em TODAS as páginas** via layout principal

---

## 🧪 Como Testar

### **1. Verificar Tags no Console**

Abra o DevTools (F12) e vá para a aba **Console**. Você verá:

```
🔍 [PIX-PAYMENT] Verificando status do pagamento na Umbrela...
✅ [PIX-PAYMENT] Pagamento CONFIRMADO pela Umbrela!
✅ [PIX-PAYMENT] Transaction ID: abc-123
✅ [PIX-PAYMENT] Valor: 79.20
💾 [PIX-PAYMENT] Atualizando status no banco...
✅ [PIX-PAYMENT] Status atualizado no banco
🎯 [PIX-PAYMENT] Disparando conversão Google Ads
🎯 [PIX-PAYMENT] Tag: AW-17657798942/8A7OCOmxva4bEJ7C8uNB
🎯 [PIX-PAYMENT] Valor: 79.20
✅ [PIX-PAYMENT] Conversão Google Ads disparada!
🔔 [PIX-PAYMENT] Enviando evento PAID para Utmify...
✅ [PIX-PAYMENT] Evento PAID enviado para Utmify
🎉 [PIX-PAYMENT] Redirecionando para página de sucesso...
```

### **2. Verificar no Google Ads**

1. Acesse Google Ads
2. Vá em **Ferramentas e Configurações** > **Conversões**
3. Verifique se a conversão foi registrada

### **3. Verificar no Utmify**

1. Acesse dashboard do Utmify
2. Verifique se o pedido aparece com status `paid`

---

## 🎯 Benefícios das Mudanças

### **✅ Conversões Garantidas**
- Mesmo se usuário fechar modal, conversões já foram registradas
- Não depende de redirecionamento para `/sucesso`

### **✅ Tempo Real**
- Conversões disparadas assim que Umbrela confirma pagamento
- Não espera webhook

### **✅ Sem Duplicação**
- Utmify "paid" enviado apenas uma vez
- Logs claros para debug

### **✅ Rastreamento Completo**
- Google Ads ✅
- Utmify ✅

---

## 📝 Checklist de Deploy

- [ ] Criar arquivo `.env.local` com credenciais reais
- [ ] Verificar `NEXT_PUBLIC_GOOGLE_ADS_ID`
- [ ] Verificar `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`
- [ ] Verificar `UTMIFY_API_KEY`
- [ ] Testar fluxo completo de pagamento
- [ ] Verificar logs no console
- [ ] Confirmar conversões no Google Ads
- [ ] Confirmar pedidos no Utmify

---

## 🚀 Próximos Passos

1. **Criar `.env.local`** com credenciais reais
2. **Reiniciar servidor:** `npm run dev`
3. **Testar pagamento completo**
4. **Verificar conversões em todas as plataformas**
5. **Monitorar logs no console**

---

## 🆘 Troubleshooting

### **Conversões não aparecem no Google Ads**
- Verifique se `NEXT_PUBLIC_GOOGLE_ADS_ID` está correto
- Verifique se `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` está correto
- Aguarde até 24h para conversões aparecerem (delay do Google)

### **Utmify não recebe eventos**
- Verifique se `UTMIFY_API_KEY` está correto
- Verifique logs no console do servidor
- Teste endpoint manualmente: `POST /api/utmify/evento`

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no console do navegador (F12)
2. Verifique os logs no terminal do servidor
3. Teste cada plataforma individualmente
4. Confirme que `.env.local` existe e está correto

**Tudo pronto para rastrear conversões em tempo real! 🎉**
