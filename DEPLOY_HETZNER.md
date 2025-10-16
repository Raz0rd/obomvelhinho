# 🚀 Deploy no Hetzner Cloud

## 📋 Passo a Passo Completo

### **1. Criar Servidor no Hetzner**

1. Acesse: https://console.hetzner.cloud/
2. Clique em **"New Project"** ou selecione projeto existente
3. Clique em **"Add Server"**

**Configurações Recomendadas:**

**Location:** 
- Falkenstein (Alemanha) - Mais barato
- OU Ashburn (EUA) - Mais próximo do Brasil

**Image:**
- Ubuntu 22.04 LTS

**Type:**
- **CPX11** (2 vCPU, 2GB RAM) - €4.51/mês - Recomendado para início
- **CPX21** (3 vCPU, 4GB RAM) - €8.93/mês - Para maior tráfego

**Networking:**
- IPv4: ✅ Habilitado
- IPv6: ✅ Habilitado (opcional)

**SSH Keys:**
- ✅ Sua chave já está configurada no cloud-init

**Cloud Config:**
- Cole TODO o conteúdo do arquivo `hetzner-cloud-init.yaml`

**Volume:**
- Não necessário (por enquanto)

**Firewall:**
- Será configurado automaticamente pelo script

4. Clique em **"Create & Buy Now"**

---

### **2. Aguardar Provisionamento**

⏱️ O servidor leva **~3-5 minutos** para estar pronto.

Durante este tempo, o cloud-init vai:
- ✅ Instalar Node.js 20.x
- ✅ Instalar PM2, Nginx, Certbot
- ✅ Configurar Firewall (UFW)
- ✅ Configurar Fail2Ban
- ✅ Criar usuário `deploy`
- ✅ Configurar SSH com sua chave
- ✅ Criar scripts de deploy e backup

**Ver progresso:**
```bash
# Conectar como root primeiro
ssh root@SEU_IP

# Ver logs do cloud-init
tail -f /var/log/cloud-init-output.log
```

---

### **3. Conectar via SSH**

Após provisionamento completo:

```bash
ssh deploy@SEU_IP
```

**Ler instruções:**
```bash
cat /home/deploy/README.txt
```

---

### **4. Configurar DNS no Cloudflare**

1. Acesse Cloudflare
2. Selecione domínio: `arvoresdenatal2025.shop`
3. Vá em **DNS** → **Records**

**Adicionar/Editar:**

```
Type: A
Name: @
Content: SEU_IP_HETZNER
Proxy status: Proxied (orange cloud ON)
TTL: Auto
```

```
Type: A
Name: www
Content: SEU_IP_HETZNER
Proxy status: Proxied (orange cloud ON)
TTL: Auto
```

**Importante:** Ambos `obomvelhinho.store` e `www.obomvelhinho.store` retornarão **200 OK**

**Aguardar propagação:** ~5 minutos

---

### **5. Clonar Repositório**

```bash
# SSH no servidor
ssh deploy@SEU_IP

# Ir para diretório da aplicação
cd /var/www/obomvelhinho

# Clonar repositório
git clone https://github.com/Raz0rd/obomvelhinho.git .

# Verificar branch
git branch
```

---

### **6. Configurar Variáveis de Ambiente**

```bash
# Criar .env.local
nano /var/www/obomvelhinho/.env.local
```

**Cole:**
```env
# API Umbrela
UMBRELA_API_KEY=84f2022f-a84b-4d63-a727-1780e6261fe8
UMBRELA_API_URL=https://api-gateway.umbrellapag.com/api
UMBRELA_USER_AGENT=UMBRELLAB2B/1.0

# IP Whitelist (IP do seu computador + servidor)
ADMIN_IP_WHITELIST=127.0.0.1,::1,45.160.126.247,SEU_IP_CASA

# Node Environment
NODE_ENV=production
PORT=3000
```

**Salvar:** Ctrl + X, Y, Enter

---

### **7. Fazer Deploy**

```bash
# Executar script de deploy
/home/deploy/deploy.sh
```

**O script vai:**
1. ✅ Instalar dependências (`npm install`)
2. ✅ Fazer build (`npm run build`)
3. ✅ Iniciar com PM2 (`pm2 start`)

**Verificar:**
```bash
# Status da aplicação
pm2 status

# Ver logs
pm2 logs obomvelhinho

# Acessar aplicação
curl http://localhost:3000
```

---

### **8. Configurar SSL (HTTPS)**

```bash
# Certbot para Let's Encrypt
sudo certbot --nginx -d obomvelhinho.store -d www.obomvelhinho.store
```

**Responda:**
- Email: `sac@obomvelhinho.store`
- Termos: `Y` (Yes)
- Compartilhar email: `N` (No)
- Redirect HTTP → HTTPS: `2` (Redirect)

**Pronto!** SSL configurado automaticamente.

**Testar:**
```
https://obomvelhinho.store
https://www.obomvelhinho.store
```

**Ambos devem retornar 200 OK!**

---

### **9. Testar Aplicação**

**Verificar site:**
1. Abra: `https://obomvelhinho.store` ou `https://www.obomvelhinho.store`
2. Navegue pelos produtos
3. Adicione ao carrinho
4. Faça checkout teste

**Verificar admin:**
1. Acesse: `https://obomvelhinho.store/admin/pedidos`
2. Deve funcionar apenas do seu IP

---

## 📊 Monitoramento

### **Ver logs em tempo real:**
```bash
# Logs da aplicação
pm2 logs obomvelhinho --lines 100

# Logs do Nginx (acesso)
sudo tail -f /var/log/nginx/access.log

# Logs do Nginx (erro)
sudo tail -f /var/log/nginx/error.log
```

### **Status do servidor:**
```bash
# CPU, RAM, processos
htop

# Espaço em disco
df -h

# Status dos serviços
systemctl status nginx
systemctl status fail2ban
pm2 status
```

### **Monitoramento PM2:**
```bash
# Dashboard interativo
pm2 monit

# Informações detalhadas
pm2 info obomvelhinho
```

---

## 🔄 Atualizar Aplicação

**Quando fizer mudanças no código:**

```bash
# SSH no servidor
ssh deploy@SEU_IP

# Executar deploy
/home/deploy/deploy.sh
```

**O script vai:**
1. Pull do Git
2. Instalar novas dependências
3. Rebuild
4. Restart PM2

**Zero downtime!**

---

## 💾 Backups

### **Backup Automático:**
- ✅ Todo dia às **3h da manhã**
- ✅ Arquivo: `/home/deploy/backups/pedidos_YYYYMMDD_HHMMSS.db`
- ✅ Mantém últimos 7 dias

### **Backup Manual:**
```bash
/home/deploy/backup-db.sh
```

### **Ver backups:**
```bash
ls -lh /home/deploy/backups/
```

### **Restaurar backup:**
```bash
# Parar aplicação
pm2 stop obomvelhinho

# Restaurar (substitua data)
cp /home/deploy/backups/pedidos_20250116_030000.db /var/www/obomvelhinho/pedidos.db

# Reiniciar
pm2 restart obomvelhinho
```

---

## 🔒 Segurança

### **Firewall (UFW):**
```bash
# Ver status
sudo ufw status

# Permitidas:
# - 22/tcp (SSH)
# - 80/tcp (HTTP)
# - 443/tcp (HTTPS)
```

### **Fail2Ban:**
```bash
# Ver status
sudo fail2ban-client status

# Banir IP manualmente
sudo fail2ban-client set sshd banip 123.123.123.123

# Desbanir IP
sudo fail2ban-client set sshd unbanip 123.123.123.123
```

### **IPs Bloqueados:**
```bash
# Ver logs
sudo tail -f /var/log/fail2ban.log
```

---

## 🛠️ Comandos Úteis

### **PM2:**
```bash
pm2 status              # Ver status
pm2 logs                # Ver logs
pm2 restart obomvelhinho # Reiniciar
pm2 stop obomvelhinho   # Parar
pm2 delete obomvelhinho # Remover
pm2 monit               # Dashboard
```

### **Nginx:**
```bash
sudo nginx -t                    # Testar config
sudo systemctl restart nginx     # Reiniciar
sudo systemctl status nginx      # Status
sudo systemctl reload nginx      # Reload config
```

### **Banco de Dados:**
```bash
# Abrir SQLite
sqlite3 /var/www/obomvelhinho/pedidos.db

# Ver tabelas
.tables

# Ver pedidos
SELECT * FROM pedidos;

# Sair
.quit
```

### **Sistema:**
```bash
# Uso de RAM
free -h

# Uso de disco
df -h

# Processos
ps aux | grep node

# Reiniciar servidor
sudo reboot
```

---

## 🚨 Troubleshooting

### **Problema: Site não carrega**

**1. Verificar PM2:**
```bash
pm2 status
pm2 logs obomvelhinho --lines 50
```

**2. Verificar Nginx:**
```bash
sudo nginx -t
sudo systemctl status nginx
```

**3. Verificar porta:**
```bash
sudo netstat -tulpn | grep 3002
```

**4. Reiniciar tudo:**
```bash
pm2 restart obomvelhinho
sudo systemctl restart nginx
```

---

### **Problema: SSL não funciona**

**Reconfigurar Certbot:**
```bash
sudo certbot --nginx -d arvoresdenatal2025.shop -d www.arvoresdenatal2025.shop --force-renewal
```

---

### **Problema: Sem espaço em disco**

**Ver uso:**
```bash
df -h
du -sh /var/www/obomvelhinho/*
```

**Limpar logs antigos:**
```bash
pm2 flush
sudo rm /var/log/nginx/*.log.*.gz
```

**Limpar backups antigos:**
```bash
find /home/deploy/backups/ -name "*.db" -mtime +7 -delete
```

---

## 📈 Otimizações

### **Habilitar compressão Gzip no Nginx:**
```bash
sudo nano /etc/nginx/nginx.conf
```

**Adicionar dentro de `http {}`:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

**Reiniciar:**
```bash
sudo systemctl restart nginx
```

---

### **Cache de Assets:**

Nginx já está configurado para cachear assets estáticos.

---

## 💰 Custos

**Servidor CPX11:**
- €4.51/mês (~R$ 27/mês)
- 2 vCPU, 2GB RAM
- 40GB SSD
- 20TB tráfego

**Tráfego extra:** €1.19/TB

**Domínio:** Já tem (Cloudflare)

**Total estimado:** R$ 27/mês

---

## ✅ Checklist Final

- [ ] Servidor criado no Hetzner
- [ ] Cloud-init executado com sucesso
- [ ] SSH funcionando
- [ ] DNS configurado no Cloudflare
- [ ] Repositório clonado
- [ ] .env.local configurado
- [ ] Deploy executado
- [ ] SSL configurado (HTTPS)
- [ ] Site acessível
- [ ] Admin protegido por IP
- [ ] Backup automático configurado
- [ ] Firewall ativo
- [ ] Fail2Ban ativo

---

## 🎯 Resultado Final

✅ **Site:** https://obomvelhinho.store
✅ **Site com WWW:** https://www.obomvelhinho.store (200 OK)
✅ **Admin:** https://obomvelhinho.store/admin/pedidos
✅ **Porta:** 3000
✅ **HTTPS:** Certificado válido
✅ **Backups:** Diários automáticos
✅ **Segurança:** Firewall + Fail2Ban
✅ **Performance:** Nginx + PM2
✅ **Monitoramento:** Logs em tempo real

**Deploy completo e produção pronta!** 🚀🎄✨
