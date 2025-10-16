# 🎯 Configuração do Google Ads - Rastreamento de Conversão

## ✅ Já Configurado

- ✅ ID do Google Ads: **AW-17657798942**
- ✅ Tag instalada em TODAS as páginas
- ✅ Conversão configurada na página `/sucesso`

## 🔧 O Que Falta Configurar

### **1. Pegar o LABEL de Conversão**

1. Acesse: https://ads.google.com/
2. Vá em: **Metas** → **Conversões**
3. Clique na sua conversão (ex: "Compra")
4. Clique em **"Tag"**
5. Você verá algo assim:

```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-17657798942/AbC-DeF123GhIjKl' // ← COPIE ESSA PARTE
});
```

6. **Copie o código completo**: `AW-17657798942/AbC-DeF123GhIjKl`

### **2. Atualizar no Código**

Edite o arquivo: `app/sucesso/page.tsx`

Linha 32, substitua:
```javascript
'send_to': 'AW-17657798942/SEU_LABEL_AQUI',
```

Por:
```javascript
'send_to': 'AW-17657798942/SEU_LABEL_COPIADO',
```

### **3. Configurar Variável de Ambiente no Servidor**

Adicione no `.env.local` do servidor:

```bash
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17657798942
```

### **4. Rebuild e Deploy**

```bash
cd /var/www/obomvelhinho

# Build
npm run build

# Reiniciar
pm2 restart obomvelhinho
```

## 🧪 Testar Conversão

### **1. Fazer pedido de teste:**
1. Acesse o site
2. Adicione produto ao carrinho
3. Finalize compra
4. Pague via PIX
5. Aguarde confirmação
6. Será redirecionado para `/sucesso`

### **2. Verificar no Console do Navegador (F12):**

Você deve ver:
```
🎯 Disparando conversão Google Ads
🎯 Transaction ID: TXID-123...
🎯 Valor: 199.90
✅ Conversão Google Ads disparada!
```

### **3. Verificar no Google Ads:**

1. Vá em: **Metas** → **Conversões**
2. Aguarde até 24h (conversões não aparecem instantaneamente)
3. Você verá a conversão registrada

## 📊 Como Funciona

### **Fluxo Completo:**

```
1. Usuário acessa o site
   ↓
   Google Ads Tag carrega (em TODAS as páginas)
   
2. Usuário adiciona ao carrinho
   ↓
   Continua navegando
   
3. Usuário faz checkout
   ↓
   Paga via PIX
   
4. Status muda para PAID
   ↓
   Redireciona para /sucesso?transactionId=XXX&valor=YYY
   
5. Página /sucesso carrega
   ↓
   JavaScript dispara conversão:
   gtag('event', 'conversion', {...})
   
6. Google Ads registra conversão
   ✅ Conversão atribuída ao clique do anúncio
```

## 🎯 Tipos de Conversão Recomendados

### **1. Compra (Principal)**
- **Nome:** Compra Concluída
- **Categoria:** Compra
- **Valor:** Dinâmico (valor do pedido)
- **Contagem:** Todas as conversões

### **2. Início de Checkout (Opcional)**
- **Nome:** Iniciou Checkout
- **Categoria:** Adicionar ao carrinho
- **Valor:** Valor do carrinho
- **Contagem:** Única por usuário

## 📈 Otimização de Campanhas

Depois de configurar:

1. **Lance Automático:** Use "Maximizar conversões"
2. **Período de Aprendizado:** Aguarde 30 conversões
3. **ROAS Alvo:** Configure retorno sobre investimento desejado
4. **Exclusões:** Adicione IPs internos

## 🔍 Debug

### **Conversão não aparece:**

1. **Verificar Tag Helper:**
   - Instale: https://tagassistant.google.com/
   - Teste no site
   - Veja se tag está disparando

2. **Verificar Console:**
   - Abra DevTools (F12)
   - Vá em Console
   - Procure por: "Conversão Google Ads disparada"

3. **Verificar Network:**
   - Abra DevTools (F12)
   - Vá em Network
   - Procure por: `google-analytics.com/g/collect`
   - Deve ter parâmetro `en=conversion`

## 📝 Checklist

- [ ] Pegar LABEL de conversão no Google Ads
- [ ] Atualizar linha 32 em `app/sucesso/page.tsx`
- [ ] Configurar `NEXT_PUBLIC_GOOGLE_ADS_ID` no `.env.local`
- [ ] Fazer build e deploy
- [ ] Testar com pedido real
- [ ] Verificar conversão no Google Ads (aguardar 24h)
- [ ] Configurar lance automático na campanha

## 🆘 Problemas Comuns

### **Tag não carrega:**
- Verificar se `.env.local` tem `NEXT_PUBLIC_GOOGLE_ADS_ID`
- Verificar se fez rebuild após adicionar variável

### **Conversão não registra:**
- Verificar se LABEL está correto
- Verificar se usuário tem bloqueador de ads desabilitado
- Aguardar 24-48h para conversão aparecer

### **Múltiplas conversões:**
- Normal se usuário recarregar a página `/sucesso`
- Configurar "Contagem: Uma" no Google Ads

## 📞 Suporte

Google Ads: https://support.google.com/google-ads/
