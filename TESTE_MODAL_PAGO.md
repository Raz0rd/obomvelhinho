# 🧪 Como Testar o Modal de Pagamento Confirmado no Localhost

## Opção 1: Forçar Status "paid" (RECOMENDADO - Mais Rápido)

### Passo 1: Modificar temporariamente o PixPayment.tsx

No arquivo `components/PixPayment.tsx`, linha 38, altere:

```typescript
// DE:
const [status, setStatus] = useState<'waiting' | 'paid' | 'error'>('waiting');

// PARA:
const [status, setStatus] = useState<'waiting' | 'paid' | 'error'>('paid');
```

### Passo 2: Acessar o checkout

1. Adicione um produto ao carrinho
2. Vá para `/checkout`
3. Preencha o formulário
4. Clique em "Gerar QR Code PIX"
5. O modal de pagamento confirmado aparecerá imediatamente!

### Passo 3: Reverter a mudança

**IMPORTANTE:** Depois de testar, reverta a linha 38 para:
```typescript
const [status, setStatus] = useState<'waiting' | 'paid' | 'error'>('waiting');
```

---

## Opção 2: Fazer um Pagamento Real de Teste

### Passo 1: Iniciar o servidor local

```bash
npm run dev
```

### Passo 2: Fazer um pedido

1. Acesse `http://localhost:3000`
2. Adicione um produto ao carrinho
3. Vá para checkout
4. Preencha os dados
5. Gere o QR Code PIX

### Passo 3: Pagar o PIX

Use o app do banco para pagar o PIX gerado (valor real será cobrado)

### Passo 4: Aguardar

O polling verifica a cada 5 segundos. Quando o pagamento for confirmado pela Umbrela, o modal aparecerá automaticamente.

---

## Opção 3: Simular Resposta da API (Intermediário)

### Modificar temporariamente o polling

No arquivo `components/PixPayment.tsx`, na função `checkPayment` (linha ~51), adicione antes do fetch:

```typescript
const checkPayment = async () => {
  try {
    // TESTE: Simular pagamento confirmado após 10 segundos
    if (Date.now() - startTime > 10000) {
      setStatus('paid');
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      return;
    }
    
    const response = await fetch(`/api/payment/status/${transactionId}`);
    // ... resto do código
```

E adicione no início do useEffect:
```typescript
const startTime = Date.now();
```

---

## 🎯 Recomendação

Use a **Opção 1** para testar rapidamente o visual e comportamento do modal.

**Lembre-se de reverter as alterações antes de fazer commit!**
