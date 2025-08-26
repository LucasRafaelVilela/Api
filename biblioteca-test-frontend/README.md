# 🧪 Testador de API Biblioteca - Frontend

Sistema de avaliação automática para APIs Laravel que implementam o sistema de biblioteca conforme especificação `API_Biblioteca_Basica.md`.

## 📋 Sobre o Projeto

Este frontend React permite testar automaticamente APIs Laravel, validando:

- **Endpoints de Autores** (0.8 pontos)
  - CRUD completo com validações
  - Regras de negócio (não excluir com livros)
  - Paginação, busca e ordenação

- **Endpoints de Livros** (0.8 pontos)
  - CRUD completo com validações
  - Regra de duplicidade título+autor
  - Filtros avançados (autor, disponibilidade, anos)

- **Estrutura e Validações** (0.4 pontos)
  - Códigos HTTP corretos
  - Estrutura JSON padronizada
  - Validações conforme especificação

**Pontuação Final:** 0 a 2 pontos baseada na conformidade com a especificação.

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar em Desenvolvimento
```bash
npm run dev
```

### 3. Compilar para Produção
```bash
npm run build
```

### 4. Testar sua API
1. Certifique-se de que sua API Laravel está rodando
2. Acesse o frontend no navegador
3. Insira a URL da sua API (ex: `http://localhost:8000`)
4. Clique em "Executar Testes"
5. Aguarde a execução e veja o relatório final

## 📊 Sistema de Avaliação

### Critérios de Pontuação:
- **Funcionalidade Básica (50%):** Endpoints funcionando
- **Validações (30%):** Campos obrigatórios e regras
- **Regras de Negócio (20%):** Duplicidade, exclusões

### Notas:
- **1.7 - 2.0:** Excelente implementação ✨
- **1.0 - 1.6:** Boa implementação 👍
- **0.5 - 0.9:** Implementação parcial ⚠️
- **0.0 - 0.4:** Necessita melhorias 🚨

## 🔧 Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Axios** para requisições HTTP
- **CSS Modules** para estilização

## 📝 Estrutura de Testes

### Autores:
- ✅ GET `/api/authors` - Listagem com paginação
- ✅ POST `/api/authors` - Criação com validações
- ✅ GET `/api/authors/{id}` - Busca individual
- ✅ PUT `/api/authors/{id}` - Atualização
- ✅ DELETE `/api/authors/{id}` - Exclusão com regra
- ✅ GET `/api/authors/{id}/books` - Livros do autor

### Livros:
- ✅ GET `/api/books` - Listagem com filtros
- ✅ POST `/api/books` - Criação com validações
- ✅ GET `/api/books/{id}` - Busca individual
- ✅ PUT `/api/books/{id}` - Atualização
- ✅ DELETE `/api/books/{id}` - Exclusão

## 📄 Relatórios

O sistema gera relatórios detalhados com:
- Nota final (0-2 pontos)
- Estatísticas de aprovação
- Detalhes de cada teste
- Sugestões de melhoria
- Opção de download em formato texto

## 🎯 Para Professores

Este sistema automatiza a correção de APIs Laravel, fornecendo:
- Avaliação objetiva e padronizada
- Feedback detalhado para alunos
- Relatórios exportáveis
- Interface intuitiva para uso em sala

## 🔗 API Esperada

A API deve seguir exatamente a especificação do arquivo `API_Biblioteca_Basica.md`, incluindo:
- Estrutura de resposta JSON
- Códigos de status HTTP
- Validações de campos
- Regras de negócio específicas

## 📞 Suporte

Para dúvidas sobre o testador ou especificação da API, consulte:
- Arquivo `API_Biblioteca_Basica.md`
- Código fonte dos testes em `/src/services/`
