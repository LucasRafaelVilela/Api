# 🏢 Regras de Negócio

Esta documentação detalha as regras de negócio que devem ser implementadas na API.

## 👤 **Regras para Autores**

### 1. **Exclusão de Autores**

**❌ Não é possível excluir autor que possui livros associados**

- **Quando**: Tentar excluir autor via `DELETE /api/authors/{id}`
- **Condição**: Autor tem 1 ou mais livros na tabela `books`
- **Resposta esperada**: Status `409 Conflict`
- **Implementação sugerida**:

### 2. **Busca e Filtros**

**✅ Busca por nome do autor**

- **Parâmetro**: `?q=nome`
- **Comportamento**: Busca parcial (LIKE %termo%)
- **Case sensitive**: Não
- **Implementação**: Use o scope `search()` no Model

## 📖 **Regras para Livros**

### 1. **Unicidade de Títulos**

**❌ Não é possível criar livros com mesmo título para o mesmo autor**

- **Validação**: Já implementada no `StoreBookRequest`
- **Resposta**: Status `409 Conflict` (tratado automaticamente)
- **Exemplo**:

### 2. **Relacionamento com Autor**

**✅ Todo livro deve ter um autor válido**

- **Validação**: `autor_id|exists:authors,id`
- **Comportamento**: Se autor não existir → 422 Unprocessable Entity
- **Constraint no banco**: Foreign key com `onDelete('restrict')`

### 3. **Filtros Avançados**

**✅ Sistema de filtros múltiplos**

**Filtros disponíveis:**
- `q` - Busca em título e gênero
- `author_id` - Livros de um autor específico
- `disponivel` - true/false para disponibilidade
- `ano_de` - Ano mínimo de publicação
- `ano_ate` - Ano máximo de publicação

## 🔄 **Regras de Relacionamento**

### 1. **Autor → Livros (1:N)**

```php
// Um autor pode ter vários livros
$author = Author::with('books')->find(1);
$books = $author->books; // Collection de livros

// Contagem de livros
$totalBooks = $author->books()->count();
```

### 2. **Livro → Autor (N:1)**

```php
// Todo livro pertence a um autor
$book = Book::with('author')->find(1);
$authorName = $book->author->nome;

// Usando o accessor (já implementado)
$authorData = $book->autor; // { id: 1, nome: "Nome" }
```

## 🎯 **Regras de Negócio Específicas**

### 1. **Status de Disponibilidade**

**✅ Controle de disponibilidade de livros**

- **Campo**: `disponivel` (boolean)
- **Padrão**: `true` (disponível)
- **Uso**: Biblioteca pode marcar livros como emprestados
- **Filtro**: `?disponivel=true` ou `?disponivel=false`

### 2. **Paginação e Performance**

**✅ Limites de paginação**

- **Padrão**: 15 itens por página
- **Máximo**: 100 itens por página
- **Mínimo**: 1 item por página
- **Normalização automática**: Valores inválidos são corrigidos

```php
// Normalização sugerida:
$perPage = max(1, min(100, $request->per_page ?? 15));
$page = max(1, $request->page ?? 1);
```

### 3. **Ordenação**

**✅ Campos permitidos para ordenação**

**Autores:**
- `nome` (padrão)
- `created_at`
- `updated_at`

**Livros:**
- `titulo` (padrão)
- `ano_publicacao`
- `paginas`
- `created_at`
- `updated_at`

## 🧪 **Testes de Regras de Negócio**

O sistema de testes automatizados verifica:

### **Teste: Exclusão de Autor com Livros**

1. ✅ Criar autor
2. ✅ Criar livro para o autor
3. ❌ Tentar excluir autor → Deve retornar 409
4. ✅ Excluir livro primeiro
5. ✅ Excluir autor → Deve retornar 200

### **Teste: Título Duplicado**

1. ✅ Criar livro "Dom Casmurro" para autor 1
2. ❌ Tentar criar outro "Dom Casmurro" para autor 1 → 409
3. ✅ Criar "Dom Casmurro" para autor 2 → 201 (OK, autor diferente)

### **Teste: Filtros Combinados**

1. ✅ `?q=romance&disponivel=true&ano_de=1800&ano_ate=1900`
2. ✅ Verificar se apenas livros que atendem TODOS os critérios são retornados

## 🎓 **Critérios de Avaliação**

- ✅ **Integridade referencial**: Não excluir autor com livros
- ✅ **Validações de unicidade**: Título único por autor
- ✅ **Filtros funcionais**: Todos os filtros implementados
- ✅ **Performance**: Uso de eager loading e paginação
- ✅ **Status codes**: Códigos HTTP corretos para cada situação
