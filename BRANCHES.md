# 🌿 Estratégia de Branches - Obom Velhinho

## 📋 Estrutura de Branches

Este projeto utiliza **dois branches principais** para gerenciar diferentes domínios em máquinas separadas:

---

## 🔴 Branch: `main`

**Domínio:** `obomvelhinho.store`  
**Servidor:** Máquina original (Hetzner/atual)  
**URL:** https://obomvelhinho.store

### Características:
- ✅ Branch padrão do repositório
- ✅ Configurado para domínio `.store`
- ✅ Emails enviados de: `sac@obomvelhinho.store`
- ✅ Links nos emails apontam para: `obomvelhinho.store`

### Deploy:
```bash
cd /var/www/obomvelhinho
git checkout main
git pull origin main
npm install
npm run build
pm2 restart obomvelhinho
```

---

## 🔵 Branch: `domain-com`

**Domínio:** `obomvelhinho.com`  
**Servidor:** Máquina nova  
**URL:** https://obomvelhinho.com

### Características:
- ✅ Branch separado para domínio `.com`
- ✅ Configurado para domínio `.com`
- ✅ Emails enviados de: `sac@obomvelhinho.com`
- ✅ Links nos emails apontam para: `obomvelhinho.com`
- ✅ Inclui guia de instalação completo: `INSTALACAO_LINUX.md`

### Deploy:
```bash
cd /var/www/obomvelhinho
git checkout domain-com
git pull origin domain-com
npm install
npm run build
pm2 restart obomvelhinho
```

---

## 🔄 Workflow de Desenvolvimento

### Fazendo alterações que afetam AMBOS os domínios:

1. **Desenvolver no branch `main`:**
   ```bash
   git checkout main
   # Faça suas alterações
   git add .
   git commit -m "feat: sua funcionalidade"
   git push origin main
   ```

2. **Aplicar as mesmas alterações no branch `domain-com`:**
   ```bash
   git checkout domain-com
   git merge main
   # ATENÇÃO: Conflitos podem ocorrer nos arquivos de email e configuração
   # Resolver conflitos mantendo as URLs .com
   git push origin domain-com
   ```

3. **OU fazer cherry-pick de commits específicos:**
   ```bash
   git checkout domain-com
   git cherry-pick <commit-hash>
   git push origin domain-com
   ```

---

## ⚠️ Arquivos Específicos por Branch

### Arquivos que DIFEREM entre branches:

**NÃO fazer merge direto destes arquivos:**

- `.env.example` - `NEXT_PUBLIC_SITE_URL` diferente
- `emails/PedidoAguardandoPagamento.tsx` - URLs e email diferem
- `emails/PedidoConfirmado.tsx` - URLs e email diferem
- `emails/PedidoEnviado.tsx` - URLs e email diferem
- `lib/email.ts` - Email remetente difere
- `INSTALACAO_LINUX.md` - Específico do domain-com

**Ao fazer merge, resolver conflitos mantendo:**
- `main`: referências a `.store`
- `domain-com`: referências a `.com`

---

## 📦 Deploy por Servidor

### Servidor 1 (obomvelhinho.store):
```bash
# Clone inicial
git clone https://github.com/Raz0rd/obomvelhinho.git
cd obomvelhinho
git checkout main

# Criar .env.local com:
NEXT_PUBLIC_SITE_URL=https://obomvelhinho.store

# Deploy
npm install
npm run build
pm2 start npm --name "obomvelhinho" -- start
```

### Servidor 2 (obomvelhinho.com):
```bash
# Clone inicial
git clone https://github.com/Raz0rd/obomvelhinho.git
cd obomvelhinho
git checkout domain-com

# Criar .env.local com:
NEXT_PUBLIC_SITE_URL=https://obomvelhinho.com

# Deploy
npm install
npm run build
pm2 start npm --name "obomvelhinho" -- start
```

---

## 🎯 Comandos Úteis

### Ver qual branch está ativo:
```bash
git branch
```

### Listar todos os branches (local e remoto):
```bash
git branch -a
```

### Trocar entre branches:
```bash
# Para .store
git checkout main

# Para .com
git checkout domain-com
```

### Ver diferenças entre branches:
```bash
git diff main domain-com
```

### Ver commits únicos em cada branch:
```bash
# Commits em domain-com que não estão em main
git log main..domain-com

# Commits em main que não estão em domain-com
git log domain-com..main
```

---

## ✅ Checklist de Deploy

### Antes de fazer deploy em QUALQUER servidor:

- [ ] Verificar branch correto (`git branch`)
- [ ] Pull das últimas alterações (`git pull`)
- [ ] Verificar `.env.local` com domínio correto
- [ ] Build sem erros (`npm run build`)
- [ ] Testar localmente se possível
- [ ] Reiniciar PM2 (`pm2 restart obomvelhinho`)
- [ ] Verificar logs (`pm2 logs obomvelhinho`)
- [ ] Testar site no navegador
- [ ] Testar email (se houver alterações)

---

## 🚨 Problemas Comuns

### Email indo para domínio errado:
```bash
# Verificar branch
git branch

# Verificar arquivo lib/email.ts
grep -n "sac@" lib/email.ts

# Se estiver errado, trocar de branch
git checkout [branch-correto]
```

### Links dos emails apontando para domínio errado:
```bash
# Verificar templates
grep -r "obomvelhinho" emails/

# Se estiver errado, trocar de branch
git checkout [branch-correto]
```

### Conflitos ao fazer merge:
```bash
# Ver arquivos em conflito
git status

# Editar manualmente mantendo as URLs corretas para cada branch
# Depois:
git add .
git commit -m "fix: Resolver conflitos mantendo URLs corretas"
```

---

## 📞 Suporte

- **Branch atual:** `git branch`
- **Última atualização:** `git log -1`
- **Status do repositório:** `git status`

🎄 **Obom Velhinho - Gerenciamento de Branches**
