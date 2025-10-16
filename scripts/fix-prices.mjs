import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const productsPath = path.join(__dirname, '..', 'products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  console.log('🔍 Procurando produtos com preço 0,00...\n');
  
  let updatedCount = 0;
  const newPrice = 19.90;
  
  productsData.items.forEach((product) => {
    if (product.priceWithDiscount === 0) {
      console.log(`📦 Produto: ${product.title}`);
      console.log(`   Preço original: R$ ${product.price.toFixed(2)}`);
      console.log(`   Preço com desconto: R$ ${product.priceWithDiscount.toFixed(2)} → R$ ${newPrice.toFixed(2)}`);
      
      product.priceWithDiscount = newPrice;
      updatedCount++;
      console.log(`   ✅ Atualizado!\n`);
    }
  });
  
  if (updatedCount > 0) {
    // Salvar arquivo atualizado
    fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2), 'utf8');
    
    console.log('='.repeat(50));
    console.log(`✅ ${updatedCount} produto(s) atualizado(s) com sucesso!`);
    console.log(`💰 Novo preço com desconto: R$ ${newPrice.toFixed(2)}`);
    console.log('='.repeat(50));
  } else {
    console.log('ℹ️  Nenhum produto com preço 0,00 encontrado.');
  }
}

main().catch(console.error);
