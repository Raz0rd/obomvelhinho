@echo off
echo ========================================
echo Deploy - Branch domain-com
echo ========================================
echo.

echo [1/4] Mudando para branch domain-com...
git checkout domain-com

echo.
echo [2/4] Fazendo merge do main...
git merge main

echo.
echo [3/4] Fazendo push para origin domain-com...
git push origin domain-com

echo.
echo [4/4] Voltando para branch main...
git checkout main

echo.
echo ========================================
echo Concluido! Branch domain-com atualizado
echo ========================================
echo.
echo Proximo passo: Deploy no servidor (se tiver deploy separado)
echo.
echo Execute no servidor:
echo   cd /var/www/obomvelhinho-domain-com
echo   git pull origin domain-com
echo   npm run build
echo   pm2 restart obomvelhinho-domain-com
echo.
pause
