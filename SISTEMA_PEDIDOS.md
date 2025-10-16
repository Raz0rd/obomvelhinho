# 📦 Sistema de Gerenciamento de Pedidos - SQLite

## ✅ Sistema Implementado

### **Arquivos Criados**

#### **Banco de Dados**
- `lib/db.ts` - Configuração do SQLite e schema das tabelas
- `pedidos.db` - Banco de dados (será criado automaticamente)

#### **APIs**
- `app/api/pedidos/criar/route.ts` - Criar pedido
- `app/api/pedidos/listar/route.ts` - Listar todos os pedidos
- `app/api/pedidos/atualizar-status/route.ts` - Atualizar status do pedido
- `app/api/pedidos/marcar-enviado/route.ts` - Marcar pedidos como enviados

#### **Painel Administrativo**
- `app/admin/pedidos/page.tsx` - Interface completa de gerenciamento

## 🔧 Instalação

### **1. Instalar Dependências**
```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

### **2. Iniciar Servidor**
```bash
npm run dev
```

O banco de dados será criado automaticamente na primeira execução.

## 📊 Estrutura do Banco de Dados

### **Tabela: pedidos**

```sql
id                  INTEGER PRIMARY KEY (Auto-incremento)
transaction_id      TEXT UNIQUE (ID da transação PIX)

-- Dados do Cliente
nome                TEXT
email               TEXT
telefone            TEXT (apenas números)
cpf                 TEXT (apenas números)

-- Endereço
cep                 TEXT (apenas números)
endereco            TEXT
numero              TEXT
complemento         TEXT (opcional)
bairro              TEXT
cidade              TEXT
estado              TEXT (sigla UF)

-- Pedido
items               TEXT (JSON com produtos)
total               REAL (valor total)
status              TEXT (AGUARDANDO_PAGAMENTO, PAID, ENVIADO)

-- Controle de Envio
enviado             INTEGER (0 = não, 1 = sim)
codigo_rastreio     TEXT (opcional)
data_envio          TEXT (ISO 8601)

-- Datas
created_at          TEXT (criação)
updated_at          TEXT (última atualização)
```

## 🎯 Funcionalidades do Painel Admin

### **Acesso:**
```
http://localhost:3002/admin/pedidos
```

### **1. Visualizar Pedidos**
- ✅ Lista todos os pedidos em ordem cronológica
- ✅ Exibe dados completos: cliente, contato, endereço, itens, valor
- ✅ Status visual com badges coloridos
- ✅ Checkbox para seleção múltipla

### **2. Filtros**
- **Buscar:** Nome, email, telefone ou transaction ID
- **Filtrar por Status:**
  - Todos os Pedidos
  - Pagos (status = PAID)
  - Não Enviados (enviado = 0)
  - Enviados (enviado = 1)

### **3. Copiar Dados em Lote**

Botões para copiar TODOS os dados de uma coluna:

#### **Copiar Todos os Emails**
- Copia: `email1@example.com\nemail2@example.com\n...`
- Útil para: Newsletter, avisos em massa

#### **Copiar Todos os Telefones**
- Copia: `11999999999\n21988888888\n...`
- Útil para: WhatsApp, SMS em massa

#### **Copiar Todos os Endereços Completos**
- Formato: `Rua X, 123 - Bairro, Cidade/UF - CEP: 12345-678`
- Útil para: Etiquetas de envio, transportadora

#### **Copiar Todos os Nomes**
- Copia lista de nomes
- Útil para: Conferência, relatórios

#### **Copiar Todos os CPFs**
- Copia apenas números
- Útil para: Nota fiscal, declarações

### **4. Marcar como Enviado (Em Lote)**

1. **Selecione** os pedidos (checkbox)
2. **Digite** código de rastreio (opcional)
3. **Clique** em "Marcar como Enviado"

**O que acontece:**
- Status → `ENVIADO`
- Campo `enviado` → `1`
- Salva `codigo_rastreio`
- Registra `data_envio`

## 🔄 Fluxo Automático

### **1. Cliente Finaliza Compra**
```
Checkout → Cria transação PIX → Salva no banco
Status: AGUARDANDO_PAGAMENTO
```

### **2. Cliente Paga**
```
PIX confirmado → Polling detecta → Atualiza banco
Status: PAID
```

### **3. Admin Envia Pedido**
```
Seleciona pedidos → Marca como enviado → Adiciona rastreio
Status: ENVIADO
enviado: 1
```

## 📱 Exemplos de Uso

### **Cenário 1: Enviar Códigos de Rastreio**

1. Acesse `/admin/pedidos`
2. Filtre: "Pagos" + "Não Enviados"
3. Clique "Copiar Todos os Emails"
4. Cole no seu sistema de email
5. Envie códigos de rastreio
6. Selecione todos os pedidos
7. Marque como enviado

### **Cenário 2: Imprimir Etiquetas**

1. Filtre: "Não Enviados"
2. Clique "Copiar Todos os Endereços"
3. Cole no Excel/Word
4. Imprima etiquetas
5. Após enviar, marque como enviado

### **Cenário 3: WhatsApp em Massa**

1. Clique "Copiar Todos os Telefones"
2. Use ferramenta de WhatsApp Business
3. Envie mensagem: "Seu pedido foi enviado! Rastreio: XXX"

### **Cenário 4: Relatório para Transportadora**

1. Selecione pedidos da semana
2. Copie endereços completos
3. Envie para transportadora
4. Receba códigos de rastreio
5. Cole nos campos e marque como enviado

## 🔍 Consultas Úteis

### **Ver Pedidos Pendentes**
```
Filtro: "Pagos" + Busca vazia
```

### **Ver Pedidos Não Enviados**
```
Filtro: "Não Enviados"
```

### **Buscar Pedido Específico**
```
Busca: Nome, email ou ID da transação
```

## 💾 Backup do Banco

O arquivo `pedidos.db` contém TODOS os dados.

### **Fazer Backup:**
```bash
# Copie o arquivo
cp pedidos.db backup-pedidos-2025-01-15.db
```

### **Restaurar Backup:**
```bash
# Substitua o arquivo
cp backup-pedidos-2025-01-15.db pedidos.db
```

## 📊 Estatísticas

No painel você pode ver:
- **Total de pedidos**
- **Pedidos filtrados**
- **Status de cada pedido**
- **Data/hora de criação**

## ⚠️ Pontos de Atenção

### **1. Telefone e CPF**
- Salvos SEM formatação (apenas números)
- Exibidos COM formatação no painel

### **2. Status**
- `AGUARDANDO_PAGAMENTO` → Criado, aguardando PIX
- `PAID` → Pago e confirmado
- `ENVIADO` → Marcado como enviado pelo admin

### **3. Código de Rastreio**
- Opcional ao marcar como enviado
- Pode ser adicionado depois editando o campo

### **4. Seleção Múltipla**
- Checkbox individual por pedido
- "Selecionar todos" seleciona apenas os filtrados
- Use para ações em lote

## 🎯 Próximas Melhorias Sugeridas

### **1. Exportar para Excel**
- Botão para baixar CSV/Excel
- Com todos os dados filtrados

### **2. Editar Pedido**
- Modal para editar dados do pedido
- Útil para correções

### **3. Histórico de Status**
- Log de mudanças de status
- Quem alterou e quando

### **4. Dashboard**
- Gráficos de vendas
- Pedidos por período
- Valor total faturado

### **5. Notificações Automáticas**
- Email automático ao pagar
- SMS com código de rastreio
- WhatsApp quando enviado

## 🔐 Segurança

### **Importante:**
- A rota `/admin/pedidos` está PÚBLICA
- **Recomendado:** Adicionar autenticação
- Proteger com senha ou login

### **Adicionar Proteção (Futuro):**
```typescript
// Adicionar middleware de autenticação
// Verificar se usuário está logado
// Redirecionar para login se não autenticado
```

## 📝 Logs e Debug

### **Ver Logs:**
- Console do servidor mostra todas as operações
- Erros são registrados no console

### **Testar API Manualmente:**
```bash
# Listar pedidos
curl http://localhost:3002/api/pedidos/listar

# Marcar como enviado
curl -X POST http://localhost:3002/api/pedidos/marcar-enviado \
  -H "Content-Type: application/json" \
  -d '{"pedidoIds": [1, 2], "codigoRastreio": "BR123456789"}'
```

## 🎄 Pronto para Usar!

O sistema está 100% funcional e pronto para gerenciar seus pedidos de Natal! 🎅✨

**Acesse agora:** `http://localhost:3002/admin/pedidos`
