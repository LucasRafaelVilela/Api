// Tipos baseados na especificação API_Biblioteca_Basica.md

export interface Author {
  id: number;
  nome: string;
  bio?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Book {
  id: number;
  titulo: string;
  autor_id: number;
  autor?: { id: number; nome: string };
  ano_publicacao?: number;
  paginas?: number;
  genero?: string;
  disponivel: boolean;
  criado_em: string;
  atualizado_em: string;
}

// Não há mais paginação - API retorna arrays diretos

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface TestResult {
  endpoint: string;
  method: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  maxScore: number;
  message: string;
  details?: string;
  request?: any;
  response?: any;
  expected?: any;
  error?: string;
}

export interface TestReport {
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: number; // 0-2 pontos
  tests: TestResult[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
    total: number;
  };
}

export interface TestConfig {
  baseUrl: string;
  timeout: number;
  stopOnFirstError: boolean;
}