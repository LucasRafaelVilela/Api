import { ApiClient } from './apiClient';
import type { TestResult } from '../types/api';

export class BookTests {
  private client: ApiClient;
  private testResults: TestResult[] = [];

  constructor(client: ApiClient) {
    this.client = client;
  }

  async runAllTests(): Promise<TestResult[]> {
    this.testResults = [];
    
    try {
      await this.testListBooks();
      await this.testCreateBook();
      await this.testGetBook();
      await this.testUpdateBook();
      await this.testDeleteBook();
    } catch (error) {
      console.error('Erro durante execução dos testes de livros:', error);
    }

    return this.testResults;
  }

  private addResult(result: TestResult) {
    this.testResults.push(result);
  }

  private async testListBooks() {
    // Teste 1: Listar livros (paginação básica)
    try {
      const response = await this.client.getBooks();
      
      if (response.status === 200) {
        const data = response.data;
        
        // Verifica se é um array de livros
        if (Array.isArray(data)) {
          this.addResult({
            endpoint: '/api/books',
            method: 'GET',
            status: 'pass',
            score: 15,
            maxScore: 15,
            message: 'Listagem básica de livros funcionando corretamente',
            response: data
          });
        } else {
          this.addResult({
            endpoint: '/api/books',
            method: 'GET',
            status: 'fail',
            score: 5,
            maxScore: 15,
            message: 'Estrutura de resposta incorreta (esperado: array de livros)',
            response: data
          });
        }
      } else {
        this.addResult({
          endpoint: '/api/books',
          method: 'GET',
          status: 'fail',
          score: 0,
          maxScore: 15,
          message: `Status HTTP incorreto: ${response.status} (esperado: 200)`,
          response: response.data
        });
      }
    } catch (error: any) {
      this.addResult({
        endpoint: '/api/books',
        method: 'GET',
        status: 'fail',
        score: 0,
        maxScore: 15,
        message: 'Erro ao acessar endpoint de livros',
        error: error.message
      });
    }

    // Teste 2: Verificar se contém campos obrigatórios
    try {
      const response = await this.client.getBooks();
      
      if (response.status === 200 && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          const book = response.data[0];
          if (book.id && book.titulo && book.autor_id !== undefined) {
            this.addResult({
              endpoint: '/api/books',
              method: 'GET',
              status: 'pass',
              score: 10,
              maxScore: 10,
              message: 'Estrutura de livro contém campos obrigatórios',
              response: { sample: book }
            });
          } else {
            this.addResult({
              endpoint: '/api/books',
              method: 'GET',
              status: 'fail',
              score: 0,
              maxScore: 10,
              message: 'Estrutura de livro faltando campos obrigatórios (id, titulo, autor_id)',
              response: { sample: book }
            });
          }
        } else {
          this.addResult({
            endpoint: '/api/books',
            method: 'GET',
            status: 'pass',
            score: 10,
            maxScore: 10,
            message: 'Lista vazia de livros retornada corretamente'
          });
        }
      }
    } catch (error: any) {
      this.addResult({
        endpoint: '/api/books',
        method: 'GET',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Erro ao verificar estrutura de livros',
        error: error.message
      });
    }

    // Teste 5: Busca por título
    try {
      const response = await this.client.getBooks({ q: 'teste' });
      
      if (response.status === 200) {
        this.addResult({
          endpoint: '/api/books',
          method: 'GET',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Busca por título funcionando',
          request: { q: 'teste' }
        });
      }
    } catch (error: any) {
      this.addResult({
        endpoint: '/api/books',
        method: 'GET',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Erro ao testar busca por título',
        error: error.message
      });
    }
  }

  private async testCreateBook() {
    const testAuthorId = (global as any).testAuthorId || 1;
    
    // Teste 1: Criar livro válido
    try {
      const bookData = {
        titulo: 'Livro Teste ' + Date.now(),
        autor_id: testAuthorId,
        ano_publicacao: 2020,
        paginas: 300,
        genero: 'Romance',
        disponivel: true
      };
      
      const response = await this.client.createBook(bookData);
      
      if (response.status === 201) {
        const book = response.data;
        if (book.id && book.titulo === bookData.titulo) {
          this.addResult({
            endpoint: '/api/books',
            method: 'POST',
            status: 'pass',
            score: 20,
            maxScore: 20,
            message: 'Criação de livro funcionando corretamente',
            request: bookData,
            response: book
          });
          
          // Armazena ID para usar em outros testes
          (global as any).testBookId = book.id;
        } else {
          this.addResult({
            endpoint: '/api/books',
            method: 'POST',
            status: 'fail',
            score: 10,
            maxScore: 20,
            message: 'Livro criado mas estrutura de resposta incorreta',
            request: bookData,
            response: book
          });
        }
      } else {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'fail',
          score: 0,
          maxScore: 20,
          message: `Status HTTP incorreto: ${response.status} (esperado: 201)`,
          request: bookData
        });
      }
    } catch (error: any) {
      this.addResult({
        endpoint: '/api/books',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 20,
        message: 'Erro ao criar livro',
        error: error.message
      });
    }

    // Teste 2: Validação título obrigatório
    try {
      await this.client.createBook({ titulo: '', autor_id: testAuthorId });
      
      this.addResult({
        endpoint: '/api/books',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 15,
        message: 'Validação falhou: título vazio deve retornar erro',
        request: { titulo: '', autor_id: testAuthorId }
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'pass',
          score: 15,
          maxScore: 15,
          message: 'Validação de título obrigatório funcionando',
          request: { titulo: '', autor_id: testAuthorId },
          response: error.response.data
        });
      } else {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'fail',
          score: 5,
          maxScore: 15,
          message: 'Validação retornou status incorreto (esperado: 422)',
          error: error.message
        });
      }
    }

    // Teste 3: Validação autor_id obrigatório
    try {
      await this.client.createBook({ titulo: 'Teste', autor_id: 99999 });
      
      this.addResult({
        endpoint: '/api/books',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 15,
        message: 'Validação falhou: autor inexistente deve retornar erro',
        request: { titulo: 'Teste', autor_id: 99999 }
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'pass',
          score: 15,
          maxScore: 15,
          message: 'Validação de autor_id funcionando',
          request: { titulo: 'Teste', autor_id: 99999 },
          response: error.response.data
        });
      } else {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'fail',
          score: 5,
          maxScore: 15,
          message: 'Validação de autor retornou status incorreto',
          error: error.message
        });
      }
    }

    // Teste 4: Validação ano de publicação
    try {
      await this.client.createBook({ 
        titulo: 'Teste', 
        autor_id: testAuthorId, 
        ano_publicacao: 1400 // Muito antigo
      });
      
      this.addResult({
        endpoint: '/api/books',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Validação falhou: ano anterior a 1450 deve retornar erro',
        request: { titulo: 'Teste', autor_id: testAuthorId, ano_publicacao: 1400 }
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Validação de ano de publicação funcionando',
          request: { titulo: 'Teste', autor_id: testAuthorId, ano_publicacao: 1400 }
        });
      } else {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'fail',
          score: 2,
          maxScore: 10,
          message: 'Validação de ano retornou status incorreto',
          error: error.message
        });
      }
    }

    // Teste 5: Validação páginas
    try {
      await this.client.createBook({ 
        titulo: 'Teste', 
        autor_id: testAuthorId, 
        paginas: 0 // Inválido
      });
      
      this.addResult({
        endpoint: '/api/books',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Validação falhou: páginas ≤ 0 deve retornar erro',
        request: { titulo: 'Teste', autor_id: testAuthorId, paginas: 0 }
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Validação de páginas funcionando',
          request: { titulo: 'Teste', autor_id: testAuthorId, paginas: 0 }
        });
      } else {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'fail',
          score: 2,
          maxScore: 10,
          message: 'Validação de páginas retornou status incorreto',
          error: error.message
        });
      }
    }

    // Teste 6: Regra de negócio - duplicidade título+autor
    const testTitle = 'Livro Duplicado ' + Date.now();
    try {
      // Criar primeiro livro
      await this.client.createBook({
        titulo: testTitle,
        autor_id: testAuthorId
      });
      
      // Tentar criar livro duplicado
      await this.client.createBook({
        titulo: testTitle,
        autor_id: testAuthorId
      });
      
      this.addResult({
        endpoint: '/api/books',
        method: 'POST',
        status: 'fail',
        score: 0,
        maxScore: 20,
        message: 'Regra de negócio falhou: deve impedir título duplicado para mesmo autor',
        request: { titulo: testTitle, autor_id: testAuthorId }
      });
    } catch (error: any) {
      if (error.response?.status === 409) {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'pass',
          score: 20,
          maxScore: 20,
          message: 'Regra de negócio funcionando: impede título duplicado (409)',
          request: { titulo: testTitle, autor_id: testAuthorId },
          response: error.response.data
        });
      } else {
        this.addResult({
          endpoint: '/api/books',
          method: 'POST',
          status: 'fail',
          score: 5,
          maxScore: 20,
          message: 'Regra de duplicidade retornou status incorreto (esperado: 409)',
          error: error.message
        });
      }
    }
  }

  private async testGetBook() {
    const testId = (global as any).testBookId || 1;
    
    // Teste 1: Buscar livro existente
    try {
      const response = await this.client.getBook(testId);
      
      if (response.status === 200) {
        const book = response.data;
        if (book.id === testId) {
          this.addResult({
            endpoint: `/api/books/${testId}`,
            method: 'GET',
            status: 'pass',
            score: 15,
            maxScore: 15,
            message: 'Busca de livro por ID funcionando',
            response: book
          });
        } else {
          this.addResult({
            endpoint: `/api/books/${testId}`,
            method: 'GET',
            status: 'fail',
            score: 5,
            maxScore: 15,
            message: 'ID do livro retornado não confere',
            response: book
          });
        }
      }
    } catch (error: any) {
      this.addResult({
        endpoint: `/api/books/${testId}`,
        method: 'GET',
        status: 'fail',
        score: 0,
        maxScore: 15,
        message: 'Erro ao buscar livro existente',
        error: error.message
      });
    }

    // Teste 2: Buscar livro inexistente
    try {
      await this.client.getBook(99999);
      
      this.addResult({
        endpoint: '/api/books/99999',
        method: 'GET',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Busca de livro inexistente deveria retornar 404',
        request: { id: 99999 }
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.addResult({
          endpoint: '/api/books/99999',
          method: 'GET',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Retorno 404 para livro inexistente funcionando',
          request: { id: 99999 }
        });
      } else {
        this.addResult({
          endpoint: '/api/books/99999',
          method: 'GET',
          status: 'fail',
          score: 2,
          maxScore: 10,
          message: 'Status incorreto para livro inexistente (esperado: 404)',
          error: error.message
        });
      }
    }
  }

  private async testUpdateBook() {
    const testId = (global as any).testBookId || 1;
    
    // Teste 1: Atualizar livro
    try {
      const updateData = {
        titulo: 'Livro Atualizado ' + Date.now(),
        ano_publicacao: 2021,
        paginas: 400,
        disponivel: false
      };
      
      const response = await this.client.updateBook(testId, updateData);
      
      if (response.status === 200) {
        this.addResult({
          endpoint: `/api/books/${testId}`,
          method: 'PUT',
          status: 'pass',
          score: 15,
          maxScore: 15,
          message: 'Atualização de livro funcionando',
          request: updateData
        });
      }
    } catch (error: any) {
      this.addResult({
        endpoint: `/api/books/${testId}`,
        method: 'PUT',
        status: 'fail',
        score: 0,
        maxScore: 15,
        message: 'Erro ao atualizar livro',
        error: error.message
      });
    }

    // Teste 2: Atualizar livro inexistente
    try {
      await this.client.updateBook(99999, { titulo: 'Teste' });
      
      this.addResult({
        endpoint: '/api/books/99999',
        method: 'PUT',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Atualização de livro inexistente deveria retornar 404'
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.addResult({
          endpoint: '/api/books/99999',
          method: 'PUT',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Retorno 404 para atualização de livro inexistente funcionando'
        });
      }
    }

    // Teste 3: Validação na atualização
    try {
      await this.client.updateBook(testId, { paginas: -5 });
      
      this.addResult({
        endpoint: `/api/books/${testId}`,
        method: 'PUT',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Validação na atualização falhou: páginas negativas deveriam retornar erro'
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        this.addResult({
          endpoint: `/api/books/${testId}`,
          method: 'PUT',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Validação na atualização funcionando'
        });
      }
    }
  }

  private async testDeleteBook() {
    const testId = (global as any).testBookId;
    if (!testId) return;

    try {
      const response = await this.client.deleteBook(testId);
      
      if (response.status === 204) {
        this.addResult({
          endpoint: `/api/books/${testId}`,
          method: 'DELETE',
          status: 'pass',
          score: 15,
          maxScore: 15,
          message: 'Exclusão de livro funcionando (204)'
        });
      } else {
        this.addResult({
          endpoint: `/api/books/${testId}`,
          method: 'DELETE',
          status: 'fail',
          score: 5,
          maxScore: 15,
          message: 'Status incorreto para exclusão (esperado: 204)'
        });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.addResult({
          endpoint: `/api/books/${testId}`,
          method: 'DELETE',
          status: 'warning',
          score: 10,
          maxScore: 15,
          message: 'Livro já foi excluído ou não existe (404)',
          error: error.message
        });
      } else {
        this.addResult({
          endpoint: `/api/books/${testId}`,
          method: 'DELETE',
          status: 'fail',
          score: 0,
          maxScore: 15,
          message: 'Erro ao excluir livro',
          error: error.message
        });
      }
    }

    // Teste exclusão de livro inexistente
    try {
      await this.client.deleteBook(99999);
      
      this.addResult({
        endpoint: '/api/books/99999',
        method: 'DELETE',
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Exclusão de livro inexistente deveria retornar 404'
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.addResult({
          endpoint: '/api/books/99999',
          method: 'DELETE',
          status: 'pass',
          score: 10,
          maxScore: 10,
          message: 'Retorno 404 para exclusão de livro inexistente funcionando'
        });
      }
    }
  }
}