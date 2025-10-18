@echo off
echo ========================================
echo Deploy - Conversoes Google Ads + Utmify
echo ========================================
echo.

echo [1/4] Adicionando arquivos modificados...
git add components/PixPayment.tsx
git add app/checkout/page.tsx
git add app/sucesso/page.tsx
git add components/Analytics.tsx
git add app/api/pedidos/atualizar-status/route.ts
git add .env.example
git add CONVERSOES_CORRIGIDAS.md
git add DEPLOY_INSTRUCOES.md
git add COMMIT_COMMANDS.bat

echo.
echo [2/4] Fazendo commit...
git commit -m "fix: Disparar conversoes Google Ads + Utmify no modal PIX quando pagamento confirmado" -m "- Conversoes agora disparam imediatamente quando Umbrela confirma PAID" -m "- Remove GA4 e Meta Pixel (nao usados)" -m "- Evita perda de conversoes se usuario fechar modal" -m "- Remove duplicacao de evento Utmify" -m "- Adiciona logs detalhados para debug" -m "- Polling direto da Umbrela a cada 5s (tempo real)"

echo.
echo [3/4] Fazendo push para origin main...
git push origin main

echo.
echo [4/4] Concluido!
echo.
echo ========================================
echo Proximo passo: Deploy no servidor Linux
echo ========================================
echo.
echo Execute no servidor:
echo   cd /var/www/obomvelhinho
echo   git pull origin main
echo   cp .env.example .env.local
echo   nano .env.local
echo   npm run build
echo   pm2 restart obomvelhinho
echo.
pause
