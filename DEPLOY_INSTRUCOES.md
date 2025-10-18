# 🚀 Instruções de Deploy - Conversões Google Ads + Utmify

## 📋 Arquivos Modificados

### **Arquivos que precisam ser commitados:**

1. `components/PixPayment.tsx` - ✅ Modificado
2. `app/checkout/page.tsx` - ✅ Modificado
3. `app/sucesso/page.tsx` - ✅ Modificado
4. `components/Analytics.tsx` - ✅ Modificado
5. `app/api/pedidos/atualizar-status/route.ts` - ✅ Modificado
6. `.env.example` - ✅ Modificado
7. `CONVERSOES_CORRIGIDAS.md` - ✅ Novo arquivo
8. `DEPLOY_INSTRUCOES.md` - ✅ Novo arquivo (este)

---

## 🔧 Opção 1: Deploy via Git (Se tiver Git instalado)

### **1. Commit no branch `main`**

```bash
# Verificar status
git status

# Adicionar arquivos modificados
git add components/PixPayment.tsx
git add app/checkout/page.tsx
git add app/sucesso/page.tsx
git add components/Analytics.tsx
git add app/api/pedidos/atualizar-status/route.ts
git add .env.example
git add CONVERSOES_CORRIGIDAS.md
git add DEPLOY_INSTRUCOES.md

# Commit
git commit -m "fix: Disparar conversões Google Ads + Utmify no modal PIX quando pagamento confirmado

- Conversões agora disparam imediatamente quando Umbrela confirma PAID
- Remove GA4 e Meta Pixel (não usados)
- Evita perda de conversões se usuário fechar modal
- Remove duplicação de evento Utmify
- Adiciona logs detalhados para debug
- Polling direto da Umbrela a cada 5s (tempo real)"

# Push para main
git push origin main
```

### **2. Deploy no servidor Linux (branch main)**

```bash
# SSH no servidor
ssh root@SEU_IP

# Ir para o diretório
cd /var/www/obomvelhinho

# Pull das mudanças
git pull origin main

# Criar .env.local (se não existir)
cp .env.example .env.local
nano .env.local  # Editar com credenciais reais

# Rebuild
npm run build

# Restart
pm2 restart obomvelhinho

# Verificar logs
pm2 logs obomvelhinho
```

### **3. Depois fazer o mesmo no branch `domain-com`**

```bash
# Na máquina Windows
git checkout domain-com
git merge main
git push origin domain-com

# No servidor (se tiver deploy separado para domain-com)
cd /var/www/obomvelhinho-domain-com  # ou o path correto
git pull origin domain-com
npm run build
pm2 restart obomvelhinho-domain-com
```

---

## 🔧 Opção 2: Deploy Manual (Sem Git na máquina Windows)

### **1. Copiar arquivos via SCP/SFTP**

Use um cliente FTP como **WinSCP** ou **FileZilla** para copiar os arquivos:

**Arquivos para copiar:**
```
d:\Arvores_\components\PixPayment.tsx
  → /var/www/obomvelhinho/components/PixPayment.tsx

d:\Arvores_\app\checkout\page.tsx
  → /var/www/obomvelhinho/app/checkout/page.tsx

d:\Arvores_\app\sucesso\page.tsx
  → /var/www/obomvelhinho/app/sucesso/page.tsx

d:\Arvores_\components\Analytics.tsx
  → /var/www/obomvelhinho/components/Analytics.tsx

d:\Arvores_\app\api\pedidos\atualizar-status\route.ts
  → /var/www/obomvelhinho/app/api/pedidos/atualizar-status/route.ts

d:\Arvores_\.env.example
  → /var/www/obomvelhinho/.env.example

d:\Arvores_\CONVERSOES_CORRIGIDAS.md
  → /var/www/obomvelhinho/CONVERSOES_CORRIGIDAS.md
```

### **2. No servidor Linux**

```bash
# SSH no servidor
ssh root@SEU_IP

cd /var/www/obomvelhinho

# Criar .env.local (se não existir)
cp .env.example .env.local
nano .env.local  # Editar com credenciais reais

# Rebuild
npm run build

# Restart
pm2 restart obomvelhinho

# Verificar logs
pm2 logs obomvelhinho
```

---

## 🔑 Configurar `.env.local` no Servidor

Edite o arquivo `.env.local` no servidor com as credenciais reais:

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

⚠️ **Substitua pelos valores reais de produção!**

---

## 🧪 Testar Após Deploy

### **1. Verificar se o site está rodando**
```bash
curl https://obomvelhinho.store
```

### **2. Fazer um pedido de teste**
1. Adicionar produto ao carrinho
2. Ir para checkout
3. Preencher dados
4. Gerar QR Code PIX
5. Abrir DevTools (F12) → Console
6. Verificar logs:

```
🔍 [PIX-PAYMENT] Verificando status do pagamento na Umbrela...
✅ [PIX-PAYMENT] Pagamento CONFIRMADO pela Umbrela!
🎯 [PIX-PAYMENT] Disparando conversão Google Ads
✅ [PIX-PAYMENT] Conversão Google Ads disparada!
🔔 [PIX-PAYMENT] Enviando evento PAID para Utmify...
✅ [PIX-PAYMENT] Evento PAID enviado para Utmify
```

### **3. Verificar conversões no Google Ads**
1. Acesse Google Ads
2. Ferramentas e Configurações → Conversões
3. Verifique se a conversão foi registrada

### **4. Verificar no Utmify**
1. Acesse dashboard do Utmify
2. Verifique se o pedido aparece com status `paid`

---

## 📝 Checklist de Deploy

### **Branch `main`:**
- [ ] Fazer commit dos arquivos modificados
- [ ] Push para `origin main`
- [ ] Pull no servidor
- [ ] Criar/verificar `.env.local`
- [ ] `npm run build`
- [ ] `pm2 restart obomvelhinho`
- [ ] Testar pedido completo
- [ ] Verificar logs no console
- [ ] Confirmar conversões no Google Ads
- [ ] Confirmar pedidos no Utmify

### **Branch `domain-com`:**
- [ ] `git checkout domain-com`
- [ ] `git merge main`
- [ ] `git push origin domain-com`
- [ ] Pull no servidor (se tiver deploy separado)
- [ ] Criar/verificar `.env.local`
- [ ] `npm run build`
- [ ] `pm2 restart`
- [ ] Testar pedido completo

---

## 🆘 Troubleshooting

### **Erro: "gtag is not defined"**
- Verifique se `.env.local` existe
- Verifique se `NEXT_PUBLIC_GOOGLE_ADS_ID` está configurado
- Limpe cache do navegador

### **Conversões não aparecem no Google Ads**
- Aguarde até 24h (delay do Google)
- Verifique se a tag está correta
- Use Google Tag Assistant para debug

### **Utmify não recebe eventos**
- Verifique `UTMIFY_API_KEY`
- Verifique logs do servidor: `pm2 logs obomvelhinho`
- Teste endpoint manualmente

### **Site não carrega após deploy**
- Verifique logs: `pm2 logs obomvelhinho`
- Verifique se build foi bem sucedido
- Verifique se `.env.local` está correto

---

## 📞 Comandos Úteis

```bash
# Ver logs em tempo real
pm2 logs obomvelhinho --lines 100

# Restart
pm2 restart obomvelhinho

# Status
pm2 status

# Rebuild
cd /var/www/obomvelhinho
npm run build

# Ver processos Node
ps aux | grep node

# Verificar porta
netstat -tulpn | grep :3000
```

---

## 🎉 Resumo das Mudanças

✅ **Conversões disparam no modal PIX** quando pagamento confirmado  
✅ **Polling direto da Umbrela** a cada 5 segundos  
✅ **Apenas Google Ads + Utmify** (sem GA4 e Meta Pixel)  
✅ **Sem duplicação** de eventos Utmify  
✅ **Logs detalhados** para debug  
✅ **Conversões garantidas** mesmo se usuário fechar modal  

**Tudo pronto para produção! 🚀**
