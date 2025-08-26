import { ApiClient } from './apiClient';
import { AuthorTests } from './authorTests';
import { BookTests } from './bookTests';
import type { TestResult, TestReport, TestConfig } from '../types/api';

export class TestRunner {
  private client: ApiClient;

  constructor(config: TestConfig) {
    this.client = new ApiClient(config.baseUrl, config.timeout);
  }

  async runAllTests(onProgress?: (progress: number, message: string) => void): Promise<TestReport> {
    const allResults: TestResult[] = [];
    let currentProgress = 0;

    try {
      // Teste de conexão inicial
      onProgress?.(0, 'Testando conexão com a API...');
      
      // Teste de conexão mais detalhado
      try {
        await this.client.getAuthors();
        onProgress?.(5, 'Conexão bem-sucedida! API respondendo...');
      } catch (error: any) {
        // Analisa o tipo de erro de conexão
        const errorMessage = this.analyzeConnectionError(error);
        
        allResults.push({
          endpoint: 'Teste de Conexão',
          method: 'GET',
          status: 'fail',
          score: 0,
          maxScore: 50,
          message: errorMessage.title,
          details: errorMessage.details,
          error: error.message
        });
        
        throw new Error(errorMessage.title);
      }

      onProgress?.(10, 'Conexão estabelecida. Iniciando testes de autores...');

      // Executar testes de autores (40% do progresso)
      const authorTests = new AuthorTests(this.client);
      const authorResults = await authorTests.runAllTests();
      allResults.push(...authorResults);
      
      currentProgress = 50;
      onProgress?.(currentProgress, 'Testes de autores concluídos. Iniciando testes de livros...');

      // Executar testes de livros (40% do progresso)
      const bookTests = new BookTests(this.client);
      const bookResults = await bookTests.runAllTests();
      allResults.push(...bookResults);

      currentProgress = 90;
      onProgress?.(currentProgress, 'Calculando pontuação final...');

      // Calcular relatório final
      const report = this.calculateReport(allResults);
      
      onProgress?.(100, 'Testes concluídos!');

      return report;

    } catch (error: any) {
      onProgress?.(100, `Erro durante execução: ${error.message}`);
      
      // Retorna relatório com erro
      return {
        totalScore: 0,
        maxScore: this.getMaxPossibleScore(),
        percentage: 0,
        grade: 0,
        tests: allResults,
        summary: {
          passed: 0,
          failed: allResults.length || 1,
          warnings: 0,
          total: allResults.length || 1
        }
      };
    }
  }

  private calculateReport(results: TestResult[]): TestReport {
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const maxScore = results.reduce((sum, result) => sum + result.maxScore, 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    
    // Calcular nota de 0 a 2 pontos
    const grade = Math.round((percentage / 100) * 2 * 100) / 100; // Arredonda para 2 casas decimais

    const summary = {
      passed: results.filter(r => r.status === 'pass').length,
      failed: results.filter(r => r.status === 'fail').length,
      warnings: results.filter(r => r.status === 'warning').length,
      total: results.length
    };

    return {
      totalScore,
      maxScore,
      percentage,
      grade,
      tests: results,
      summary
    };
  }

  private getMaxPossibleScore(): number {
    // Pontuação máxima baseada nos testes implementados
    // Autores: ~200 pontos, Livros: ~200 pontos
    return 400;
  }

  async testSingleEndpoint(endpoint: string, method: string): Promise<TestResult[]> {
    // Implementação para testar endpoint individual
    const allResults: TestResult[] = [];
    
    try {
      if (endpoint.includes('authors')) {
        const authorTests = new AuthorTests(this.client);
        const results = await authorTests.runAllTests();
        return results.filter(r => r.endpoint.includes(endpoint) && r.method === method);
      } else if (endpoint.includes('books')) {
        const bookTests = new BookTests(this.client);
        const results = await bookTests.runAllTests();
        return results.filter(r => r.endpoint.includes(endpoint) && r.method === method);
      }
    } catch (error: any) {
      allResults.push({
        endpoint,
        method,
        status: 'fail',
        score: 0,
        maxScore: 10,
        message: 'Erro ao executar teste individual',
        error: error.message
      });
    }

    return allResults;
  }

  // Métodos utilitários para análise
  getFailedTests(report: TestReport): TestResult[] {
    return report.tests.filter(test => test.status === 'fail');
  }

  getPassedTests(report: TestReport): TestResult[] {
    return report.tests.filter(test => test.status === 'pass');
  }

  generateSuggestions(report: TestReport): string[] {
    const suggestions: string[] = [];
    const failedTests = this.getFailedTests(report);

    if (failedTests.length === 0) {
      suggestions.push('🎉 Parabéns! Sua API está funcionando perfeitamente!');
      return suggestions;
    }

    // Análise de problemas de conectividade
    const connectionErrors = failedTests.filter(t => 
      t.message.includes('não está rodando') || 
      t.message.includes('Conexão') ||
      t.message.includes('ECONNREFUSED')
    );

    if (connectionErrors.length > 0) {
      suggestions.push('🚨 PRIORIDADE MÁXIMA: Inicie o servidor Laravel com "php artisan serve"');
      suggestions.push('🔍 Verifique se http://localhost:8000 responde no navegador');
      return suggestions; // Se não conecta, não vale a pena outras sugestões
    }

    // Análise de problemas de rota
    const routeErrors = failedTests.filter(t => 
      t.message.includes('404') || 
      t.message.includes('não encontrada')
    );

    if (routeErrors.length > 0) {
      suggestions.push('🛣️ Configure as rotas da API no arquivo routes/api.php');
      suggestions.push('📋 Execute "php artisan route:list" para verificar rotas disponíveis');
    }

    // Análise de problemas de banco
    const databaseErrors = failedTests.filter(t => 
      t.message.includes('500') || 
      t.message.includes('interno') ||
      t.message.includes('SQLSTATE')
    );

    if (databaseErrors.length > 0) {
      suggestions.push('🗄️ Configure o banco de dados: execute o script SQL no phpMyAdmin');
      suggestions.push('🔧 Execute "php artisan migrate" para criar as tabelas');
      suggestions.push('📊 Verifique se o MySQL está rodando no XAMPP');
    }

    // Análise de padrões específicos
    const statusErrors = failedTests.filter(t => t.message.includes('Status HTTP incorreto'));
    const validationErrors = failedTests.filter(t => t.message.includes('Validação'));
    const structureErrors = failedTests.filter(t => t.message.includes('estrutura'));
    const businessRuleErrors = failedTests.filter(t => t.message.includes('Regra de negócio'));

    if (statusErrors.length > 0) {
      suggestions.push('📊 Revisar códigos de status HTTP nos Controllers (200, 201, 404, 409, 422)');
    }

    if (validationErrors.length > 0) {
      suggestions.push('✅ Implementar Form Requests para validações (StoreAuthorRequest, etc.)');
    }

    if (structureErrors.length > 0) {
      suggestions.push('📋 Implementar Resources para formatação JSON (AuthorResource, BookResource)');
      suggestions.push('🔗 Garantir estrutura: {data: [], meta: {}, links: {}}');
    }

    if (businessRuleErrors.length > 0) {
      suggestions.push('⚖️ Implementar regras: não excluir autor com livros, não duplicar título+autor');
    }

    // Análise por categoria
    const authorErrors = failedTests.filter(t => t.endpoint.includes('authors'));
    const bookErrors = failedTests.filter(t => t.endpoint.includes('books'));

    if (authorErrors.length > 5) {
      suggestions.push('👤 Priorize a implementação do AuthorController');
    }

    if (bookErrors.length > 5) {
      suggestions.push('📚 Priorize a implementação do BookController');
    }

    // Sugestões baseadas na pontuação
    if (report.percentage === 0) {
      suggestions.push('🚨 URGENTE: Nenhum endpoint funcionando - siga o guia de setup básico');
    } else if (report.percentage < 30) {
      suggestions.push('🔧 Implementação inicial necessária - foque nos endpoints básicos (GET/POST)');
    } else if (report.percentage < 70) {
      suggestions.push('⚠️ Boa base! Agora implemente validações e regras de negócio');
    } else if (report.percentage < 90) {
      suggestions.push('👍 Quase lá! Ajuste alguns detalhes de validação e estrutura');
    } else {
      suggestions.push('✨ Excelente implementação! Apenas pequenos ajustes necessários');
    }

    // Sugestão final de recursos
    suggestions.push('📖 Consulte o arquivo API_Biblioteca_Basica.md para especificação completa');

    return suggestions;
  }

  exportReportAsJSON(report: TestReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Analisa erros de conexão e retorna mensagens específicas
   */
  private analyzeConnectionError(error: any): { title: string; details: string } {
    const errorCode = error.code;
    const errorMessage = error.message?.toLowerCase() || '';
    const responseStatus = error.response?.status;

    // Erro de rede (API não está rodando)
    if (errorCode === 'ECONNREFUSED' || errorMessage.includes('econnrefused')) {
      return {
        title: '🚨 API não está rodando',
        details: `A API Laravel não está acessível na URL configurada. 

SOLUÇÕES:
1. Verifique se executou: php artisan serve
2. Confirme se a API está rodando em localhost:8000
3. Verifique se não há erros no terminal do Laravel
4. Tente acessar http://localhost:8000/api/ no navegador

ERRO TÉCNICO: ${error.message}`
      };
    }

    // Erro de CORS
    if (errorMessage.includes('cors') || errorMessage.includes('blocked by cors')) {
      return {
        title: '🔒 Erro de CORS',
        details: `O navegador está bloqueando a requisição por política de CORS.

SOLUÇÕES:
1. Verifique se a API Laravel tem o middleware CORS configurado
2. Confirme se o arquivo config/cors.php permite requests de localhost
3. Reinicie o servidor Laravel após mudanças no CORS

ERRO TÉCNICO: ${error.message}`
      };
    }

    // Erro 404 (rota não encontrada)
    if (responseStatus === 404) {
      return {
        title: '❌ Rotas da API não encontradas',
        details: `A API está rodando mas as rotas não estão configuradas.

SOLUÇÕES:
1. Verifique se o arquivo routes/api.php tem as rotas configuradas
2. Confirme se os Controllers existem e estão importados
3. Execute: php artisan route:list para ver rotas disponíveis
4. Verifique se a URL base está correta (deve terminar sem /api)

ERRO TÉCNICO: Rota GET /api/authors retornou 404`
      };
    }

    // Erro 500 (erro interno do servidor)
    if (responseStatus === 500) {
      return {
        title: '💥 Erro interno da API',
        details: `A API está rodando mas tem erros internos.

SOLUÇÕES:
1. Verifique os logs do Laravel (storage/logs/laravel.log)
2. Confirme se o banco de dados está configurado (.env)
3. Execute: php artisan migrate para criar tabelas
4. Verifique se as dependências estão instaladas (composer install)

ERRO TÉCNICO: A API retornou status 500 (erro interno)`
      };
    }

    // Erro de timeout
    if (errorCode === 'ENOTFOUND' || errorMessage.includes('timeout')) {
      return {
        title: '⏱️ Timeout na conexão',
        details: `A requisição demorou muito para responder.

SOLUÇÕES:
1. Verifique se a URL está correta
2. Confirme se não há problemas de rede
3. Teste acessar a URL diretamente no navegador
4. Verifique se o servidor não está sobrecarregado

ERRO TÉCNICO: ${error.message}`
      };
    }

    // Erro de URL malformada
    if (errorMessage.includes('invalid url') || errorMessage.includes('malformed')) {
      return {
        title: '🔗 URL inválida',
        details: `A URL da API está malformada.

SOLUÇÕES:
1. Verifique se a URL está no formato: http://localhost:8000
2. Não inclua /api/ no final da URL base
3. Confirme se não há espaços ou caracteres especiais
4. Use http:// (não https://) para desenvolvimento local

URL ATUAL: ${error.config?.baseURL || 'não informada'}`
      };
    }

    // Erro genérico
    return {
      title: '❓ Erro de conexão desconhecido',
      details: `Ocorreu um erro não identificado ao conectar com a API.

SOLUÇÕES GERAIS:
1. Verifique se o Laravel está rodando: php artisan serve
2. Confirme se o banco está configurado e rodando
3. Teste acessar http://localhost:8000/api/ no navegador
4. Verifique se não há firewall bloqueando a porta 8000

ERRO TÉCNICO: ${error.message}
CÓDIGO: ${errorCode || 'não informado'}`
    };
  }

  /**
   * Analisa funcionalidades específicas que estão faltando
   */
  private analyzeMissingFeatures(report: TestReport) {
    const failedTests = this.getFailedTests(report);
    
    const missing = {
      critical: [] as string[],
      endpoints: [] as string[],
      validations: [] as string[],
      businessRules: [] as string[],
      structure: [] as string[],
      httpStatus: [] as string[]
    };

    // Análise de problemas críticos
    const connectionFails = failedTests.filter(t => 
      t.message.includes('não está rodando') || 
      t.message.includes('Conexão') ||
      t.endpoint === 'Teste de Conexão'
    );
    
    if (connectionFails.length > 0) {
      missing.critical.push('Servidor Laravel não está executando (php artisan serve)');
      missing.critical.push('Verifique se http://localhost:8000 está acessível');
    }

    // Análise de endpoints não implementados
    const routeErrors = failedTests.filter(t => t.message.includes('404') || t.message.includes('não encontrada'));
    routeErrors.forEach(test => {
      missing.endpoints.push(`${test.method} ${test.endpoint} - rota não configurada em routes/api.php`);
    });

    // Análise de erros internos
    const serverErrors = failedTests.filter(t => t.message.includes('500') || t.message.includes('interno'));
    serverErrors.forEach(test => {
      missing.endpoints.push(`${test.method} ${test.endpoint} - Controller tem erro interno`);
    });

    // Análise de validações
    const validationErrors = failedTests.filter(t => 
      t.message.includes('Validação') || 
      t.message.includes('obrigatório') ||
      t.message.includes('tamanho')
    );
    validationErrors.forEach(test => {
      if (test.endpoint.includes('authors')) {
        missing.validations.push('Campo nome obrigatório para autores (Form Request)');
        missing.validations.push('Validação de tamanho mínimo do nome (min:2)');
      }
      if (test.endpoint.includes('books')) {
        missing.validations.push('Campos obrigatórios para livros: titulo, author_id, ano_publicacao');
        missing.validations.push('Validação de ano de publicação (numeric, min:1000)');
      }
    });

    // Análise de regras de negócio
    const businessErrors = failedTests.filter(t => 
      t.message.includes('Regra de negócio') ||
      t.message.includes('duplicação') ||
      t.message.includes('excluir')
    );
    businessErrors.forEach(test => {
      if (test.message.includes('excluir') && test.endpoint.includes('authors')) {
        missing.businessRules.push('Impedir exclusão de autor que possui livros (retornar status 409)');
      }
      if (test.message.includes('duplicação') && test.endpoint.includes('books')) {
        missing.businessRules.push('Impedir criação de livro com título+autor duplicado (status 409)');
      }
    });

    // Análise de estrutura de resposta
    const structureErrors = failedTests.filter(t => 
      t.message.includes('estrutura') ||
      t.message.includes('data, meta ou links')
    );
    structureErrors.forEach(test => {
      missing.structure.push(`${test.endpoint} deve retornar: {data: [], meta: {}, links: {}}`);
      missing.structure.push('Implementar API Resources (AuthorResource, BookResource)');
    });

    // Análise de status HTTP
    const statusErrors = failedTests.filter(t => t.message.includes('Status HTTP incorreto'));
    statusErrors.forEach(test => {
      if (test.method === 'POST') {
        missing.httpStatus.push(`${test.endpoint} POST deve retornar status 201 (created)`);
      }
      if (test.method === 'GET' && test.endpoint.includes('99999')) {
        missing.httpStatus.push(`${test.endpoint} GET para ID inexistente deve retornar 404`);
      }
      if (test.method === 'DELETE') {
        missing.httpStatus.push(`${test.endpoint} DELETE deve retornar 204 (no content) ou 409 (conflict)`);
      }
    });

    return missing;
  }

  /**
   * Calcula pontuação por categoria
   */
  private calculateCategoryScore(report: TestReport, category: string): number {
    let score = 0;
    
    switch (category) {
      case 'connection':
        const connectionTests = report.tests.filter(t => 
          t.endpoint === 'Teste de Conexão' || 
          t.endpoint === '/api/authors' && t.method === 'GET'
        );
        score = connectionTests.reduce((sum, test) => sum + test.score, 0);
        break;
        
      case 'basic':
        const basicTests = report.tests.filter(t => 
          !t.message.includes('Validação') && 
          !t.message.includes('Regra de negócio') &&
          !t.message.includes('obrigatório') &&
          t.endpoint !== 'Teste de Conexão'
        );
        score = basicTests.reduce((sum, test) => sum + test.score, 0);
        break;
        
      case 'validation':
        const validationTests = report.tests.filter(t => 
          t.message.includes('Validação') || 
          t.message.includes('obrigatório') ||
          t.message.includes('tamanho')
        );
        score = validationTests.reduce((sum, test) => sum + test.score, 0);
        break;
        
      case 'business':
        const businessTests = report.tests.filter(t => 
          t.message.includes('Regra de negócio') ||
          t.message.includes('excluir') ||
          t.message.includes('duplicação')
        );
        score = businessTests.reduce((sum, test) => sum + test.score, 0);
        break;
    }
    
    return score;
  }

  generateTextSummary(report: TestReport): string {
    const suggestions = this.generateSuggestions(report);
    const failedTests = this.getFailedTests(report);
    
    // Análise detalhada do que está faltando
    const missingFeatures = this.analyzeMissingFeatures(report);
    
    return `
=== RELATÓRIO DETALHADO DA API BIBLIOTECA ===

PONTUAÇÃO FINAL: ${report.grade}/2.0 pontos (${report.percentage.toFixed(1)}%)

ESTATÍSTICAS:
- Testes aprovados: ${report.summary.passed}
- Testes falharam: ${report.summary.failed}
- Avisos: ${report.summary.warnings}
- Total de testes: ${report.summary.total}

${missingFeatures.critical.length > 0 ? `
PROBLEMAS CRÍTICOS QUE IMPEDEM FUNCIONAMENTO:
${missingFeatures.critical.map(item => `• ${item}`).join('\n')}
` : ''}

${missingFeatures.endpoints.length > 0 ? `
ENDPOINTS NÃO IMPLEMENTADOS:
${missingFeatures.endpoints.map(item => `• ${item}`).join('\n')}
` : ''}

${missingFeatures.validations.length > 0 ? `
VALIDAÇÕES FALTANDO:
${missingFeatures.validations.map(item => `• ${item}`).join('\n')}
` : ''}

${missingFeatures.businessRules.length > 0 ? `
REGRAS DE NEGÓCIO NÃO IMPLEMENTADAS:
${missingFeatures.businessRules.map(item => `• ${item}`).join('\n')}
` : ''}

${missingFeatures.structure.length > 0 ? `
PROBLEMAS DE ESTRUTURA DE RESPOSTA:
${missingFeatures.structure.map(item => `• ${item}`).join('\n')}
` : ''}

${missingFeatures.httpStatus.length > 0 ? `
STATUS HTTP INCORRETOS:
${missingFeatures.httpStatus.map(item => `• ${item}`).join('\n')}
` : ''}

PONTUAÇÃO POR CATEGORIA:
• Conexão e Rotas: ${this.calculateCategoryScore(report, 'connection')}/50 pontos
• Funcionalidade Básica: ${this.calculateCategoryScore(report, 'basic')}/200 pontos  
• Validações: ${this.calculateCategoryScore(report, 'validation')}/100 pontos
• Regras de Negócio: ${this.calculateCategoryScore(report, 'business')}/50 pontos

PRÓXIMOS PASSOS PRIORITÁRIOS:
${suggestions.slice(0, 5).map(s => `• ${s.replace(/[^\w\s:\/\-\(\)\.]/g, '')}`).join('\n')}

DETALHES DOS TESTES QUE FALHARAM:
${failedTests.map(test => 
  `[FALHOU] ${test.method} ${test.endpoint}
   - ${test.message}
   - Pontuação perdida: ${test.maxScore - test.score}/${test.maxScore} pontos
   ${test.details ? `- Solução: ${test.details.split('\n')[0]}` : ''}`
).join('\n\n')}

${report.summary.passed > 0 ? `
FUNCIONALIDADES IMPLEMENTADAS CORRETAMENTE:
${report.tests.filter(t => t.status === 'pass').map(test => 
  `• ${test.method} ${test.endpoint} - ${test.message}`
).join('\n')}
` : ''}

ESPECIFICAÇÕES TÉCNICAS NECESSÁRIAS:

ROTAS NECESSÁRIAS (routes/api.php):
• Route::get('/authors', [AuthorController::class, 'index']);
• Route::post('/authors', [AuthorController::class, 'store']);
• Route::get('/authors/{id}', [AuthorController::class, 'show']);
• Route::put('/authors/{id}', [AuthorController::class, 'update']);
• Route::delete('/authors/{id}', [AuthorController::class, 'destroy']);
• Route::get('/authors/{id}/books', [AuthorController::class, 'books']);
• Mesmo padrão para /books

CONTROLLERS NECESSÁRIOS:
• AuthorController: index(), store(), show(), update(), destroy(), books()
• BookController: index(), store(), show(), update(), destroy()

FORM REQUESTS NECESSÁRIOS:
• StoreAuthorRequest: nome obrigatório, min:2 caracteres
• UpdateAuthorRequest: mesmo que store mas campos opcionais
• StoreBookRequest: titulo, author_id, ano_publicacao obrigatórios
• UpdateBookRequest: campos opcionais

API RESOURCES NECESSÁRIOS:
• AuthorResource: formatação JSON padronizada
• BookResource: formatação JSON padronizada
• Estrutura: {data: [], meta: {pagination}, links: {}}

REGRAS DE NEGÓCIO:
• Não permitir exclusão de autor com livros (status 409)
• Não permitir duplicação titulo+autor para livros (status 409)
• Paginação com parâmetros page, per_page
• Busca com parâmetro q (query)
• Ordenação com parâmetro sort

STATUS HTTP CORRETOS:
• GET: 200 (sucesso), 404 (não encontrado)
• POST: 201 (criado), 422 (validação falhou), 409 (duplicado)
• PUT: 200 (atualizado), 404 (não encontrado), 422 (validação)
• DELETE: 204 (removido), 404 (não encontrado), 409 (não pode remover)
    `.trim();
  }
}