#!/bin/bash

echo "========================================"
echo "Deploy no Servidor - Branch Main"
echo "========================================"
echo ""

echo "[1/6] Navegando para o diretório..."
cd /var/www/obomvelhinho

echo ""
echo "[2/6] Fazendo pull do branch main..."
git pull origin main

echo ""
echo "[3/6] Verificando .env.local..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local não existe. Criando..."
    cp .env.example .env.local
    echo "✅ .env.local criado. EDITE COM AS CREDENCIAIS REAIS!"
    echo "   Execute: nano .env.local"
    echo ""
    read -p "Pressione ENTER após editar o .env.local..."
else
    echo "✅ .env.local já existe"
fi

echo ""
echo "[4/6] Instalando dependências (se necessário)..."
npm install

echo ""
echo "[5/6] Fazendo build..."
npm run build

echo ""
echo "[6/6] Reiniciando aplicação..."
pm2 restart obomvelhinho

echo ""
echo "========================================"
echo "✅ Deploy concluído no branch main!"
echo "========================================"
echo ""
echo "Verificar logs:"
echo "  pm2 logs obomvelhinho --lines 50"
echo ""
echo "Testar site:"
echo "  curl https://obomvelhinho.store"
echo ""
