# 🏷️ Configuração de Tags por Branch

## 📋 Visão Geral

Este projeto utiliza **variáveis de ambiente** para configurar as tags de conversão do Google Ads, permitindo que cada branch (`.store` e `.com`) tenha suas próprias tags independentes.

---

## 🔧 Variáveis de Ambiente

### **Arquivo: `.env.local`**

Cada servidor deve ter seu próprio arquivo `.env.local` com as tags específicas:

```ini
# Analytics e Tracking
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17657798942
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=8A7OCOmxva4bEJ7C8uNB
NEXT_PUBLIC_META_PIXEL_ID=
```

---

## 🌿 Configuração por Branch

### **Branch: `main` (obomvelhinho.store)**

```ini
# Google Ads - Conta obomvelhinho.store
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17657798942
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=8A7OCOmxva4bEJ7C8uNB

# Google Analytics - Propriedade obomvelhinho.store
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Meta Pixel (se houver)
NEXT_PUBLIC_META_PIXEL_ID=
```

### **Branch: `domain-com` (obomvelhinho.com)**

```ini
# Google Ads - Conta obomvelhinho.com
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-YYYYYYYYYYYY
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXXXXX

# Google Analytics - Propriedade obomvelhinho.com
NEXT_PUBLIC_GA_ID=G-YYYYYYYYYY

# Meta Pixel (se houver)
NEXT_PUBLIC_META_PIXEL_ID=
```

---

## 📍 Como Funcionam as Tags

### **1. Google Ads Tag (carregado em todas as páginas)**

Arquivo: `components/Analytics.tsx`

```typescript
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';
```

Carrega o script:
```
https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXXX
```

---

### **2. Google Ads Conversion (disparado na página de sucesso)**

Arquivo: `app/sucesso/page.tsx`

```typescript
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';
const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || '';

// Tag montada dinamicamente
const conversionTag = `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`;
// Exemplo: AW-17657798942/8A7OCOmxva4bEJ7C8uNB

gtag('event', 'conversion', {
  'send_to': conversionTag,
  'value': valor,
  'currency': 'BRL',
  'transaction_id': transactionId
});
```

---

## 🎯 Como Obter as Tags do Google Ads

### **Passo 1: Acessar Google Ads**
1. Acesse: https://ads.google.com
2. Selecione sua conta

### **Passo 2: Obter o ID da Conta (AW-XXXXXXXXXX)**
1. Clique em **Ferramentas e Configurações** (ícone de chave inglesa)
2. Vá em **Configuração** → **Configurações da conta**
3. Copie o **ID do cliente** (formato: AW-XXXXXXXXXX)

### **Passo 3: Obter o Label de Conversão**
1. Clique em **Ferramentas e Configurações**
2. Vá em **Medição** → **Conversões**
3. Clique na conversão que deseja rastrear (ex: "Compra")
4. Clique em **Tag**
5. Procure por: `send_to: 'AW-XXXXXXXXXX/YYYYYYYYYYY'`
6. Copie apenas o **LABEL** (parte após a barra): `YYYYYYYYYYY`

---

## 🔄 Workflow de Atualização

### **Atualizar Tag no Servidor `.store`:**

```bash
# Conectar ao servidor
ssh root@SEU_SERVIDOR_STORE

# Editar .env.local
cd /var/www/obomvelhinho
nano .env.local

# Modificar as variáveis:
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-NOVO_ID
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=NOVO_LABEL

# Rebuild e reiniciar
npm run build
pm2 restart obomvelhinho
```

### **Atualizar Tag no Servidor `.com`:**

```bash
# Conectar ao servidor
ssh root@SEU_SERVIDOR_COM

# Editar .env.local
cd /var/www/obomvelhinho
nano .env.local

# Modificar as variáveis:
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-OUTRO_ID
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=OUTRO_LABEL

# Rebuild e reiniciar
npm run build
pm2 restart obomvelhinho
```

---

## ✅ Verificar se Está Funcionando

### **1. Verificar no Console do Navegador**

Ao fazer uma compra, abra o console (`F12`) e procure por:

```
🎯 Disparando conversão Google Ads
🎯 Conversion Tag: AW-17657798942/8A7OCOmxva4bEJ7C8uNB
🎯 Transaction ID: XXXX-XXXX
🎯 Valor: 99.90
✅ Conversão Google Ads disparada!
```

### **2. Verificar no Google Ads**

1. Acesse: https://ads.google.com
2. Vá em **Ferramentas** → **Conversões**
3. Clique na conversão configurada
4. Verifique se as conversões estão sendo registradas

### **3. Usar Google Tag Assistant**

1. Instale a extensão: https://tagassistant.google.com
2. Abra seu site
3. Faça uma compra de teste
4. Verifique se o evento de conversão foi disparado

---

## 🚨 Problemas Comuns

### **Conversão não está sendo registrada:**

1. **Verificar se as variáveis de ambiente estão corretas:**
   ```bash
   cat /var/www/obomvelhinho/.env.local | grep GOOGLE_ADS
   ```

2. **Verificar logs do Next.js:**
   ```bash
   pm2 logs obomvelhinho | grep "🎯"
   ```

3. **Fazer rebuild após alterar `.env.local`:**
   ```bash
   npm run build
   pm2 restart obomvelhinho
   ```

### **Tag antiga ainda aparecendo:**

- Limpe o cache do navegador
- Faça um hard refresh (`Ctrl + Shift + R`)
- Verifique o código fonte da página (`Ctrl + U`) e procure por `gtag`

---

## 📚 Referências

- **Google Ads Help:** https://support.google.com/google-ads/answer/6331304
- **Next.js Environment Variables:** https://nextjs.org/docs/basic-features/environment-variables
- **Google Tag Manager:** https://tagmanager.google.com

---

## 💡 Dicas Importantes

1. ✅ **Nunca commite o arquivo `.env.local`** no Git
2. ✅ **Use `.env.example`** como template
3. ✅ **Cada servidor precisa ter seu próprio `.env.local`**
4. ✅ **Rebuild necessário após alterar `.env.local`**
5. ✅ **Teste sempre após atualizar tags**

🎄 **Obom Velhinho - Rastreamento Configurável**
