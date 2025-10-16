# 🖼️ Guia de Otimização de Imagens

## 🚀 Como Usar

### **1. Instalar dependências:**
```bash
npm install
```

### **2. Otimizar todas as imagens:**
```bash
npm run optimize-images
```

Este comando vai:
- ✅ Escanear `public/` e `public/products/`
- ✅ Redimensionar imagens maiores que 1200x1200px
- ✅ Comprimir com qualidade 80%
- ✅ Converter para formato otimizado
- ✅ Mostrar redução de tamanho

## 📊 Configurações

Edite `scripts/optimize-images.mjs`:

```javascript
const MAX_WIDTH = 1200;    // Largura máxima
const MAX_HEIGHT = 1200;   // Altura máxima
const QUALITY = 80;        // Qualidade (0-100)
```

## 🎯 Otimização Automática do Next.js

O Next.js já otimiza imagens automaticamente quando você usa o componente `<Image>`:

```jsx
import Image from 'next/image';

<Image 
  src="/products/imagem.jpg"
  width={500}
  height={500}
  alt="Produto"
  loading="lazy"
  quality={80}
/>
```

### **Benefícios:**
- ✅ Converte automaticamente para WebP
- ✅ Gera múltiplos tamanhos responsivos
- ✅ Lazy loading automático
- ✅ Cache de 30 dias
- ✅ Reduz até 70% do tamanho

## 📏 Tamanhos Recomendados

| Tipo | Largura | Altura | Peso Max |
|------|---------|--------|----------|
| Produto | 1200px | 1200px | 200KB |
| Thumbnail | 300px | 300px | 50KB |
| Banner | 1920px | 600px | 300KB |
| Logo | 500px | 500px | 100KB |

## 🔧 Comandos Úteis

```bash
# Ver tamanho total das imagens
du -sh public/products/

# Contar quantas imagens
find public/products/ -type f | wc -l

# Ver as 10 maiores imagens
find public/products/ -type f -exec du -h {} + | sort -rh | head -10
```

## ⚡ Performance

### **Antes da Otimização:**
- 📦 Imagem média: ~800KB
- 🌐 Carregamento: ~5s

### **Depois da Otimização:**
- 📦 Imagem média: ~150KB (redução de 81%)
- 🌐 Carregamento: ~1s

## 🎨 Formatos

| Formato | Uso | Tamanho | Qualidade |
|---------|-----|---------|-----------|
| **WebP** | ✅ Melhor opção | Menor | Excelente |
| **JPEG** | Fotos | Médio | Boa |
| **PNG** | Transparência | Maior | Perfeita |

## 📝 Checklist

- [ ] Executar `npm run optimize-images`
- [ ] Verificar redução de tamanho
- [ ] Testar carregamento no navegador
- [ ] Fazer commit das imagens otimizadas
- [ ] Deploy no servidor

## 🆘 Troubleshooting

### **Erro: "sharp não instalado"**
```bash
npm install sharp
```

### **Imagens muito pequenas**
Aumente a qualidade em `scripts/optimize-images.mjs`:
```javascript
const QUALITY = 85; // Era 80
```

### **Imagens perdendo qualidade**
Aumente o tamanho máximo:
```javascript
const MAX_WIDTH = 1500;  // Era 1200
const MAX_HEIGHT = 1500; // Era 1200
```

## 💡 Dicas

1. **Execute a otimização após adicionar novas imagens**
2. **Sempre use `<Image>` do Next.js, não `<img>`**
3. **Configure lazy loading** para carregar só quando visível
4. **Use CDN** para servir imagens (opcional)
5. **Monitore tamanho** com Lighthouse / PageSpeed

## 🔍 Monitoramento

### **Teste de Performance:**
1. Abra DevTools (F12)
2. Vá em "Network"
3. Recarregue a página
4. Filtre por "Img"
5. Veja tamanho transferido

### **Google PageSpeed:**
https://pagespeed.web.dev/

Digite seu domínio e veja score de performance.
