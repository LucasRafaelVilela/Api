# 📋 API Endpoints - Especificação Completa

Esta documentação detalha todos os endpoints que você deve implementar.

## 🏃‍♂️ Base URL
```
http://localhost:8000/api
```

## 📚 **Endpoints de Autores**

### 1. **GET** `/authors` - Listar Autores

**Parâmetros de Query (opcionais):**
- `q` - Buscar por nome do autor
- `page` - Página atual (padrão: 1)
- `per_page` - Itens por página (padrão: 15, máximo: 100)
- `sort` - Campo para ordenação (padrão: nome)

**Exemplo:**
```http
GET /api/authors?q=machado&page=1&per_page=10&sort=nome
```

**Resposta Esperada (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nome": "Machado de Assis",
      "bio": "Joaquim Maria Machado de Assis foi um escritor brasileiro...",
      "criado_em": "2024-01-01T10:00:00.000000Z",
      "atualizado_em": "2024-01-01T10:00:00.000000Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 1,
    "total_pages": 1
  },
  "links": {
    "self": "http://localhost:8000/api/authors?q=machado&page=1",
    "next": null,
    "prev": null
  }
}
```

### 2. **POST** `/authors` - Criar Autor

**Body (JSON):**
```json
{
  "nome": "Autor Teste",
  "bio": "Biografia do autor (opcional)"
}
```

**Resposta Esperada (201):**
```json
{
  "data": {
    "id": 11,
    "nome": "Autor Teste",
    "bio": "Biografia do autor",
    "criado_em": "2024-01-01T10:00:00.000000Z",
    "atualizado_em": "2024-01-01T10:00:00.000000Z"
  }
}
```

**Resposta de Erro (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "nome": ["O campo nome é obrigatório."]
  }
}
```

### 3. **GET** `/authors/{id}` - Buscar Autor

**Resposta Esperada (200):**
```json
{
  "data": {
    "id": 1,
    "nome": "Machado de Assis",
    "bio": "Biografia...",
    "criado_em": "2024-01-01T10:00:00.000000Z",
    "atualizado_em": "2024-01-01T10:00:00.000000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "message": "Autor não encontrado."
}
```

### 4. **PUT** `/authors/{id}` - Atualizar Autor

**Body (JSON):**
```json
{
  "nome": "Nome Atualizado",
  "bio": "Nova biografia"
}
```

**Resposta Esperada (200):**
```json
{
  "data": {
    "id": 1,
    "nome": "Nome Atualizado",
    "bio": "Nova biografia",
    "criado_em": "2024-01-01T10:00:00.000000Z",
    "atualizado_em": "2024-01-01T11:00:00.000000Z"
  }
}
```

### 5. **DELETE** `/authors/{id}` - Excluir Autor

**Resposta Esperada (204):** (Sem conteúdo)

**Resposta de Erro - Autor com Livros (409):**
```json
{
  "message": "Não é possível excluir autor que possui livros associados.",
  "status": 409
}
```

### 6. **GET** `/authors/{id}/books` - Livros do Autor

**Resposta Esperada (200):**
```json
{
  "data": [
    {
      "id": 1,
      "titulo": "Dom Casmurro",
      "autor_id": 1,
      "ano_publicacao": 1899,
      "paginas": 256,
      "genero": "Romance",
      "disponivel": true,
      "criado_em": "2024-01-01T10:00:00.000000Z",
      "atualizado_em": "2024-01-01T10:00:00.000000Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 15,
    "total": 3,
    "total_pages": 1
  }
}
```

## 📖 **Endpoints de Livros**

### 1. **GET** `/books` - Listar Livros

**Parâmetros de Query (opcionais):**
- `q` - Buscar por título ou gênero
- `author_id` - Filtrar por autor
- `disponivel` - Filtrar por disponibilidade (true/false)
- `ano_de` - Ano mínimo de publicação
- `ano_ate` - Ano máximo de publicação
- `page` - Página atual
- `per_page` - Itens por página
- `sort` - Campo para ordenação

**Exemplo:**
```http
GET /api/books?q=dom&disponivel=true&ano_de=1800&sort=ano_publicacao
```

### 2. **POST** `/books` - Criar Livro

**Body (JSON):**
```json
{
  "titulo": "Novo Livro",
  "autor_id": 1,
  "ano_publicacao": 2024,
  "paginas": 300,
  "genero": "Romance",
  "disponivel": true
}
```

**Resposta Esperada (201):**
```json
{
  "data": {
    "id": 23,
    "titulo": "Novo Livro",
    "autor_id": 1,
    "ano_publicacao": 2024,
    "paginas": 300,
    "genero": "Romance",
    "disponivel": true,
    "criado_em": "2024-01-01T10:00:00.000000Z",
    "atualizado_em": "2024-01-01T10:00:00.000000Z"
  }
}
```

**Resposta de Erro - Título Duplicado (409):**
```json
{
  "message": "Já existe um livro com este título para o mesmo autor.",
  "status": 409,
  "errors": {
    "titulo": ["Já existe um livro com este título para o mesmo autor."]
  }
}
```

### 3. **GET** `/books/{id}` - Buscar Livro

**Resposta Esperada (200):**
```json
{
  "data": {
    "id": 1,
    "titulo": "Dom Casmurro",
    "autor_id": 1,
    "autor": {
      "id": 1,
      "nome": "Machado de Assis"
    },
    "ano_publicacao": 1899,
    "paginas": 256,
    "genero": "Romance",
    "disponivel": true,
    "criado_em": "2024-01-01T10:00:00.000000Z",
    "atualizado_em": "2024-01-01T10:00:00.000000Z"
  }
}
```

### 4. **PUT** `/books/{id}` - Atualizar Livro

Mesmo formato do POST, todos os campos opcionais.

### 5. **DELETE** `/books/{id}` - Excluir Livro

**Resposta Esperada (204):** (Sem conteúdo)

## 🚨 **Status Codes HTTP**

| Status | Quando usar |
|--------|-------------|
| `200` | Sucesso em GET, PUT |
| `201` | Sucesso em POST (criação) |
| `204` | Sucesso em DELETE (sem conteúdo) |
| `404` | Recurso não encontrado |
| `409` | Conflito (regra de negócio violada) |
| `422` | Erro de validação |

## 🔍 **Filtros e Ordenação**

### **Campos de Ordenação Permitidos**

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

### **Filtros Especiais**

1. **Busca textual** (`q`): 
   - Autores: busca no campo `nome`
   - Livros: busca em `titulo` e `genero`

2. **Paginação**:
   - `per_page` máximo: 100
   - `per_page` padrão: 15
   - `page` mínimo: 1

3. **Normalização de parâmetros**:
   - `page` negativo → 1
   - `per_page` > 100 → 100
   - `per_page` < 1 → 15

## 💡 **Dicas de Implementação**

1. Use os **Scopes** nos Models para filtros
2. Use **Resources** para formatação de resposta
3. Use **Form Requests** para validação
4. Implemente paginação com `paginate()`
5. Use `with()` para eager loading quando necessário