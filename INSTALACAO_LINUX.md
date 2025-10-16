# 🚀 Guia de Instalação - Obom Velhinho (Linux Ubuntu/Debian)

## 📋 Pré-requisitos
- Servidor Linux (Ubuntu 20.04+ ou Debian 11+)
- Acesso SSH root ou sudo
- Domínio configurado (obomvelhinho.com)

---

## 1️⃣ Atualizar Sistema e Instalar Dependências Básicas

```bash
# Atualizar lista de pacotes
sudo apt update && sudo apt upgrade -y

# Instalar dependências essenciais
sudo apt install -y curl git build-essential wget
```

---

## 2️⃣ Instalar Node.js (versão 18.x ou 20.x)

```bash
# Instalar Node.js 20.x (LTS recomendado)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version  # Deve mostrar v20.x.x
npm --version   # Deve mostrar 10.x.x
```

---

## 3️⃣ Instalar PM2 (Gerenciador de Processos)

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Configurar PM2 para iniciar com o sistema
pm2 startup
# IMPORTANTE: Execute o comando que o PM2 mostrar (algo como: sudo env PATH=...)

# Verificar instalação
pm2 --version
```

---

## 4️⃣ Instalar Nginx (Servidor Web)

```bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar e habilitar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar status
sudo systemctl status nginx
```

---

## 5️⃣ Clonar o Repositório do Projeto

```bash
# Criar diretório para aplicações web
sudo mkdir -p /var/www
cd /var/www

# Clonar repositório (substitua pela URL do seu repo)
sudo git clone https://github.com/Raz0rd/obomvelhinho.git

# Ajustar permissões
sudo chown -R $USER:$USER /var/www/obomvelhinho
cd /var/www/obomvelhinho
```

---

## 6️⃣ Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env.local
nano .env.local
```

### Conteúdo do `.env.local`:

```ini
# Database
DATABASE_PATH=/var/www/obomvelhinho/pedidos.db

# Email - Resend
RESEND_API_KEY=re_hqZFi9AH_PyRnumWZsB418EsdnvURe6sJ

# Analytics e Tracking
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17657798942
NEXT_PUBLIC_META_PIXEL_ID=

# Utmify
UTMIFY_API_KEY=SSgDqupTYOTlYTlKgcqE4bIJCoqFQvHwnnNr
NEXT_PUBLIC_SITE_URL=https://obomvelhinho.com

# Admin Access Control
ALLOWED_IPS=SEU_IP_AQUI,OUTRO_IP_SE_NECESSARIO
```

**Salvar:** `Ctrl + O`, Enter, `Ctrl + X`

---

## 7️⃣ Instalar Dependências do Projeto

```bash
# Instalar dependências NPM
npm install

# Aguardar conclusão (pode levar alguns minutos)
```

---

## 8️⃣ Build da Aplicação Next.js

```bash
# Fazer build de produção
npm run build

# Verificar se build foi bem-sucedido
# Deve criar a pasta .next/
```

---

## 9️⃣ Iniciar Aplicação com PM2

```bash
# Iniciar aplicação
pm2 start npm --name "obomvelhinho" -- start

# Verificar status
pm2 status

# Ver logs (opcional)
pm2 logs obomvelhinho --lines 50

# Salvar configuração do PM2
pm2 save
```

---

## 🔟 Configurar Nginx como Proxy Reverso

```bash
# Criar configuração do site
sudo nano /etc/nginx/sites-available/obomvelhinho
```

### Conteúdo da configuração:

```nginx
server {
    listen 80;
    server_name obomvelhinho.com www.obomvelhinho.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Salvar:** `Ctrl + O`, Enter, `Ctrl + X`

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/obomvelhinho /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

---

## 1️⃣1️⃣ Instalar Certbot para SSL (HTTPS)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d obomvelhinho.com -d www.obomvelhinho.com

# Seguir instruções interativas:
# - Digite seu email
# - Aceite termos
# - Escolha redirecionar HTTP para HTTPS (opção 2)

# Testar renovação automática
sudo certbot renew --dry-run
```

---

## 1️⃣2️⃣ Configurar Firewall (UFW)

```bash
# Permitir SSH
sudo ufw allow OpenSSH

# Permitir HTTP e HTTPS
sudo ufw allow 'Nginx Full'

# Habilitar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

---

## ✅ Verificar Instalação

```bash
# Verificar se aplicação está rodando
pm2 status

# Ver logs em tempo real
pm2 logs obomvelhinho

# Testar no navegador
# http://obomvelhinho.com (deve redirecionar para HTTPS)
# https://obomvelhinho.com (deve carregar o site)
```

---

## 🔄 Comandos de Manutenção

### Atualizar o Site (Deploy)

```bash
cd /var/www/obomvelhinho

# Fazer backup do banco de dados
cp pedidos.db pedidos.db.backup

# Pull das atualizações
git pull origin main

# Instalar novas dependências (se houver)
npm install

# Rebuild
npm run build

# Reiniciar aplicação
pm2 restart obomvelhinho

# Ver logs
pm2 logs obomvelhinho --lines 50
```

### Ver Logs

```bash
# Logs do PM2
pm2 logs obomvelhinho

# Logs do Nginx (acesso)
sudo tail -f /var/log/nginx/access.log

# Logs do Nginx (erro)
sudo tail -f /var/log/nginx/error.log
```

### Reiniciar Serviços

```bash
# Reiniciar aplicação
pm2 restart obomvelhinho

# Reiniciar Nginx
sudo systemctl restart nginx

# Reiniciar tudo
pm2 restart all
sudo systemctl restart nginx
```

### Monitoramento

```bash
# Dashboard do PM2
pm2 monit

# Status dos serviços
pm2 status
sudo systemctl status nginx

# Uso de recursos
htop  # (instalar com: sudo apt install htop)
```

---

## 🛠️ Troubleshooting

### Erro de Build

```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Aplicação não inicia

```bash
# Ver logs detalhados
pm2 logs obomvelhinho --lines 100

# Deletar e recriar processo PM2
pm2 delete obomvelhinho
pm2 start npm --name "obomvelhinho" -- start
pm2 save
```

### Erro 502 Bad Gateway (Nginx)

```bash
# Verificar se aplicação está rodando
pm2 status

# Verificar porta 3000
netstat -tulpn | grep 3000

# Reiniciar aplicação
pm2 restart obomvelhinho
```

### Certificado SSL expirado

```bash
# Forçar renovação
sudo certbot renew --force-renewal

# Recarregar Nginx
sudo systemctl reload nginx
```

---

## 📊 Estrutura de Diretórios

```
/var/www/obomvelhinho/
├── app/                    # Código da aplicação
├── components/             # Componentes React
├── contexts/               # Contextos React
├── emails/                 # Templates de email
├── lib/                    # Bibliotecas e utilitários
├── public/                 # Arquivos estáticos
├── .next/                  # Build do Next.js
├── node_modules/           # Dependências
├── pedidos.db              # Banco de dados SQLite
├── .env.local              # Variáveis de ambiente
├── package.json            # Configuração do projeto
└── next.config.mjs         # Configuração do Next.js
```

---

## 🔐 Segurança Adicional

### Alterar Porta SSH (opcional)

```bash
sudo nano /etc/ssh/sshd_config
# Alterar: Port 22 para Port 2222 (ou outra porta)
sudo systemctl restart sshd
sudo ufw allow 2222/tcp
```

### Configurar Fail2Ban

```bash
# Instalar Fail2Ban
sudo apt install -y fail2ban

# Iniciar e habilitar
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

---

## 📞 Suporte

- **Logs da aplicação:** `pm2 logs obomvelhinho`
- **Status dos serviços:** `pm2 status && sudo systemctl status nginx`
- **Teste de conectividade:** `curl http://localhost:3000`

---

## ✅ Checklist Final

- [ ] Node.js instalado (v20.x)
- [ ] PM2 instalado e configurado
- [ ] Nginx instalado e rodando
- [ ] Repositório clonado em `/var/www/obomvelhinho`
- [ ] Arquivo `.env.local` criado com todas as variáveis
- [ ] Dependências instaladas (`npm install`)
- [ ] Build realizado com sucesso (`npm run build`)
- [ ] Aplicação rodando no PM2
- [ ] Nginx configurado como proxy reverso
- [ ] SSL/HTTPS configurado (Certbot)
- [ ] Firewall configurado (UFW)
- [ ] Site acessível via HTTPS
- [ ] Emails funcionando (testar com `/api/test-email`)
- [ ] Painel admin acessível (com IP permitido)

🎉 **Instalação Concluída!**
