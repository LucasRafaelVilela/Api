# 🛡️ Regras de Validação

Esta documentação detalha todas as validações que já estão implementadas nos Form Requests.

## 👤 **Validações de Autor**

### **StoreAuthorRequest** (Criar Autor)

```php
[
    'nome' => 'required|string|min:2|max:255',
    'bio' => 'nullable|string|max:1000',
]
```

### **UpdateAuthorRequest** (Atualizar Autor)

```php
[
    'nome' => 'sometimes|required|string|min:2|max:255',
    'bio' => 'nullable|string|max:1000',
]
```

### **Mensagens de Erro:**

| Campo | Regra | Mensagem |
|-------|-------|----------|
| `nome.required` | Campo obrigatório | "O campo nome é obrigatório." |
| `nome.string` | Deve ser texto | "O campo nome deve ser uma string." |
| `nome.min` | Mínimo 2 caracteres | "O nome deve ter pelo menos 2 caracteres." |
| `nome.max` | Máximo 255 caracteres | "O nome deve ter no máximo 255 caracteres." |
| `bio.string` | Deve ser texto | "O campo bio deve ser uma string." |
| `bio.max` | Máximo 1000 caracteres | "A biografia deve ter no máximo 1000 caracteres." |

## 📖 **Validações de Livro**

### **StoreBookRequest** (Criar Livro)

```php
[
    'titulo' => [
        'required',
        'string', 
        'min:2',
        'max:255',
        Rule::unique('books', 'titulo')->where('autor_id', $request->autor_id)
    ],
    'autor_id' => 'required|integer|exists:authors,id',
    'ano_publicacao' => 'nullable|integer|min:1450|max:2024', // Ano atual
    'paginas' => 'nullable|integer|min:1',
    'genero' => 'nullable|string|max:100',
    'disponivel' => 'nullable|boolean',
]
```

### **UpdateBookRequest** (Atualizar Livro)

Mesmas regras, mas com `sometimes` no `titulo` e `autor_id`, e ignorando o ID atual na validação de unicidade.

### **Mensagens de Erro:**

| Campo | Regra | Mensagem |
|-------|-------|----------|
| `titulo.required` | Campo obrigatório | "O campo titulo é obrigatório." |
| `titulo.string` | Deve ser texto | "O campo titulo deve ser uma string." |
| `titulo.min` | Mínimo 2 caracteres | "O título deve ter pelo menos 2 caracteres." |
| `titulo.max` | Máximo 255 caracteres | "O título deve ter no máximo 255 caracteres." |
| `titulo.unique` | Título único por autor | "Já existe um livro com este título para o mesmo autor." |
| `autor_id.required` | Campo obrigatório | "O campo autor_id é obrigatório." |
| `autor_id.integer` | Deve ser número | "O campo autor_id deve ser um número inteiro." |
| `autor_id.exists` | Autor deve existir | "O autor informado não existe." |
| `ano_publicacao.integer` | Deve ser número | "O ano de publicação deve ser um número inteiro." |
| `ano_publicacao.min` | Mínimo 1450 | "O ano de publicação deve ser no mínimo 1450." |
| `ano_publicacao.max` | Máximo ano atual | "O ano de publicação não pode ser futuro." |
| `paginas.integer` | Deve ser número | "O número de páginas deve ser um número inteiro." |
| `paginas.min` | Mínimo 1 página | "O número de páginas deve ser pelo menos 1." |
| `genero.string` | Deve ser texto | "O campo gênero deve ser uma string." |
| `genero.max` | Máximo 100 caracteres | "O gênero deve ter no máximo 100 caracteres." |
| `disponivel.boolean` | Deve ser true/false | "O campo disponível deve ser verdadeiro ou falso." |

## 🎯 **Casos de Teste de Validação**

O sistema de testes automatizados verifica os seguintes cenários:

### **✅ Testes de Autor**

1. **Nome obrigatório**: 
   - ❌ `{ "nome": "" }` → 422
   - ❌ `{ "bio": "Só bio" }` → 422

2. **Tamanho do nome**:
   - ❌ `{ "nome": "A" }` → 422 (muito curto)
   - ❌ `{ "nome": "A".repeat(256) }` → 422 (muito longo)

3. **Tamanho da bio**:
   - ❌ `{ "nome": "OK", "bio": "A".repeat(1001) }` → 422

4. **Tipos de dados**:
   - ❌ `{ "nome": 123, "bio": true }` → 422

5. **Payload vazio**:
   - ❌ `{}` → 422

### **✅ Testes de Livro**

1. **Campos obrigatórios**:
   - ❌ `{ "autor_id": 1 }` → 422 (sem título)
   - ❌ `{ "titulo": "Livro" }` → 422 (sem autor_id)

2. **Autor existente**:
   - ❌ `{ "titulo": "Livro", "autor_id": 99999 }` → 422

3. **Título único por autor**:
   - ❌ Criar livro com mesmo título para mesmo autor → 409

4. **Ano de publicação**:
   - ❌ `{ "ano_publicacao": 1300 }` → 422 (muito antigo)
   - ❌ `{ "ano_publicacao": 2030 }` → 422 (futuro)

5. **Páginas**:
   - ❌ `{ "paginas": 0 }` → 422 (deve ser pelo menos 1)
   - ❌ `{ "paginas": -5 }` → 422 (não pode ser negativo)

## 🚨 **Tratamento de Erros Especiais**

### **Conflito de Título (409)**

Quando um livro é criado com título que já existe para o mesmo autor:

```json
{
  "message": "Já existe um livro com este título para o mesmo autor.",
  "status": 409,
  "errors": {
    "titulo": ["Já existe um livro com este título para o mesmo autor."]
  }
}
```

Este erro é tratado automaticamente pelos Form Requests através do método `failedValidation()`.

## 💡 **Como usar nas Controllers**

### **Exemplo de uso:**

```php
public function store(StoreAuthorRequest $request)
{
    // Os dados já estão validados quando chegam aqui!
    $validatedData = $request->validated();
    
    $author = Author::create($validatedData);
    
    return response()->json([
        'data' => new AuthorResource($author)
    ], 201);
}
```

### **Validações automáticas:**

1. **Laravel automaticamente**:
   - Valida os dados usando as regras do Form Request
   - Retorna 422 com erros se inválido
   - Permite que o código continue apenas se válido

2. **Form Requests customizados**:
   - Convertem validação de unicidade em status 409
   - Formatam mensagens de erro em português
   - Normalizam tipos de dados automaticamente

## 🧪 **Testando Validações**

Use o frontend de testes para verificar se suas validações estão funcionando:

1. **Teste dados válidos** → Deve funcionar normalmente
2. **Teste dados inválidos** → Deve retornar 422 com mensagens em português
3. **Teste regras especiais** → Deve retornar status codes apropriados (409 para conflitos)