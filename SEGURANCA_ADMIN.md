# 🔒 Segurança do Painel Administrativo

## 🛡️ Proteção por IP Whitelist

### **Sistema Implementado**

A rota `/admin/pedidos` e as APIs de gerenciamento agora estão protegidas por IP whitelist.

---

## ⚙️ Configuração

### **1. Adicionar IP no .env**

Edite o arquivo `.env.local` e adicione:

```env
ADMIN_IP_WHITELIST=127.0.0.1,::1,SEU_IP_AQUI
```

**Formato:**
- Separe múltiplos IPs com vírgula
- Sem espaços entre os IPs
- Suporta IPv4 e IPv6

**Exemplo:**
```env
ADMIN_IP_WHITELIST=127.0.0.1,::1,192.168.1.100,203.0.113.45
```

---

## 🔍 Como Descobrir Seu IP

### **Opção 1: Site Externo**
Acesse: https://www.whatismyip.com/

### **Opção 2: Pela Aplicação**
1. Tente acessar `/admin/pedidos`
2. Você verá a mensagem de "Acesso Negado"
3. Seu IP será exibido na tela
4. Copie e adicione no `.env.local`

### **Opção 3: Via Cloudflare**
Se estiver usando Cloudflare:
- Acesse: https://www.cloudflare.com/cdn-cgi/trace
- Procure por: `ip=SEU_IP`

---

## 🏢 IPs para Incluir

### **Desenvolvimento Local:**
```env
ADMIN_IP_WHITELIST=127.0.0.1,::1
```

### **Escritório + Casa:**
```env
ADMIN_IP_WHITELIST=127.0.0.1,::1,IP_ESCRITORIO,IP_CASA
```

### **Com IP Dinâmico (4G/5G):**
Se seu IP muda constantemente, considere:
1. Usar VPN com IP fixo
2. Adicionar faixa de IPs do provedor
3. Usar autenticação por senha (próximo passo)

---

## 🚀 Aplicar Mudanças

### **1. Reiniciar Servidor**
```bash
# Pare o servidor (Ctrl + C)
# Inicie novamente
npm run dev
```

### **2. Testar Acesso**
```
http://localhost:3002/admin/pedidos
```

**Se IP permitido:** Painel carrega normalmente ✅
**Se IP negado:** Tela vermelha de "Acesso Negado" 🚫

---

## 🌐 Headers Verificados

O sistema verifica IP nesta ordem:

1. **cf-connecting-ip** (Cloudflare)
2. **x-real-ip** (Proxy reverso)
3. **x-forwarded-for** (Load balancer)
4. IP direto da conexão

---

## 📊 Logs de Acesso

Todos os acessos são registrados no console:

**Acesso Permitido:**
```
[IP Check] Cliente: 192.168.1.100 | Permitido: true
[ADMIN] Acesso permitido para IP: 192.168.1.100
```

**Acesso Negado:**
```
[IP Check] Cliente: 203.0.113.99 | Permitido: false
[ADMIN] Acesso negado para IP: 203.0.113.99
```

---

## 🔐 Rotas Protegidas

### **APIs:**
- ✅ `GET /api/pedidos/listar`
- ✅ `POST /api/pedidos/marcar-enviado`
- ✅ `GET /api/admin/check-access`

### **Páginas:**
- ✅ `/admin/pedidos`

### **Não Protegidas:**
- ❌ `POST /api/pedidos/criar` (usado pelo checkout)
- ❌ `POST /api/pedidos/atualizar-status` (webhook de pagamento)

---

## 🚨 Troubleshooting

### **Problema: "Acesso Negado" mesmo com IP correto**

**Solução 1:** Verificar `.env.local`
```bash
# Ver conteúdo
cat .env.local | grep ADMIN_IP_WHITELIST
```

**Solução 2:** Verificar formato
```env
# ❌ Errado (com espaços)
ADMIN_IP_WHITELIST=127.0.0.1, 192.168.1.100

# ✅ Correto (sem espaços)
ADMIN_IP_WHITELIST=127.0.0.1,192.168.1.100
```

**Solução 3:** Reiniciar servidor
```bash
# Ctrl + C para parar
npm run dev
```

**Solução 4:** Verificar IP no console
```
Olhe nos logs do servidor:
[IP Check] Cliente: SEU_IP | Permitido: false
```

### **Problema: IP muda constantemente (4G/Mobile)**

**Opção 1:** Adicionar vários IPs
```env
ADMIN_IP_WHITELIST=IP1,IP2,IP3,IP4
```

**Opção 2:** Desabilitar temporariamente (desenvolvimento)
```env
# Permitir todos (NÃO USE EM PRODUÇÃO!)
# Comente a verificação no código
```

**Opção 3:** Usar VPN com IP fixo
- Contrate VPN com IP dedicado
- Configure VPN no computador
- Adicione IP da VPN no whitelist

---

## 🌍 Cloudflare + IP Whitelist

### **Cloudflare detecta IP real:**

O sistema usa `cf-connecting-ip` header do Cloudflare.

**Importante:**
- ✅ Seu IP real é detectado corretamente
- ✅ Não precisa do IP do Cloudflare
- ✅ Funciona com proxy orange cloud ativado

### **Testar:**
```bash
# Ver headers Cloudflare
curl -I https://arvoresdenatal2025.shop/admin/pedidos
```

---

## 🔑 Próximos Passos de Segurança

### **1. Autenticação por Senha (Recomendado)**
```typescript
// Adicionar login com usuário/senha
// Sessões com cookies
// Hash de senhas com bcrypt
```

### **2. Autenticação 2FA**
```typescript
// Google Authenticator
// Código SMS
// Email OTP
```

### **3. Rate Limiting**
```typescript
// Limitar tentativas de acesso
// Bloquear após X falhas
// CAPTCHA após tentativas
```

### **4. Firewall Cloudflare**
```
# Criar regra no Cloudflare:
- URI Path = /admin/*
- IP não está em [LISTA_IPS]
- Ação: Bloquear
```

---

## 📝 Checklist de Segurança

### **Desenvolvimento:**
- [ ] `.env.local` com IP local (127.0.0.1)
- [ ] Teste de acesso permitido
- [ ] Teste de acesso negado (IP diferente)

### **Produção:**
- [ ] IP do escritório no whitelist
- [ ] IP de casa no whitelist (opcional)
- [ ] `.env.local` no `.gitignore`
- [ ] Nunca commitar IPs no Git
- [ ] Monitorar logs de acesso
- [ ] Backup do whitelist

---

## ✅ Exemplo Completo

### **.env.local**
```env
# API Umbrela
UMBRELA_API_KEY=sua-chave-aqui
UMBRELA_API_URL=https://api-gateway.umbrellapag.com/api
UMBRELA_USER_AGENT=UMBRELLAB2B/1.0

# IP Whitelist
ADMIN_IP_WHITELIST=127.0.0.1,::1,192.168.1.100,203.0.113.45
```

### **Verificar:**
```bash
# 1. Reiniciar
npm run dev

# 2. Acessar
http://localhost:3002/admin/pedidos

# 3. Ver logs
[IP Check] Cliente: 127.0.0.1 | Permitido: true
[ADMIN] Acesso permitido para IP: 127.0.0.1
```

---

## 🎯 Resumo

✅ **Proteção por IP implementada**
✅ **Suporte a múltiplos IPs**
✅ **Compatível com Cloudflare**
✅ **Logs de acesso detalhados**
✅ **Tela amigável de acesso negado**

**Seu painel admin agora está protegido!** 🔒🎄✨
