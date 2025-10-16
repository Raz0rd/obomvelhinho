# 🛒 Sistema de Carrinho e Checkout

## ✅ Funcionalidades Implementadas

### **Carrinho de Compras**
- ✅ Adicionar produtos ao carrinho
- ✅ Selecionar variantes (tamanhos)
- ✅ Múltiplos itens no carrinho
- ✅ Editar quantidade de cada item
- ✅ Remover itens do carrinho
- ✅ Persistência no localStorage
- ✅ Contador visual no header
- ✅ Cálculo automático do total

### **Checkout**
- ✅ Formulário completo de dados pessoais
- ✅ Busca de endereço por CEP (BrasilAPI)
- ✅ Campos de endereço aparecem após buscar CEP
- ✅ Apenas número e complemento editáveis
- ✅ Pagamento via PIX (com desconto de 5%)
- ✅ Boleto e Cartão desabilitados temporariamente
- ✅ Resumo do pedido com preview dos produtos
- ✅ Validação de campos obrigatórios
- ✅ Processamento do pedido

## 🗂️ Estrutura de Arquivos

```
├── contexts/
│   └── CartContext.tsx          # Context do carrinho (gerenciamento de estado)
├── components/
│   ├── Header.tsx               # Header com ícone do carrinho
│   ├── ProductInfo.tsx          # Botão "Comprar Agora" integrado
│   └── ...
├── app/
│   ├── carrinho/
│   │   └── page.tsx            # Página do carrinho
│   └── checkout/
│       └── page.tsx            # Página de checkout
```

## 🔧 Como Funciona

### **CartContext**

O carrinho é gerenciado por um Context React com as seguintes funções:

```typescript
const { 
  items,              // Array de itens no carrinho
  addToCart,          // Adicionar produto
  removeFromCart,     // Remover produto
  updateQuantity,     // Atualizar quantidade
  clearCart,          // Limpar carrinho
  getCartTotal,       // Calcular total
  getCartCount        // Contar itens
} = useCart();
```

### **Estrutura do Item do Carrinho**

```typescript
{
  product: Product,           // Dados completos do produto
  selectedVariant?: Variant,  // Variante selecionada (opcional)
  quantity: number           // Quantidade
}
```

### **Persistência**

O carrinho é salvo automaticamente no `localStorage` e carregado ao iniciar a aplicação.

## 🎯 Fluxo do Usuário

1. **Página do Produto** → Seleciona variante → Clica em "Comprar Agora"
2. **Carrinho** → Revisa itens → Ajusta quantidades → "Finalizar Compra"
3. **Checkout** → Preenche dados → Seleciona pagamento → "Finalizar Pedido"
4. **Confirmação** → Pedido processado → Carrinho limpo

## 🚀 Próximas Integrações

### **API de Pagamento**
No arquivo `/app/checkout/page.tsx`, localize a função `handleSubmit`:

```typescript
// TODO: Integrar com API de pagamento
// Exemplo de integração:
const response = await fetch('/api/pedidos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cliente: formData,
    items,
    total,
  }),
});
```

### **Envio de Email**
Adicione o envio de email de confirmação após o pedido:

```typescript
// TODO: Enviar email de confirmação
await fetch('/api/email/confirmacao', {
  method: 'POST',
  body: JSON.stringify({
    email: formData.email,
    pedido: pedidoId,
  }),
});
```

## 🌐 Integração com BrasilAPI

O sistema utiliza a **BrasilAPI** para buscar endereços por CEP:

```typescript
const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
const data = await response.json();
// Retorna: cep, state, city, neighborhood, street
```

**Fluxo:**
1. Usuário digita CEP (8 dígitos)
2. Clica em "Buscar"
3. Sistema busca na BrasilAPI
4. Campos de endereço são preenchidos automaticamente
5. Apenas "Número" e "Complemento" ficam editáveis
6. Botão "Alterar" permite trocar o CEP

## 📝 Validações Implementadas

- ✅ Variante obrigatória quando disponível
- ✅ Campos obrigatórios no checkout
- ✅ CEP válido (8 dígitos) com busca automática
- ✅ Email válido
- ✅ Telefone e CPF
- ✅ Endereço deve ser carregado via CEP antes de prosseguir

## 🎨 Recursos Visuais

- Badge com contador no ícone do carrinho
- Preview de imagens dos produtos
- Botões de quantidade (+/-)
- Confirmações visuais
- Estados de loading
- Mensagens de erro/sucesso

## 🛠️ Personalização

### Alterar métodos de pagamento

Edite `/app/checkout/page.tsx`:

```typescript
<input
  type="radio"
  name="metodoPagamento"
  value="seu_metodo"
  // ...
/>
```

### Alterar cálculo de frete

No momento o frete está como "Grátis". Para integrar cálculo real:

```typescript
const [frete, setFrete] = useState(0);

// Calcular frete baseado no CEP
const calcularFrete = async (cep: string) => {
  const response = await fetch(`/api/frete?cep=${cep}`);
  const data = await response.json();
  setFrete(data.valor);
};
```

## 📱 Responsividade

Todas as páginas são totalmente responsivas:
- Mobile: Layout em coluna única
- Tablet: Layout adaptado
- Desktop: Grid com 2-3 colunas
