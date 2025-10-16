import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const IMAGE_DIRS = ['public/products', 'public'];
const MAX_WIDTH = 1200; // Largura máxima
const MAX_HEIGHT = 1200; // Altura máxima
const QUALITY = 80; // Qualidade (0-100)

async function optimizeImage(filePath) {
  try {
    const stats = statSync(filePath);
    const originalSize = stats.size;

    const image = sharp(filePath);
    const metadata = await image.metadata();

    console.log(`\n📸 Otimizando: ${filePath}`);
    console.log(`   Tamanho original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Dimensões: ${metadata.width}x${metadata.height}`);

    // Configurar otimização baseado no formato
    let optimized = image;

    // Redimensionar se necessário
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      optimized = optimized.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      });
      console.log(`   ✂️ Redimensionando para max ${MAX_WIDTH}x${MAX_HEIGHT}`);
    }

    // Aplicar compressão baseado no formato
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      optimized = optimized.jpeg({ quality: QUALITY, progressive: true });
    } else if (metadata.format === 'png') {
      optimized = optimized.png({ quality: QUALITY, compressionLevel: 9 });
    } else if (metadata.format === 'webp') {
      optimized = optimized.webp({ quality: QUALITY });
    } else {
      console.log(`   ⏭️ Formato ${metadata.format} não suportado, pulando...`);
      return;
    }

    // Salvar imagem otimizada
    await optimized.toFile(filePath + '.tmp');

    // Verificar novo tamanho
    const newStats = statSync(filePath + '.tmp');
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);

    console.log(`   Tamanho novo: ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`   ✅ Redução: ${reduction}%`);

    // Substituir apenas se realmente reduziu
    if (newSize < originalSize) {
      const fs = await import('fs');
      fs.unlinkSync(filePath);
      fs.renameSync(filePath + '.tmp', filePath);
    } else {
      const fs = await import('fs');
      fs.unlinkSync(filePath + '.tmp');
      console.log(`   ⏭️ Não houve redução, mantendo original`);
    }
  } catch (error) {
    console.error(`❌ Erro ao otimizar ${filePath}:`, error.message);
  }
}

async function scanDirectory(dirPath) {
  try {
    const items = readdirSync(dirPath);

    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        // Recursivo em subdiretórios
        await scanDirectory(fullPath);
      } else if (stats.isFile()) {
        // Processar apenas imagens
        const ext = item.toLowerCase().split('.').pop();
        if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
          await optimizeImage(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao escanear ${dirPath}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando otimização de imagens...\n');
  console.log(`📋 Configurações:`);
  console.log(`   - Largura máxima: ${MAX_WIDTH}px`);
  console.log(`   - Altura máxima: ${MAX_HEIGHT}px`);
  console.log(`   - Qualidade: ${QUALITY}%`);

  for (const dir of IMAGE_DIRS) {
    console.log(`\n📁 Processando diretório: ${dir}`);
    await scanDirectory(dir);
  }

  console.log('\n✅ Otimização concluída!');
}

main();
