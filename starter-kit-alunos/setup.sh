#!/bin/bash

echo "========================================"
echo " 🚀 Setup da API Biblioteca - Linux/Mac"
echo "========================================"
echo ""

echo "✅ Verificando dependências..."

# Verificar Composer
if ! command -v composer &> /dev/null; then
    echo "❌ Composer não encontrado. Instale em: https://getcomposer.org/"
    exit 1
fi

# Verificar PHP
if ! command -v php &> /dev/null; then
    echo "❌ PHP não encontrado. Instale PHP 8.1+"
    exit 1
fi

echo "✅ Verificando se está na pasta correta..."
if [ ! -d "app/Http/Controllers" ]; then
    echo "❌ Execute este script na raiz do projeto Laravel"
    echo "   Exemplo: ~/meu-projeto/biblioteca-api/"
    exit 1
fi

echo ""
echo "✅ Configurando banco de dados SQLite..."
mkdir -p database
touch database/database.sqlite

echo "✅ Configurando arquivo .env..."
if [ ! -f ".env" ]; then
    cp .env.example .env
fi

echo "✅ Atualizando configurações no .env..."
sed -i.bak 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
sed -i.bak 's|^DB_DATABASE=.*|DB_DATABASE='$(pwd)'/database/database.sqlite|' .env

echo "✅ Instalando dependências do Laravel..."
composer install --no-dev --optimize-autoloader

echo "✅ Gerando chave da aplicação..."
php artisan key:generate

echo "✅ Executando migrações..."
php artisan migrate --force

echo "✅ Executando seeders..."
php artisan db:seed --force

echo "✅ Limpando cache..."
php artisan config:clear
php artisan cache:clear

echo ""
echo "========================================"
echo "✅ Setup concluído com sucesso!"
echo "========================================"
echo ""
echo "📋 Próximos passos:"
echo "1. Implemente os Controllers em app/Http/Controllers/"
echo "2. Configure as rotas em routes/api.php"
echo "3. Inicie o servidor: php artisan serve"
echo "4. Teste com o frontend: http://localhost:5173"
echo ""
echo "📚 Documentação em: docs/"
echo "🧪 Frontend de testes: ../biblioteca-test-frontend/"
echo ""