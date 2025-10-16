import fs from 'fs';

// Ler o arquivo products.json
const data = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

// Encontrar e corrigir o produto com slug muito longo
data.items.forEach(product => {
  if (product.id === '383edf80-f6ec-45cf-a3f9-79a3fe5db240') {
    // Criar um slug limpo baseado apenas no título
    const cleanSlug = product.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-|-$/g, ''); // Remove hífens no início/fim
    
    product.slug = cleanSlug;
    console.log(`✅ Slug corrigido: ${cleanSlug}`);
  }
});

// Salvar o arquivo corrigido
fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
console.log('✅ Arquivo products.json atualizado!');
