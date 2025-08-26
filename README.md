# 📚 API Biblioteca - Starter Kit para Alunos

Este starter kit contém todos os componentes necessários para que você foque apenas na implementação dos **Controllers** e **Rotas** da API de gerenciamento de biblioteca.

## 🎯 Objetivo

Implementar uma API RESTful completa com:
- ✅ **CRUD de Autores** (Create, Read, Update, Delete)
- ✅ **CRUD de Livros** (Create, Read, Update, Delete)
- ✅ **Relacionamento** entre autores e livros
- ✅ **Validações** robustas
- ✅ **Regras de negócio** (ex: não excluir autor com livros)
- ✅ **Paginação e filtros**

## 🚀 Configuração Rápida

### 1. Criar novo projeto Laravel
```bash
composer create-project laravel/laravel biblioteca-backend "9.*"
cd biblioteca-backend
```

### 2. Copiar arquivos do starter kit
Copie todos os arquivos desta pasta para o projeto Laravel:

```bash
# Copie as pastas:
app/Models/          → app/Models/
app/Http/Requests/   → app/Http/Requests/
app/Http/Resources/  → app/Http/Resources/
database/migrations/ → database/migrations/
database/seeders/    → database/seeders/
database/factories/  → database/factories/
```

### 3. Configurar banco de dados
No arquivo `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=biblioteca_api
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Executar migrações e seeds
```bash
php artisan migrate
php artisan db:seed
```

### 5. Iniciar servidor
```bash
php artisan serve
```

## 📊 Endpoints Esperados

### **Autores**
- `GET /api/authors` - Listar autores (com paginação)
- `POST /api/authors` - Criar autor
- `GET /api/authors/{id}` - Buscar autor
- `PUT /api/authors/{id}` - Atualizar autor
- `DELETE /api/authors/{id}` - Excluir autor
- `GET /api/authors/{id}/books` - Livros do autor

### **Livros**
- `GET /api/books` - Listar livros (com filtros)
- `POST /api/books` - Criar livro
- `GET /api/books/{id}` - Buscar livro
- `PUT /api/books/{id}` - Atualizar livro
- `DELETE /api/books/{id}` - Excluir livro

## ✅ O que já está pronto

### 🏗️ **Database**
- ✅ Migrations para `authors` e `books`
- ✅ Seeders com dados de exemplo
- ✅ Factories para testes

### 📝 **Models**
- ✅ `Author` com relacionamentos e scopes
- ✅ `Book` com relacionamentos e scopes

### 🛡️ **Validações**
- ✅ `StoreAuthorRequest` / `UpdateAuthorRequest`
- ✅ `StoreBookRequest` / `UpdateBookRequest`

### 🎨 **Formatação JSON**
- ✅ `AuthorResource` - Format response de autor
- ✅ `BookResource` - Format response de livro
- ✅ `PaginatedResource` - Format response paginado

## 🧪 Testando sua implementação

1. **Frontend de Testes**: Use o projeto `biblioteca-test-frontend`
2. **Postman/Insomnia**: Importe a collection (arquivo será criado)
3. **PHP Unit**: Execute `php artisan test` (testes serão adicionados)

## 📚 Documentação Adicional

- [`docs/API_ENDPOINTS.md`](docs/API_ENDPOINTS.md) - Especificação detalhada da API
- [`docs/VALIDATION_RULES.md`](docs/VALIDATION_RULES.md) - Regras de validação
- [`docs/BUSINESS_RULES.md`](docs/BUSINESS_RULES.md) - Regras de negócio
- [`docs/TESTING.md`](docs/TESTING.md) - Como testar sua implementação

## 🆘 Dúvidas?

1. Consulte a documentação na pasta `docs/`
2. Veja os exemplos nos Models (como usar scopes)
3. Analise as validações nos Form Requests
4. Use o frontend de testes para verificar se está funcionando

## 🎓 Critérios de Avaliação

- ✅ **Funcionalidade**: Todos os endpoints funcionando
- ✅ **Validações**: Usando Form Requests corretamente
- ✅ **Regras de negócio**: Implementadas corretamente
- ✅ **Formatação**: Usando Resources para JSON
- ✅ **Status codes**: HTTP status codes corretos
- ✅ **Paginação**: Implementada nos endpoints de listagem

**Boa sorte! 🚀**
