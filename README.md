# Vila Do Natal - Loja de Árvores de Natal

Aplicação Next.js para exibir catálogo de árvores de natal com integração à API NeverDrop.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Lucide React** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 🗂️ Estrutura do Projeto

```
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página inicial (listagem)
│   ├── produto/
│   │   └── [slug]/
│   │       └── page.tsx    # Página de detalhes do produto
│   ├── globals.css         # Estilos globais
│   └── not-found.tsx       # Página 404
├── components/
│   ├── ProductCard.tsx     # Card de produto na listagem
│   ├── ProductGallery.tsx  # Galeria de imagens
│   └── ProductInfo.tsx     # Informações do produto
├── types/
│   └── product.ts          # Tipos TypeScript
└── products.json           # Dados dos produtos
```

## 🔧 Funcionalidades

- ✅ Listagem de produtos em grid responsivo
- ✅ Página de detalhes com galeria de imagens
- ✅ Seleção de variantes (tamanhos)
- ✅ Cálculo de desconto automático
- ✅ **Carrinho de compras funcional**
- ✅ **Sistema de checkout completo**
- ✅ **Persistência do carrinho (localStorage)**
- ✅ **Múltiplos itens e quantidades**
- ✅ Design responsivo
- ✅ SEO otimizado
- ✅ Geração estática de páginas (SSG)

## 📝 Dados e Imagens

### Produtos
Os dados são carregados do arquivo `products.json` que contém a resposta da API:

```
https://api.neverdrop.com.br/products/domain/list-by-domain?page=2&perPage=50&domain=arvoresdenatal2025.shop&limit=6
```

### Imagens
Todas as imagens dos produtos estão armazenadas localmente em `/public/products/` para melhor performance e confiabilidade.

Para baixar as imagens novamente:
```bash
npm run download-images
```

Veja mais detalhes em [IMAGES.md](./IMAGES.md)

## 🛒 Carrinho e Checkout

O sistema possui carrinho de compras completo com:
- Adição de produtos com variantes
- Edição de quantidade
- Remoção de itens
- Persistência no navegador
- Checkout com formulário completo
- Integração com ViaCEP para busca de endereço

Veja documentação completa em [CARRINHO.md](./CARRINHO.md)

### Próximas integrações
- API de pagamento (PIX, Boleto, Cartão)
- Envio de emails de confirmação
- Sistema de rastreio de pedidos

## 🎨 Customização

Para personalizar cores, edite o arquivo `tailwind.config.ts`.

## 📄 Licença

Projeto desenvolvido para Vila Do Natal.
