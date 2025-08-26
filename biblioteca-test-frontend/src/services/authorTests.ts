import { ApiClient } from './apiClient';
import type { TestResult } from '../types/api';

export class AuthorTests {
  private client: ApiClient;
  private testResults: TestResult[] = [];
  private testAuthorId: number | null = null;

  constructor(client: ApiClient) {
    this.client = client;
  }

  async runAllTests(): Promise<TestResult[]> {
    this.testResults = [];
    
    try {
      await this.testListAuthors();
      await this.testCreateAuthor();
      await this.testGetAuthor();
      await this.testUpdateAuthor();
      await this.testAuthorBooks();
      await this.testBusinessRules();
      await this.testDeleteAuthor();
    } catch (error) {
      console.error('Erro durante execução dos testes de autores:', error);
    }

    return this.testResults;
  }

  private addResult(result: TestResult) {
    this.testResults.push(result);
  }

  /**
   * Diagnóstica problemas específicos de endpoints
   */
  private diagnoseEndpointError(error: any, method: string, endpoint: string): { title: string; details: string } {
    const status = error.response?.status;
    const errorMessage = error.message?.toLowerCase() || '';

    if (status === 404) {
      return {
        title: `Rota ${method} ${endpoint} não encontrada (404)`,
        details: `A rota não está configurada no Laravel.

SOLUÇÕES:
1. Verifique se existe a rota em routes/api.php
2. Confirme se o Controller está importado
3. Execute: php artisan route:list | grep authors
4. Verifique se o método existe no AuthorController

ESPERADO: Rota ${method} ${endpoint} configurada e funcionando`
      };
    }

    if (status === 500) {
      return {
        title: `Erro interno no endpoint ${endpoint} (500)`,
        details: `O endpoint existe mas tem erro interno.

SOLUÇÕES:
1. Verifique logs: storage/logs/laravel.log
2. Confirme se o banco está configurado
3. Execute: php artisan migrate
4. Verifique se o AuthorController não tem erros
5. Teste o endpoint manualmente: http://localhost:8000${endpoint}

POSSÍVEIS CAUSAS: Erro no Controller, banco não configurado, dependências faltando`
      };
    }

    if (status === 405) {
      return {
        title: `Método ${method} não permitido para ${endpoint} (405)`,
        details: `A rota existe mas não aceita o método HTTP usado.

SOLUÇÕES:
1. Verifique se a rota está configurada para ${method}
2. Confirme em routes/api.php: Route::${method.toLowerCase()}('${endpoint}', ...)
3. Execute: php artisan route:list para ver métodos permitidos

ESPERADO: Rota deve aceitar ${method} ${endpoint}`
      };
    }

    if (errorMessage.includes('econnrefused')) {
      return {
        title: 'Servidor Laravel não está rodando',
        details: `Não conseguiu conectar com o servidor.

SOLUÇÕES:
1. Execute: php artisan serve
2. Verifique se a porta 8000 não está em uso
3. Confirme se não há erros no terminal do Laravel
4. Teste acessar http://localhost:8000 no navegador

ERRO DE REDE: ${error.message}`
      };
    }

    return {
      title: `Erro no endpoint ${method} ${endpoint}`,
      details: `Problema não identificado ao acessar o endpoint.

ERRO TÉCNICO: ${error.message}
STATUS HTTP: ${status || 'não recebido'}

SOLUÇÕES GERAIS:
1. Verifique se o Laravel está rodando
2. Confirme se as rotas estão configuradas
3. Teste o endpoint manualmente no navegador/Postman
4. Verifique logs do Laravel para erros internos`
    };
  }

  private async testListAuthors() {
    // Teste 1: Listar autores (paginação básica)
    try {
      const response = await this.client.getAuthors();
      
      if (response.status === 200) {
        const data = response.data;
        
        // Verifica se é um array de autores
        if (Array.isArray(data)) {
          this.addResult({
            endpoint: '/api/authors',
            method: 'GET',
            status: 'pass',
            score: 15,
            maxScore: 15,
            message: 'Listagem básica funcionando corretamente',
            response: data
          });
        } else {
          this.addResult({
            endpoint: '/api/authors',
            method: 'GET',
            status: 'fail',
            score: 0,
            maxScore: 15,
            message: 'Estrutura de resposta incorreta (esperado: array de autores)',
            response: data,
            expected: [
              {
                id: "number",
                nome: "string",
                bio: "string|null",
                criado_em: "timestamp",
                atualizado_em: "timestamp"
              }
            ]
          });
        }
      } else {
        this.addResult({
          endpoint: '/api/authors',
          method: 'GET',
          status: 'fail',
          score: 0,
          maxScore: 15,
          message: `Status HTTP incorreto: ${response.status} (esperado: 200)`,
          response: response.data,
          expected: 'Status HTTP: 200 (OK) com estrutura JSON válida'
        });
      }
    } catch (error: any) {
      const problemDetails = this.diagnoseEndpointError(error, 'GET', '/api/authors');
      this.addResult({
        endpoint: '/api/authors',
        method: 'GET',
        status: 'fail',
        score: 0,
        maxScore: 15,
        message: problemDetails.title,
        details: problemDetails.details,
        error: error.message
      });
    }

    // Teste 2: Verificar se contém campos obrigatórios
    try {
      const response = await this.client.getAuthors();
      
      if (response.status === 200 && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          const author = response.data[0];
          if (author.id && author.nome) {
            this.addResult({
              endpoint: '/api/authors',
              method: 'GET',
              status: 'pass',
              score: 10,
              maxScore: 10,
              message: 'Estrutura de autor contém campos obrigatórios',
              response: { sample: author }
            });
          } else {
            this.addResult({
              endpoint: '/api/authors',
              method: 'GET',
              status: 'fail',
              score: 0,
              maxScore: 10,
              message: 'Estrutura de autor faltando campos obrigatórios (id, nome)',
              response: { sample: author }
            });
          }
        } else {
          this.addResult({
            endpoint: '/api/authors',
            method: 'GET',
            status: 'pass',
            score: 10,
            maxScore: 10,
            message: 'Lista vazia retornada corretamente'
          });
        }
      }
    } catch (error: any) {
      this.addResult({
        endpoint: '/api/authors',
        method: 'GET',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Erro ao verificar estrutura de autores',
        error: error.message
      });
    }
  }

  private async testCreateAuthor() {
    // Teste 1: Criar autor válido
    try {
      const authorData = {
        nome: 'Autor Teste ' + Date.now(),
        bio: 'Biografia de teste'
      };
      
      const response = await this.client.createAuthor(authorData);
      
      if (response.status === 201) {
        const author = response.data.data || response.data;
        if (author.id && author.nome === authorData.nome) {
          this.addResult({
            endpoint: '/api/authors',
            method: 'POST',
            status: 'pass',
            score: 20,
            maxScore: 20,
            message: 'Criação de autor funcionando corretamente',
            request: authorData,
            response: author
          });
          
          // Armazena ID para usar em outros testes
          this.testAuthorId = author.id;
        } else {
          this.addResult({
            endpoint: '/api/authors',
            method: 'POST',
            status: 'fail',
            score: 0,
            maxScore: 20,
            message: 'Autor criado mas estrutura de resposta incorreta',
            request: authorData,
            response: response.data,
            expected: {
              id: "number",
              nome: authorData.nome,
              bio: authorData.bio,
              criado_em: "timestamp",
              atualizado_em: "timestamp"
            }
          });
        }
      } else {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'fail',
          score: 0,
          maxScore: 20,
          message: `Status HTTP incorreto: ${response.status} (esperado: 201)`,
          request: authorData,
          response: response.data,
          expected: 'Status HTTP: 201 (Created) com dados do autor criado'
        });
      }
    } catch (error: any) {
      this.addResult({
        endpoint: '/api/authors',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 20,
        message: 'Erro ao criar autor',
        error: error.message
      });
    }

    // Teste 2: Validação nome obrigatório
    try {
      await this.client.createAuthor({ nome: '' });
      
      this.addResult({
        endpoint: '/api/authors',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 15,
        message: 'Validação falhou: nome vazio deve retornar erro',
        request: { nome: '' },
        expected: {
          status: 422,
          message: 'Erro de validação',
          errors: {
            nome: ['O campo nome é obrigatório.']
          }
        }
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'pass',
          score: 15,
          maxScore: 15,
          message: 'Validação de nome obrigatório funcionando',
          request: { nome: '' },
          response: error.response.data
        });
      } else {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'fail',
          score: 0,
          maxScore: 15,
          message: 'Validação retornou status incorreto (esperado: 422)',
          error: error.message
        });
      }
    }

    // Teste 3: Validação tamanho do nome
    try {
      await this.client.createAuthor({ nome: 'A' }); // Muito curto
      
      this.addResult({
        endpoint: '/api/authors',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Validação falhou: nome com 1 caractere deve retornar erro',
        request: { nome: 'A' }
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Validação de tamanho mínimo do nome funcionando',
          request: { nome: 'A' }
        });
      } else {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'fail',
          score: 0,
          maxScore: 10,
          message: 'Validação de tamanho retornou status incorreto',
          error: error.message
        });
      }
    }

    // Teste 4: Validação nome muito longo
    try {
      const longName = 'A'.repeat(256); // Nome muito longo
      await this.client.createAuthor({ nome: longName });
      
      this.addResult({
        endpoint: '/api/authors',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Validação falhou: nome muito longo deveria retornar erro',
        request: { nome: longName.substring(0, 50) + '...' },
        expected: {
          status: 422,
          errors: { nome: ['O campo nome deve ter no máximo 255 caracteres'] }
        }
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Validação de tamanho máximo do nome funcionando',
          request: 'Nome com 256 caracteres'
        });
      } else {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'fail',
          score: 0,
          maxScore: 10,
          message: 'Validação de tamanho máximo retornou status incorreto',
          error: error.message
        });
      }
    }

    // Teste 5: Validação bio muito longa
    try {
      const longBio = 'A'.repeat(1001); // Bio muito longa
      await this.client.createAuthor({ 
        nome: 'Autor Bio Longa',
        bio: longBio 
      });
      
      this.addResult({
        endpoint: '/api/authors',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Validação falhou: bio muito longa deveria retornar erro',
        request: { nome: 'Autor Bio Longa', bio: longBio.substring(0, 50) + '...' },
        expected: {
          status: 422,
          errors: { bio: ['O campo bio deve ter no máximo 1000 caracteres'] }
        }
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Validação de tamanho máximo da bio funcionando',
          request: { nome: 'Autor Bio Longa', bio: 'Bio com 1001 caracteres' }
        });
      } else {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'fail',
          score: 0,
          maxScore: 10,
          message: 'Validação de bio muito longa retornou status incorreto',
          error: error.message
        });
      }
    }

    // Teste 6: Dados inválidos (tipos incorretos)
    try {
      await (this.client as any).client.post('/api/authors', {
        nome: 123, // Deveria ser string
        bio: true  // Deveria ser string
      });
      
      this.addResult({
        endpoint: '/api/authors',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Validação falhou: tipos de dados incorretos deveriam retornar erro',
        request: { nome: 123, bio: true },
        expected: {
          status: 422,
          errors: { 
            nome: ['O campo nome deve ser uma string'],
            bio: ['O campo bio deve ser uma string'] 
          }
        }
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Validação de tipos de dados funcionando',
          request: { nome: 'number', bio: 'boolean' }
        });
      } else {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'fail',
          score: 0,
          maxScore: 10,
          message: 'Validação de tipos retornou status incorreto',
          error: error.message
        });
      }
    }

    // Teste 7: Payload vazio
    try {
      await (this.client as any).client.post('/api/authors', {});
      
      this.addResult({
        endpoint: '/api/authors',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Validação falhou: payload vazio deveria retornar erro',
        request: {},
        expected: {
          status: 422,
          errors: { nome: ['O campo nome é obrigatório'] }
        }
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Validação de payload vazio funcionando',
          request: {}
        });
      } else {
        this.addResult({
          endpoint: '/api/authors',
          method: 'POST',
          status: 'fail',
          score: 0,
          maxScore: 10,
          message: 'Validação de payload vazio retornou status incorreto',
          error: error.message
        });
      }
    }
  }

  private async testGetAuthor() {
    const testId = this.testAuthorId || 1;
    
    // Teste 1: Buscar autor existente
    try {
      const response = await this.client.getAuthor(testId);
      
      if (response.status === 200) {
        // Flexível para aceitar tanto response.data quanto response.data.data
        const author = response.data.data || response.data;
        
        if (author.id === testId) {
          this.addResult({
            endpoint: `/api/authors/${testId}`,
            method: 'GET',
            status: 'pass',
            score: 15,
            maxScore: 15,
            message: 'Busca de autor por ID funcionando',
            response: response.data,
            expected: {
              id: testId,
              nome: "string",
              bio: "string|null", 
              criado_em: "timestamp",
              atualizado_em: "timestamp"
            }
          });
        } else {
          this.addResult({
            endpoint: `/api/authors/${testId}`,
            method: 'GET',
            status: 'fail',
            score: 0,
            maxScore: 15,
            message: 'ID do autor retornado não confere',
            response: response.data,
            expected: {
              id: testId,
              nome: "string",
              bio: "string|null",
              criado_em: "timestamp", 
              atualizado_em: "timestamp"
            }
          });
        }
      } else {
        this.addResult({
          endpoint: `/api/authors/${testId}`,
          method: 'GET',
          status: 'fail',
          score: 0,
          maxScore: 15,
          message: `Status HTTP incorreto: ${response.status} (esperado: 200)`,
          response: response.data,
          expected: 'Status HTTP: 200 (OK) com dados do autor'
        });
      }
    } catch (error: any) {
      this.addResult({
        endpoint: `/api/authors/${testId}`,
        method: 'GET',
        status: 'fail',
        score: 0,
        maxScore: 15,
        message: 'Erro ao buscar autor existente',
        error: error.message
      });
    }

    // Teste 2: Buscar autor inexistente
    try {
      await this.client.getAuthor(99999);
      
      this.addResult({
        endpoint: '/api/authors/99999',
        method: 'GET',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Busca de autor inexistente deveria retornar 404',
        request: { id: 99999 }
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.addResult({
          endpoint: '/api/authors/99999',
          method: 'GET',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Retorno 404 para autor inexistente funcionando',
          request: { id: 99999 }
        });
      } else {
        this.addResult({
          endpoint: '/api/authors/99999',
          method: 'GET',
          status: 'fail',
          score: 0,
          maxScore: 10,
          message: 'Status incorreto para autor inexistente (esperado: 404)',
          error: error.message
        });
      }
    }
  }

  private async testUpdateAuthor() {
    const testId = this.testAuthorId || 1;
    
    // Teste 1: Atualizar autor
    try {
      const updateData = {
        nome: 'Autor Atualizado ' + Date.now(),
        bio: 'Nova biografia'
      };
      
      const response = await this.client.updateAuthor(testId, updateData);
      
      if (response.status === 200) {
        // Flexível para aceitar tanto response.data quanto response.data.data
        const author = response.data.data || response.data;
        
        this.addResult({
          endpoint: `/api/authors/${testId}`,
          method: 'PUT',
          status: 'pass',
          score: 15,
          maxScore: 15,
          message: 'Atualização de autor funcionando',
          request: updateData,
          response: response.data,
          expected: {
            id: testId,
            nome: updateData.nome,
            bio: updateData.bio,
            criado_em: "timestamp",
            atualizado_em: "timestamp"
          }
        });
      } else {
        this.addResult({
          endpoint: `/api/authors/${testId}`,
          method: 'PUT',
          status: 'fail',
          score: 0,
          maxScore: 15,
          message: `Status HTTP incorreto: ${response.status} (esperado: 200)`,
          request: updateData,
          response: response.data,
          expected: 'Status HTTP: 200 (OK) com dados do autor atualizado'
        });
      }
    } catch (error: any) {
      this.addResult({
        endpoint: `/api/authors/${testId}`,
        method: 'PUT',
        status: 'fail',
        score: 0,
        maxScore: 15,
        message: 'Erro ao atualizar autor',
        error: error.message
      });
    }

    // Teste 2: Atualizar autor inexistente
    try {
      await this.client.updateAuthor(99999, { nome: 'Teste' });
      
      this.addResult({
        endpoint: '/api/authors/99999',
        method: 'PUT',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Atualização de autor inexistente deveria retornar 404'
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.addResult({
          endpoint: '/api/authors/99999',
          method: 'PUT',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Retorno 404 para atualização de autor inexistente funcionando'
        });
      }
    }
  }

  private async testAuthorBooks() {
    const testId = this.testAuthorId || 1;
    
    try {
      const response = await this.client.getAuthorBooks(testId);
      
      if (response.status === 200) {
        const data = response.data;
        if (Array.isArray(data)) {
          this.addResult({
            endpoint: `/api/authors/${testId}/books`,
            method: 'GET',
            status: 'pass',
            score: 15,
            maxScore: 15,
            message: 'Listagem de livros do autor funcionando',
            response: data
          });
        } else {
          this.addResult({
            endpoint: `/api/authors/${testId}/books`,
            method: 'GET',
            status: 'fail',
            score: 0,
            maxScore: 15,
            message: 'Estrutura de resposta incorreta para livros do autor (esperado: array)',
            response: data
          });
        }
      }
    } catch (error: any) {
      this.addResult({
        endpoint: `/api/authors/${testId}/books`,
        method: 'GET',
        status: 'fail',
        score: 0,
        maxScore: 15,
        message: 'Erro ao buscar livros do autor',
        error: error.message
      });
    }
  }

  private async testBusinessRules() {
    const testId = this.testAuthorId;
    if (!testId) {
      this.addResult({
        endpoint: '/api/authors/{id}',
        method: 'DELETE',
        status: 'fail',
        score: 0,
        maxScore: 20,
        message: 'Não foi possível testar regras de negócio - ID do autor não disponível',
        details: 'Este teste precisa de um autor criado nos testes anteriores'
      });
      return;
    }

    // Teste 1: Criar um livro para o autor antes de tentar excluir
    let bookId: number | null = null;
    try {
      const bookData = {
        titulo: 'Livro de Teste ' + Date.now(),
        autor_id: testId,
        ano_publicacao: 2024,
        paginas: 200,
        genero: 'Ficção',
        disponivel: true
      };
      
      const response = await this.client.createBook(bookData);
      if (response.status === 201) {
        const book = response.data.data || response.data;
        bookId = book.id;
      }
    } catch (error) {
      // Se não conseguir criar livro, pula este teste
      this.addResult({
        endpoint: '/api/books',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 20,
        message: 'Erro ao criar livro para teste de regra de negócio',
        details: 'Não foi possível criar um livro associado ao autor para testar a regra de exclusão',
        error: (error as any).message
      });
      return;
    }

    if (!bookId) {
      this.addResult({
        endpoint: '/api/books',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 20,
        message: 'Livro não foi criado corretamente para teste de regra de negócio',
        details: 'Não foi possível obter o ID do livro criado'
      });
      return;
    }

    // Teste 2: Tentar excluir autor que tem livros associados (deve falhar)
    try {
      await this.client.deleteAuthor(testId);
      
      // Se chegou aqui, o autor foi excluído quando não deveria
      this.addResult({
        endpoint: `/api/authors/${testId}`,
        method: 'DELETE',
        status: 'fail',
        score: 0,
        maxScore: 20,
        message: 'ERRO: Autor com livros foi excluído (viola regra de negócio)',
        details: 'O sistema deveria impedir a exclusão de autores que possuem livros associados',
        expected: {
          status: 409,
          message: 'Não é possível excluir autor que possui livros associados',
          code: 'CONFLICT'
        }
      });
    } catch (error: any) {
      if (error.response?.status === 409) {
        this.addResult({
          endpoint: `/api/authors/${testId}`,
          method: 'DELETE',
          status: 'pass',
          score: 20,
          maxScore: 20,
          message: 'Regra de negócio funcionando: impede exclusão de autor com livros',
          response: error.response.data,
          expected: {
            status: 409,
            message: 'Não é possível excluir autor que possui livros associados'
          }
        });
      } else {
        this.addResult({
          endpoint: `/api/authors/${testId}`,
          method: 'DELETE',
          status: 'fail',
          score: 0,
          maxScore: 20,
          message: `Erro inesperado ao tentar excluir autor com livros (status: ${error.response?.status})`,
          details: 'O sistema deveria retornar status 409 (Conflict) para esta operação',
          error: error.message,
          expected: {
            status: 409,
            message: 'Não é possível excluir autor que possui livros associados'
          }
        });
      }
    }

    // Teste 3: Limpar - excluir o livro criado para o teste
    if (bookId) {
      try {
        await this.client.deleteBook(bookId);
        this.addResult({
          endpoint: `/api/books/${bookId}`,
          method: 'DELETE',
          status: 'pass',
          score: 5,
          maxScore: 5,
          message: 'Limpeza: Livro de teste excluído com sucesso'
        });
      } catch (error) {
        this.addResult({
          endpoint: `/api/books/${bookId}`,
          method: 'DELETE',
          status: 'fail',
          score: 0,
          maxScore: 5,
          message: 'Erro ao limpar livro de teste',
          error: (error as any).message
        });
      }
    }

    // Teste 4: Agora o autor deveria poder ser excluído (sem livros)
    try {
      const response = await this.client.deleteAuthor(testId);
      
      if (response.status === 204 || response.status === 200) {
        this.addResult({
          endpoint: `/api/authors/${testId}`,
          method: 'DELETE',
          status: 'pass',
          score: 15,
          maxScore: 15,
          message: 'Exclusão de autor sem livros funcionando corretamente',
          expected: 'Status 204 (No Content) ou 200 (OK)'
        });
        
        // Limpa o ID para não tentar excluir novamente no testDeleteAuthor
        this.testAuthorId = null;
      } else {
        this.addResult({
          endpoint: `/api/authors/${testId}`,
          method: 'DELETE',
          status: 'fail',
          score: 0,
          maxScore: 15,
          message: `Status incorreto para exclusão de autor sem livros: ${response.status}`,
          expected: 'Status 204 (No Content) ou 200 (OK)'
        });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.addResult({
          endpoint: `/api/authors/${testId}`,
          method: 'DELETE',
          status: 'fail',
          score: 0,
          maxScore: 15,
          message: 'Autor não encontrado para exclusão (pode ter sido excluído anteriormente)',
          error: error.message
        });
      } else {
        this.addResult({
          endpoint: `/api/authors/${testId}`,
          method: 'DELETE',
          status: 'fail',
          score: 0,
          maxScore: 15,
          message: 'Erro ao excluir autor sem livros',
          error: error.message
        });
      }
    }
  }

  private async testDeleteAuthor() {
    // Este teste só executa se ainda há um autor para excluir
    // (caso os testes de regras de negócio não tenham conseguido excluir)
    
    const testId = this.testAuthorId;
    if (!testId) {
      // Autor já foi excluído nos testes de regras de negócio
      this.addResult({
        endpoint: '/api/authors/{id}',
        method: 'DELETE',
        status: 'pass',
        score: 5,
        maxScore: 5,
        message: 'Teste de exclusão pulado - autor já excluído em testes anteriores'
      });
      return;
    }

    // Teste adicional: Tentar excluir autor inexistente
    try {
      await this.client.deleteAuthor(99999);
      
      this.addResult({
        endpoint: '/api/authors/99999',
        method: 'DELETE',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Exclusão de autor inexistente deveria retornar 404',
        expected: 'Status HTTP: 404 (Not Found)'
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.addResult({
          endpoint: '/api/authors/99999',
          method: 'DELETE',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Retorno 404 para exclusão de autor inexistente funcionando',
          expected: 'Status HTTP: 404 (Not Found)'
        });
      } else {
        this.addResult({
          endpoint: '/api/authors/99999',
          method: 'DELETE',
          status: 'fail',
          score: 0,
          maxScore: 10,
          message: `Status incorreto para exclusão de autor inexistente: ${error.response?.status}`,
          error: error.message,
          expected: 'Status HTTP: 404 (Not Found)'
        });
      }
    }
  }
}