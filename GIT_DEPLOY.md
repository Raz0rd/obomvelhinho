# 🔄 Deploy para GitHub

## 📦 Repositório: https://github.com/Raz0rd/obomvelhinho.git

---

## 🚀 Fazer Push Inicial

### **1. Verificar .gitignore**

Certifique-se que o `.gitignore` está correto:

```bash
# Ver conteúdo
cat .gitignore
```

**Deve conter:**
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# Typescript
*.tsbuildinfo
next-env.d.ts

# Database
*.db
*.db-journal
pedidos.db

# Backups
/backups/

# IDE
.vscode/
.idea/
```

---

### **2. Inicializar Git (se necessário)**

```bash
# Ver status
git status

# Se não estiver inicializado:
git init
git branch -M main
git remote add origin https://github.com/Raz0rd/obomvelhinho.git
```

---

### **3. Fazer Commit Inicial**

```bash
# Adicionar todos os arquivos
git add .

# Ver o que vai ser commitado
git status

# Fazer commit
git commit -m "🎄 Deploy inicial - Obom Velhinho Store

- Next.js 14 configurado
- Sistema de carrinho implementado
- Integração PIX via Umbrela
- Sistema de pedidos com SQLite
- Painel admin protegido por IP
- Scripts de deploy Hetzner prontos
- Configurações de segurança
"
```

---

### **4. Push para GitHub**

```bash
# Push para main
git push -u origin main
```

**Se pedir autenticação:**
- Username: `Raz0rd`
- Password: Use **Personal Access Token** (não a senha)

---

## 🔑 Configurar Token GitHub

### **Criar Personal Access Token:**

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Nome: `Hetzner Deploy`
5. Scopes: ✅ `repo` (todos)
6. Generate token
7. **COPIE O TOKEN** (só aparece uma vez)

### **Usar o Token:**

```bash
# Quando pedir password, cole o token
git push -u origin main
```

**Ou configurar permanente:**

```bash
# Salvar credenciais
git config --global credential.helper store

# Fazer push (vai pedir uma vez)
git push -u origin main
# Username: Raz0rd
# Password: cole_o_token_aqui
```

---

## 📂 Estrutura do Repositório

```
obomvelhinho/
├── app/                    # Páginas Next.js
├── components/             # Componentes React
├── contexts/               # Context API
├── lib/                    # Utilitários
├── public/                 # Assets estáticos
├── .env.example           # Exemplo de variáveis
├── .gitignore             # Arquivos ignorados
├── package.json           # Dependências
├── hetzner-cloud-init.yaml # Script de deploy
├── DEPLOY_HETZNER.md      # Guia de deploy
├── SISTEMA_PEDIDOS.md     # Doc do sistema
└── README.md              # Documentação principal
```

---

## ✅ Verificar Push

1. Acesse: https://github.com/Raz0rd/obomvelhinho
2. Veja se os arquivos estão lá
3. Verifique se `.env.local` **NÃO** está no repo

---

## 🔄 Atualizações Futuras

### **Fazer mudanças:**

```bash
# Ver alterações
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "Descrição da mudança"

# Push
git push origin main
```

### **No servidor Hetzner:**

```bash
# SSH no servidor
ssh deploy@SEU_IP

# Executar deploy
/home/deploy/deploy.sh
```

**O script faz automaticamente:**
1. `git pull origin main`
2. `npm install`
3. `npm run build`
4. `pm2 restart obomvelhinho`

---

## 🌿 Branches (Opcional)

### **Criar branch de desenvolvimento:**

```bash
# Criar e mudar para dev
git checkout -b dev

# Push da branch
git push -u origin dev
```

### **Workflow sugerido:**

```
main (produção) ← merge de dev
dev (desenvolvimento) ← trabalho diário
```

**Fazer mudanças:**
1. Trabalhar na branch `dev`
2. Testar localmente
3. Merge para `main`
4. Deploy no servidor

---

## 📝 Commits Semânticos

### **Prefixos recomendados:**

```bash
# Nova funcionalidade
git commit -m "feat: adicionar filtro de produtos"

# Correção de bug
git commit -m "fix: corrigir cálculo do frete"

# Documentação
git commit -m "docs: atualizar README"

# Estilo/formatação
git commit -m "style: ajustar cores do botão"

# Refatoração
git commit -m "refactor: otimizar query do banco"

# Performance
git commit -m "perf: melhorar carregamento de imagens"

# Testes
git commit -m "test: adicionar teste de checkout"

# Deploy/config
git commit -m "chore: atualizar dependências"
```

---

## 🔒 Segurança

### **Nunca commitar:**

❌ `.env.local` (senhas, chaves API)
❌ `pedidos.db` (dados de clientes)
❌ `node_modules/` (dependências)
❌ `.next/` (build)

### **Se commitou por engano:**

```bash
# Remover do histórico
git rm --cached .env.local
git commit -m "chore: remover .env.local"
git push origin main

# Alterar todas as senhas/chaves
# Gerar novas credenciais
```

---

## 📊 GitHub Actions (Futuro)

### **CI/CD Automático:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Hetzner

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: deploy
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/obomvelhinho
            /home/deploy/deploy.sh
```

**Configurar:**
1. GitHub → Settings → Secrets
2. Adicionar: `SERVER_IP`, `SSH_PRIVATE_KEY`
3. Commit → Deploy automático! 🚀

---

## 🎯 Checklist

- [ ] .gitignore configurado
- [ ] Repositório inicializado
- [ ] Commit inicial feito
- [ ] Push para GitHub
- [ ] Verificado no GitHub
- [ ] .env.local NÃO está no repo
- [ ] Clone funciona no Hetzner

---

## 🆘 Problemas Comuns

### **"Permission denied (publickey)"**

```bash
# Verificar chave SSH
ssh -T git@github.com

# Se não funcionar, use HTTPS
git remote set-url origin https://github.com/Raz0rd/obomvelhinho.git
```

### **"fatal: not a git repository"**

```bash
git init
git remote add origin https://github.com/Raz0rd/obomvelhinho.git
```

### **"refusing to merge unrelated histories"**

```bash
git pull origin main --allow-unrelated-histories
```

---

## ✅ Resumo Rápido

```bash
# 1. Verificar status
git status

# 2. Adicionar tudo
git add .

# 3. Commit
git commit -m "🎄 Deploy inicial"

# 4. Push
git push -u origin main

# 5. Verificar no GitHub
# https://github.com/Raz0rd/obomvelhinho
```

**Pronto para produção!** 🚀🎄✨
