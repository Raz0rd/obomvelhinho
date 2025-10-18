# 🚀 Deploy - Conversões Google Ads + Utmify

## 📦 Arquivos Criados para Deploy

### **Scripts Windows (.bat):**
1. `COMMIT_COMMANDS.bat` - Commit e push para branch main
2. `BRANCH_DOMAIN_COM.bat` - Merge main → domain-com e push

### **Script Linux (.sh):**
1. `SERVIDOR_DEPLOY.sh` - Deploy automático no servidor

### **Documentação:**
1. `DEPLOY_INSTRUCOES.md` - Instruções detalhadas completas
2. `CONVERSOES_CORRIGIDAS.md` - Documentação técnica das mudanças
3. `README_DEPLOY.md` - Este arquivo (resumo rápido)

---

## ⚡ Deploy Rápido - Passo a Passo

### **PASSO 1: Commit no Branch Main (Windows)**

Execute o script:
```bash
COMMIT_COMMANDS.bat
```

Ou manualmente:
```bash
git add .
git commit -m "fix: Conversões Google Ads + Utmify no modal PIX"
git push origin main
```

---

### **PASSO 2: Deploy no Servidor Linux (Branch Main)**

**Opção A - Script Automático:**
```bash
# Copie o arquivo SERVIDOR_DEPLOY.sh para o servidor
scp SERVIDOR_DEPLOY.sh root@SEU_IP:/root/

# SSH no servidor
ssh root@SEU_IP

# Execute o script
chmod +x /root/SERVIDOR_DEPLOY.sh
/root/SERVIDOR_DEPLOY.sh
```

**Opção B - Manual:**
```bash
ssh root@SEU_IP
cd /var/www/obomvelhinho
git pull origin main
cp .env.example .env.local
nano .env.local  # Editar com credenciais reais
npm run build
pm2 restart obomvelhinho
```

---

### **PASSO 3: Atualizar Branch domain-com (Windows)**

Execute o script:
```bash
BRANCH_DOMAIN_COM.bat
```

Ou manualmente:
```bash
git checkout domain-com
git merge main
git push origin domain-com
git checkout main
```

---

### **PASSO 4: Deploy no Servidor (Branch domain-com)**

Se você tiver um deploy separado para domain-com:
```bash
ssh root@SEU_IP
cd /var/www/obomvelhinho-domain-com  # ou o path correto
git pull origin domain-com
npm run build
pm2 restart obomvelhinho-domain-com
```

---

## 🔑 Configurar .env.local no Servidor

**IMPORTANTE:** Edite o `.env.local` no servidor com as credenciais reais:

```env
# Google Ads
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17657798942
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=8A7OCOmxva4bEJ7C8uNB

# Utmify
UTMIFY_API_KEY=SSgDqupTYOTlYTlKgcqE4bIJCoqFQvHwnnNr
NEXT_PUBLIC_SITE_URL=https://obomvelhinho.store

# Umbrela
UMBRELA_API_KEY=84f2022f-a84b-4d63-a727-1780e6261fe8
UMBRELA_API_URL=https://api-gateway.umbrellapag.com/api
UMBRELA_USER_AGENT=UMBRELLAB2B/1.0

# Email
RESEND_API_KEY=re_hqZFi9AH_PyRnumWZsB418EsdnvURe6sJ

# Admin
ADMIN_IP_WHITELIST=127.0.0.1,::1,45.160.126.247
```

---

## 🧪 Testar Após Deploy

### **1. Verificar se está rodando:**
```bash
pm2 status
pm2 logs obomvelhinho --lines 50
curl https://obomvelhinho.store
```

### **2. Fazer pedido de teste:**
1. Adicionar produto ao carrinho
2. Ir para checkout
3. Gerar QR Code PIX
4. Abrir DevTools (F12) → Console
5. Verificar logs:

```
✅ [PIX-PAYMENT] Pagamento CONFIRMADO pela Umbrela!
🎯 [PIX-PAYMENT] Disparando conversão Google Ads
✅ [PIX-PAYMENT] Conversão Google Ads disparada!
🔔 [PIX-PAYMENT] Enviando evento PAID para Utmify...
✅ [PIX-PAYMENT] Evento PAID enviado para Utmify
```

### **3. Verificar conversões:**
- Google Ads: Ferramentas → Conversões
- Utmify: Dashboard → Pedidos

---

## 📋 Checklist Completo

### **Branch Main:**
- [ ] Executar `COMMIT_COMMANDS.bat` (Windows)
- [ ] Executar `SERVIDOR_DEPLOY.sh` (Linux)
- [ ] Editar `.env.local` no servidor
- [ ] Testar pedido completo
- [ ] Verificar conversões Google Ads
- [ ] Verificar pedidos no Utmify

### **Branch domain-com:**
- [ ] Executar `BRANCH_DOMAIN_COM.bat` (Windows)
- [ ] Deploy no servidor (se tiver separado)
- [ ] Testar pedido completo

---

## 🎯 O Que Foi Corrigido

✅ **Conversões disparam no modal PIX** quando Umbrela confirma PAID  
✅ **Polling direto da Umbrela** a cada 5 segundos (tempo real)  
✅ **Apenas Google Ads + Utmify** (GA4 e Meta Pixel removidos)  
✅ **Sem duplicação** de eventos Utmify  
✅ **Logs detalhados** para debug fácil  
✅ **Conversões garantidas** mesmo se usuário fechar modal  

---

## 🆘 Problemas Comuns

### **Git não instalado no Windows**
- Baixe: https://git-scm.com/download/win
- Ou use GitHub Desktop
- Ou copie arquivos manualmente via FTP

### **Erro ao fazer push**
```bash
# Configure suas credenciais
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### **Site não carrega após deploy**
```bash
# Verificar logs
pm2 logs obomvelhinho --lines 100

# Verificar se build foi bem sucedido
cd /var/www/obomvelhinho
npm run build

# Restart forçado
pm2 delete obomvelhinho
pm2 start npm --name "obomvelhinho" -- start
```

---

## 📞 Comandos Úteis

```bash
# Ver logs em tempo real
pm2 logs obomvelhinho --lines 100

# Status
pm2 status

# Restart
pm2 restart obomvelhinho

# Rebuild
cd /var/www/obomvelhinho
npm run build

# Ver processos
ps aux | grep node

# Verificar porta
netstat -tulpn | grep :3000
```

---

## 🎉 Pronto!

Agora é só seguir os passos acima e fazer o deploy! 🚀

**Repositório:** https://github.com/Raz0rd/obomvelhinho.git

**Branches:**
- `main` - Produção principal
- `domain-com` - Domínio .com

**Qualquer dúvida, consulte `DEPLOY_INSTRUCOES.md` para instruções detalhadas!**
