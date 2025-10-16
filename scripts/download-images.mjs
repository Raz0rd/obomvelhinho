import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório de destino
const imagesDir = path.join(__dirname, '..', 'public', 'products');

// Criar diretório se não existir
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Função para baixar uma imagem
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Função para gerar nome de arquivo único
function getImageFilename(url, productId, position) {
  const urlParts = new URL(url);
  const filename = urlParts.pathname.split('/').pop();
  const ext = path.extname(filename) || '.jpg';
  return `${productId}-${position}${ext}`;
}

async function main() {
  // Ler products.json
  const productsPath = path.join(__dirname, '..', 'products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  console.log(`📦 Total de produtos: ${productsData.items.length}`);
  
  let totalImages = 0;
  let downloadedImages = 0;
  let errors = 0;
  
  // Mapear novas URLs
  const updatedProducts = { ...productsData };
  
  for (const product of updatedProducts.items) {
    console.log(`\n🎄 Processando: ${product.title}`);
    
    for (const image of product.images) {
      totalImages++;
      const filename = getImageFilename(image.imageUrl, product.id, image.position);
      const filepath = path.join(imagesDir, filename);
      
      // Pular se já existe
      if (fs.existsSync(filepath)) {
        console.log(`  ⏭️  Já existe: ${filename}`);
        image.imageUrl = `/products/${filename}`;
        downloadedImages++;
        continue;
      }
      
      try {
        console.log(`  ⬇️  Baixando: ${filename}`);
        await downloadImage(image.imageUrl, filepath);
        
        // Atualizar URL para local
        image.imageUrl = `/products/${filename}`;
        downloadedImages++;
        console.log(`  ✅ Sucesso: ${filename}`);
      } catch (error) {
        console.error(`  ❌ Erro ao baixar ${filename}:`, error.message);
        errors++;
      }
    }
  }
  
  // Salvar products.json atualizado
  const updatedPath = path.join(__dirname, '..', 'products-local.json');
  fs.writeFileSync(updatedPath, JSON.stringify(updatedProducts, null, 2), 'utf8');
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO:');
  console.log(`   Total de imagens: ${totalImages}`);
  console.log(`   ✅ Baixadas com sucesso: ${downloadedImages}`);
  console.log(`   ❌ Erros: ${errors}`);
  console.log(`   📁 Diretório: ${imagesDir}`);
  console.log(`   📄 JSON atualizado salvo em: products-local.json`);
  console.log('='.repeat(50));
  
  if (errors === 0) {
    console.log('\n✨ Todas as imagens foram baixadas com sucesso!');
    console.log('👉 Renomeie products-local.json para products.json para usar as imagens locais.');
  } else {
    console.log(`\n⚠️  ${errors} imagens falharam. Verifique os erros acima.`);
  }
}

main().catch(console.error);
