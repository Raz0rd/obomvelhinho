# 📧 Configuração de Email no Cloudflare

## ✉️ Email: sac@obomvelhinho.store

### **Opção 1: Usar Cloudflare Email Routing (Recomendado - GRATUITO)**

#### **Passo 1: Ativar Email Routing**
1. Acesse Cloudflare Dashboard
2. Selecione seu domínio: `obomvelhinho.store`
3. Vá em **Email** → **Email Routing**
4. Clique em **Get Started**

#### **Passo 2: Adicionar Registros DNS**
Cloudflare vai adicionar automaticamente, mas confirme:

```
Type: MX
Name: @
Content: route1.mx.cloudflare.net
Priority: 86
TTL: Auto
```

```
Type: MX
Name: @
Content: route2.mx.cloudflare.net
Priority: 25
TTL: Auto
```

```
Type: MX
Name: @
Content: route3.mx.cloudflare.net
Priority: 48
TTL: Auto
```

```
Type: TXT
Name: @
Content: v=spf1 include:_spf.mx.cloudflare.net ~all
TTL: Auto
```

#### **Passo 3: Criar Alias de Email**
1. Em **Email Routing** → **Destination addresses**
2. Clique em **Add destination address**
3. Adicione seu email pessoal (ex: seuemail@gmail.com)
4. Verifique o email (clique no link enviado)

#### **Passo 4: Criar Rota**
1. Em **Routing Rules**
2. Clique em **Create address**
3. **Custom address:** `sac@obomvelhinho.store`
4. **Action:** Forward to → Selecione seu email verificado
5. Clique em **Save**

✅ **Pronto!** Emails enviados para `sac@obomvelhinho.store` serão encaminhados para você.

---

## 📤 Opção 2: Usar Amazon SES para ENVIAR emails

### **Configurações DNS Atuais (Manter):**

#### **1. MX Record (Recebimento)**
```
Type: MX
Name: send
Content: feedback-smtp.sa-east-1.amazonses.com
Priority: 10
TTL: Auto
```

#### **2. SPF Record (Autenticação)**
```
Type: TXT
Name: send
Content: v=spf1 include:amazonses.com ~all
TTL: Auto
```

#### **3. DKIM Record (Assinatura)**
```
Type: TXT
Name: resend._domainkey
Content: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvMTVaW7S8/MS6GYpQxdS0DWsFX4jQUxb1TwYIsqkYJvIP6EVivbaRlzg4l75nebTJ+1SUDtlzt94bp/QEOtA0itUmhdN1vGF/7c4hgLmqDp+trnp7RL+JOFfwrZarOWpHC2SkJnND8MWEK5Jq5kQLNJrB/z6N0jdRD0OjND6G8QIDAQAB
TTL: Auto
```

#### **4. DMARC Record (Política)**
```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none; rua=mailto:sac@obomvelhinho.store
TTL: Auto
```

---

## 🔧 Configuração Completa Recomendada

### **Para RECEBER emails (sac@obomvelhinho.store):**
Use **Cloudflare Email Routing** (Opção 1)

### **Para ENVIAR emails (notificações automáticas):**
Use **Amazon SES** (Opção 2 - já configurado)

### **Registros DNS Finais no Cloudflare:**

```
# Email Routing (Recebimento) - Cloudflare
Type: MX
Name: @
Content: route1.mx.cloudflare.net
Priority: 86

Type: MX
Name: @
Content: route2.mx.cloudflare.net
Priority: 25

Type: MX
Name: @
Content: route3.mx.cloudflare.net
Priority: 48

Type: TXT
Name: @
Content: v=spf1 include:_spf.mx.cloudflare.net include:amazonses.com ~all

# DKIM - Amazon SES
Type: TXT
Name: resend._domainkey
Content: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvMTVaW7S8/MS6GYpQxdS0DWsFX4jQUxb1TwYIsqkYJvIP6EVivbaRlzg4l75nebTJ+1SUDtlzt94bp/QEOtA0itUmhdN1vGF/7c4hgLmqDp+trnp7RL+JOFfwrZarOWpHC2SkJnND8MWEK5Jq5kQLNJrB/z6N0jdRD0OjND6G8QIDAQAB

# DMARC
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=quarantine; rua=mailto:sac@obomvelhinho.store; pct=100
```

---

## ✅ Verificação

### **Testar Recebimento:**
1. Envie um email para: `sac@obomvelhinho.store`
2. Verifique se chegou no email de destino

### **Testar SPF/DKIM:**
Use: https://mxtoolbox.com/spf.aspx
- Digite: `obomvelhinho.store`
- Verifique se está tudo verde ✅

### **Testar DMARC:**
Use: https://mxtoolbox.com/dmarc.aspx
- Digite: `obomvelhinho.store`
- Verifique configuração

---

## 🎯 Resumo

**✅ Cloudflare Email Routing**
- Gratuito e ilimitado
- Recebe emails em sac@obomvelhinho.store
- Encaminha para seu email pessoal
- Configuração em 5 minutos

**✅ Amazon SES**
- Para enviar emails automáticos
- Notificações de pedidos
- Códigos de rastreio
- Confirmações

**Melhor dos dois mundos!** 📧✨
