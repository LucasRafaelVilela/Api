@echo off
echo ========================================
echo  🚀 Setup da API Biblioteca - Windows
echo ========================================
echo.

echo ✅ Verificando dependências...
where composer >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Composer não encontrado. Instale em: https://getcomposer.org/
    pause
    exit /b 1
)

where php >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PHP não encontrado. Instale PHP 8.1+ ou use XAMPP
    pause
    exit /b 1
)

echo ✅ Verificando se está na pasta correta...
if not exist "app\Http\Controllers" (
    echo ❌ Execute este script na raiz do projeto Laravel
    echo    Exemplo: C:\meu-projeto\biblioteca-api\
    pause
    exit /b 1
)

echo.
echo ✅ Configurando banco de dados SQLite...
if not exist "database" mkdir database
echo. > database\database.sqlite

echo ✅ Configurando arquivo .env...
if not exist ".env" (
    copy .env.example .env
)

echo ✅ Atualizando configurações no .env...
powershell -Command "(Get-Content .env) -replace '^DB_CONNECTION=.*', 'DB_CONNECTION=sqlite' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_DATABASE=.*', 'DB_DATABASE=%cd%\database\database.sqlite' | Set-Content .env"

echo ✅ Instalando dependências do Laravel...
composer install --no-dev --optimize-autoloader

echo ✅ Gerando chave da aplicação...
php artisan key:generate

echo ✅ Executando migrações...
php artisan migrate --force

echo ✅ Executando seeders...
php artisan db:seed --force

echo ✅ Limpando cache...
php artisan config:clear
php artisan cache:clear

echo.
echo ========================================
echo ✅ Setup concluído com sucesso!
echo ========================================
echo.
echo 📋 Próximos passos:
echo 1. Implemente os Controllers em app\Http\Controllers\
echo 2. Configure as rotas em routes\api.php
echo 3. Inicie o servidor: php artisan serve
echo 4. Teste com o frontend: http://localhost:5173
echo.
echo 📚 Documentação em: docs\
echo 🧪 Frontend de testes: ..\biblioteca-test-frontend\
echo.
pause