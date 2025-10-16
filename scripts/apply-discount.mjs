import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const productsPath = path.join(__dirname, '..', 'products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  console.log('🎄 PROMOÇÃO DE NATAL - Aplicando 20% de desconto\n');
  
  let updatedCount = 0;
  
  productsData.items.forEach((product) => {
    const oldPrice = product.priceWithDiscount || product.price;
    const newPrice = Math.round(oldPrice * 0.80 * 100) / 100; // 20% de desconto
    
    console.log(`📦 ${product.title}`);
    console.log(`   De: R$ ${oldPrice.toFixed(2)} → Para: R$ ${newPrice.toFixed(2)}`);
    console.log(`   Economia: R$ ${(oldPrice - newPrice).toFixed(2)}\n`);
    
    product.priceWithDiscount = newPrice;
    updatedCount++;
  });
  
  // Salvar arquivo atualizado
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2), 'utf8');
  
  console.log('='.repeat(50));
  console.log(`✅ ${updatedCount} produtos atualizados!`);
  console.log(`🎁 Desconto de 20% aplicado em todos os produtos!`);
  console.log('='.repeat(50));
}

main().catch(console.error);
