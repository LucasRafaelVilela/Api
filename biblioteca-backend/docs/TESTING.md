# 🧪 Como Testar sua Implementação

Esta documentação explica como testar se sua API está funcionando corretamente.

## 🚀 **Método 1: Frontend de Testes Automatizados (Recomendado)**

### **Localização**: `biblioteca-test-frontend/`

### **Como usar:**

1. **Navegue para a pasta do frontend**:
```bash
cd biblioteca-test-frontend
```

2. **Instale as dependências** (primeira vez):
```bash
npm install
```

3. **Inicie o servidor de testes**:
```bash
npm run dev
```

4. **Abra no navegador**: http://localhost:5173

### **Configuração:**

1. **Configure a URL da API**: http://localhost:8000
2. **Clique em "Iniciar Testes"**
3. **Acompanhe os resultados em tempo real**

### **O que o frontend testa:**

#### **📊 Testes de Autores (245 pontos)**

1. **Listagem** (45 pontos):
   - ✅ Estrutura de resposta paginada
   - ✅ Paginação funcionando
   - ✅ Busca por nome
   - ✅ Ordenação
   - ✅ Parâmetros extremos

2. **Criação** (85 pontos):
   - ✅ Criar autor válido
   - ✅ Validação nome obrigatório
   - ✅ Validação tamanho mínimo
   - ✅ Validação tamanho máximo (255 chars)
   - ✅ Validação bio muito longa (1000 chars)
   - ✅ Validação tipos incorretos
   - ✅ Validação payload vazio

3. **Busca Individual** (25 pontos):
   - ✅ Buscar autor existente
   - ✅ Retorno 404 para inexistente

4. **Atualização** (25 pontos):
   - ✅ Atualizar autor existente
   - ✅ Retorno 404 para inexistente

5. **Relacionamento** (15 pontos):
   - ✅ Listar livros do autor

6. **Regras de Negócio** (60 pontos):
   - ✅ Impedir exclusão de autor com livros (409)
   - ✅ Permitir exclusão após remover livros
   - ✅ Retorno 404 para exclusão de inexistente

7. **Exclusão Final** (15 pontos):
   - ✅ Cleanup dos testes

#### **📈 Sistema de Pontuação:**

- ✅ **PASS**: Pontuação total
- ❌ **FAIL**: 0 pontos
- 🔄 **Testes encadeados**: Cada teste depende do anterior

### **Interpretação dos Resultados:**

#### **✅ Resultado Positivo:**
```
✅ POST /api/authors
Criação de autor funcionando corretamente
20/20

📤 Dados Enviados: {"nome": "Autor Teste", "bio": "Biografia"}
📥 Resposta Recebida: {"data": {"id": 1, "nome": "Autor Teste", ...}}
💡 Resposta Esperada: {"id": "number", "nome": "Autor Teste", ...}
```

#### **❌ Resultado Negativo:**
```
❌ DELETE /api/authors/1
ERRO: Autor com livros foi excluído (viola regra de negócio)
0/20

📤 Dados Enviados: (DELETE request)
📥 Resposta Recebida: 204 No Content
💡 Resposta Esperada: {"status": 409, "message": "Não é possível..."}
🚨 Erro: O sistema deveria impedir a exclusão
```

## 🔧 **Método 2: Postman/Insomnia**

### **Collection de Testes** (será criada):

```bash
# Importar collection:
postman-collection.json
```

### **Testes Manuais Básicos:**

#### **1. Criar Autor**
```http
POST http://localhost:8000/api/authors
Content-Type: application/json

{
  "nome": "Machado de Assis",
  "bio": "Grande escritor brasileiro"
}
```

**Resposta esperada**: 201 Created

#### **2. Listar Autores**
```http
GET http://localhost:8000/api/authors
```

**Resposta esperada**: 200 OK com estrutura paginada

#### **3. Buscar Autor**
```http
GET http://localhost:8000/api/authors/1
```

#### **4. Criar Livro**
```http
POST http://localhost:8000/api/books
Content-Type: application/json

{
  "titulo": "Dom Casmurro",
  "autor_id": 1,
  "ano_publicacao": 1899,
  "paginas": 256,
  "genero": "Romance"
}
```

#### **5. Testar Regra de Negócio**
```http
DELETE http://localhost:8000/api/authors/1
```

**Resposta esperada**: 409 Conflict (autor tem livros)

## 🛠️ **Método 3: Testes Unitários com PHPUnit**

### **Criar testes** (opcional, para alunos avançados):

```bash
php artisan make:test AuthorControllerTest
php artisan make:test BookControllerTest
```

### **Exemplo de teste:**

```php
<?php

namespace Tests\Feature;

use App\Models\Author;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthorControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_author()
    {
        $response = $this->postJson('/api/authors', [
            'nome' => 'Autor Teste',
            'bio' => 'Biografia'
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => ['id', 'nome', 'bio', 'criado_em', 'atualizado_em']
                 ]);
    }

    public function test_cannot_delete_author_with_books()
    {
        $author = Author::factory()->create();
        $author->books()->create([
            'titulo' => 'Livro Teste',
            'ano_publicacao' => 2024
        ]);

        $response = $this->deleteJson("/api/authors/{$author->id}");

        $response->assertStatus(409);
    }
}
```

### **Executar testes:**
```bash
php artisan test
```

## 📊 **Checklist de Testes Manual**

### **✅ Testes Obrigatórios**

#### **Autores:**
- [ ] GET /api/authors (com paginação)
- [ ] GET /api/authors?q=machado (busca)
- [ ] POST /api/authors (dados válidos)
- [ ] POST /api/authors (nome vazio → 422)
- [ ] GET /api/authors/1 (existente)
- [ ] GET /api/authors/99999 (404)
- [ ] PUT /api/authors/1 (atualizar)
- [ ] DELETE /api/authors/1 (com livros → 409)
- [ ] GET /api/authors/1/books

#### **Livros:**
- [ ] GET /api/books (com filtros)
- [ ] POST /api/books (dados válidos)
- [ ] POST /api/books (título duplicado → 409)
- [ ] POST /api/books (autor inexistente → 422)
- [ ] GET /api/books/1 (com dados do autor)
- [ ] PUT /api/books/1
- [ ] DELETE /api/books/1

### **🎯 Cenários Críticos**

1. **Sequência de Regra de Negócio:**
   ```
   1. POST /api/authors → Criar autor
   2. POST /api/books → Criar livro para o autor
   3. DELETE /api/authors/{id} → Deve retornar 409
   4. DELETE /api/books/{id} → Excluir livro
   5. DELETE /api/authors/{id} → Deve retornar 204
   ```

2. **Validações Edge Cases:**
   ```
   1. Nome com 1 caractere → 422
   2. Nome com 256 caracteres → 422  
   3. Bio com 1001 caracteres → 422
   4. Ano futuro → 422
   5. Payload vazio → 422
   ```

## 📈 **Métricas de Sucesso**

### **🎯 Meta mínima (70%):**
- ✅ Todos endpoints básicos funcionando
- ✅ Validações principais (422)
- ✅ Status codes corretos (200, 201, 404)

### **🚀 Meta avançada (90%):**
- ✅ Todas as validações (edge cases)
- ✅ Regras de negócio (409 Conflict)
- ✅ Filtros e paginação
- ✅ Performance (eager loading)

### **🏆 Meta excelente (100%):**
- ✅ Todos os testes automatizados passando
- ✅ Código bem estruturado
- ✅ Mensagens de erro em português
- ✅ Documentação da API

## 🐞 **Debugging**

### **Logs do Laravel:**
```bash
tail -f storage/logs/laravel.log
```

### **Debug de SQL:**
```php
// No Controller, temporariamente:
DB::enableQueryLog();
// ... suas queries ...
dd(DB::getQueryLog());
```

### **Verificar rotas:**
```bash
php artisan route:list --path=api
```

### **Erros comuns:**

1. **404 nas rotas**: Verifique `routes/api.php`
2. **422 sempre**: Verifique Form Requests
3. **500 Internal**: Consulte `storage/logs/laravel.log`
4. **CORS**: Configure `config/cors.php`

## 💡 **Dicas de Teste**

1. **Teste incrementalmente**: Um endpoint por vez
2. **Use dados realistas**: Nomes de autores reais
3. **Teste casos extremos**: Dados inválidos, limites
4. **Verifique estrutura JSON**: Use o frontend automatizado
5. **Monitore logs**: Para debuggar erros 500