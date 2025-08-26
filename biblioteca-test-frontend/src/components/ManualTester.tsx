import React, { useState } from 'react';
import { ApiClient } from '../services/apiClient';
import type { Author, Book } from '../types/api';

interface ManualTesterProps {
  apiClient: ApiClient;
}

interface RequestLog {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  requestData?: any;
  response?: any;
  error?: string;
  status?: number;
}

const ManualTester: React.FC<ManualTesterProps> = ({ apiClient }) => {
  const [activeTab, setActiveTab] = useState<'authors' | 'books'>('authors');
  const [operation, setOperation] = useState<string>('list');
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [authorForm, setAuthorForm] = useState({ nome: '', bio: '', id: '' });
  const [bookForm, setBookForm] = useState({
    titulo: '',
    autor_id: '',
    ano_publicacao: '',
    paginas: '',
    genero: '',
    disponivel: true,
    id: ''
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addLog = (log: Omit<RequestLog, 'id' | 'timestamp'>) => {
    const newLog: RequestLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString()
    };
    setRequestLogs(prev => [newLog, ...prev.slice(0, 9)]); // Keep last 10 logs
  };

  const validateAuthorForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (operation === 'create' || operation === 'update') {
      if (!authorForm.nome.trim()) {
        newErrors.nome = 'Nome é obrigatório';
      } else if (authorForm.nome.length < 2) {
        newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
      } else if (authorForm.nome.length > 255) {
        newErrors.nome = 'Nome deve ter no máximo 255 caracteres';
      }

      if (authorForm.bio && authorForm.bio.length > 1000) {
        newErrors.bio = 'Biografia deve ter no máximo 1000 caracteres';
      }
    }

    if (operation === 'show' || operation === 'update' || operation === 'delete') {
      if (!authorForm.id.trim()) {
        newErrors.id = 'ID é obrigatório';
      } else if (isNaN(Number(authorForm.id))) {
        newErrors.id = 'ID deve ser um número';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBookForm = () => {
    const newErrors: Record<string, string> = {};
    const currentYear = new Date().getFullYear();
    
    if (operation === 'create' || operation === 'update') {
      if (!bookForm.titulo.trim()) {
        newErrors.titulo = 'Título é obrigatório';
      } else if (bookForm.titulo.length < 2) {
        newErrors.titulo = 'Título deve ter pelo menos 2 caracteres';
      } else if (bookForm.titulo.length > 255) {
        newErrors.titulo = 'Título deve ter no máximo 255 caracteres';
      }

      if (!bookForm.autor_id.trim()) {
        newErrors.autor_id = 'Autor ID é obrigatório';
      } else if (isNaN(Number(bookForm.autor_id))) {
        newErrors.autor_id = 'Autor ID deve ser um número';
      }

      if (bookForm.ano_publicacao) {
        const year = Number(bookForm.ano_publicacao);
        if (isNaN(year)) {
          newErrors.ano_publicacao = 'Ano deve ser um número';
        } else if (year < 1450) {
          newErrors.ano_publicacao = 'Ano deve ser no mínimo 1450';
        } else if (year > currentYear) {
          newErrors.ano_publicacao = 'Ano não pode ser futuro';
        }
      }

      if (bookForm.paginas) {
        const pages = Number(bookForm.paginas);
        if (isNaN(pages)) {
          newErrors.paginas = 'Páginas deve ser um número';
        } else if (pages < 1) {
          newErrors.paginas = 'Páginas deve ser pelo menos 1';
        }
      }

      if (bookForm.genero && bookForm.genero.length > 100) {
        newErrors.genero = 'Gênero deve ter no máximo 100 caracteres';
      }
    }

    if (operation === 'show' || operation === 'update' || operation === 'delete') {
      if (!bookForm.id.trim()) {
        newErrors.id = 'ID é obrigatório';
      } else if (isNaN(Number(bookForm.id))) {
        newErrors.id = 'ID deve ser um número';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const executeRequest = async () => {
    if (activeTab === 'authors' && !validateAuthorForm()) return;
    if (activeTab === 'books' && !validateBookForm()) return;

    setLoading(true);
    try {
      let response: any;
      let requestData: any = undefined;

      if (activeTab === 'authors') {
        switch (operation) {
          case 'list':
            response = await apiClient.getAuthors();
            break;
          case 'create':
            requestData = {
              nome: authorForm.nome,
              bio: authorForm.bio || undefined
            };
            response = await apiClient.createAuthor(requestData);
            break;
          case 'show':
            response = await apiClient.getAuthor(Number(authorForm.id));
            break;
          case 'update':
            requestData = {
              nome: authorForm.nome,
              bio: authorForm.bio || undefined
            };
            response = await apiClient.updateAuthor(Number(authorForm.id), requestData);
            break;
          case 'delete':
            response = await apiClient.deleteAuthor(Number(authorForm.id));
            break;
          case 'books':
            response = await apiClient.getAuthorBooks(Number(authorForm.id));
            break;
        }
      } else {
        switch (operation) {
          case 'list':
            response = await apiClient.getBooks();
            break;
          case 'create':
            requestData = {
              titulo: bookForm.titulo,
              autor_id: Number(bookForm.autor_id),
              ano_publicacao: bookForm.ano_publicacao ? Number(bookForm.ano_publicacao) : undefined,
              paginas: bookForm.paginas ? Number(bookForm.paginas) : undefined,
              genero: bookForm.genero || undefined,
              disponivel: bookForm.disponivel
            };
            response = await apiClient.createBook(requestData);
            break;
          case 'show':
            response = await apiClient.getBook(Number(bookForm.id));
            break;
          case 'update':
            requestData = {
              titulo: bookForm.titulo,
              autor_id: Number(bookForm.autor_id),
              ano_publicacao: bookForm.ano_publicacao ? Number(bookForm.ano_publicacao) : undefined,
              paginas: bookForm.paginas ? Number(bookForm.paginas) : undefined,
              genero: bookForm.genero || undefined,
              disponivel: bookForm.disponivel
            };
            response = await apiClient.updateBook(Number(bookForm.id), requestData);
            break;
          case 'delete':
            response = await apiClient.deleteBook(Number(bookForm.id));
            break;
        }
      }

      addLog({
        method: getMethodForOperation(operation),
        endpoint: getEndpointForOperation(activeTab, operation, activeTab === 'authors' ? authorForm.id : bookForm.id),
        requestData,
        response: response.data,
        status: response.status
      });

    } catch (error: any) {
      addLog({
        method: getMethodForOperation(operation),
        endpoint: getEndpointForOperation(activeTab, operation, activeTab === 'authors' ? authorForm.id : bookForm.id),
        requestData: activeTab === 'authors' ? (operation === 'create' || operation === 'update' ? { nome: authorForm.nome, bio: authorForm.bio } : undefined) : (operation === 'create' || operation === 'update' ? bookForm : undefined),
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const getMethodForOperation = (op: string): string => {
    switch (op) {
      case 'list': case 'show': case 'books': return 'GET';
      case 'create': return 'POST';
      case 'update': return 'PUT';
      case 'delete': return 'DELETE';
      default: return 'GET';
    }
  };

  const getEndpointForOperation = (tab: string, op: string, id?: string): string => {
    const baseUrl = tab === 'authors' ? '/api/authors' : '/api/books';
    switch (op) {
      case 'list': return baseUrl;
      case 'create': return baseUrl;
      case 'show': case 'update': case 'delete': return `${baseUrl}/${id}`;
      case 'books': return `/api/authors/${id}/books`;
      default: return baseUrl;
    }
  };

  const clearForm = () => {
    setAuthorForm({ nome: '', bio: '', id: '' });
    setBookForm({ titulo: '', autor_id: '', ano_publicacao: '', paginas: '', genero: '', disponivel: true, id: '' });
    setErrors({});
  };

  const clearLogs = () => {
    setRequestLogs([]);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{ 
          margin: '0 0 12px 0',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(45deg, #fff, #e2e8f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: 'none'
        }}>
          🛠️ Testador Manual da API
        </h1>
        <p style={{ 
          margin: '0',
          fontSize: '1.1rem',
          opacity: '0.9',
          fontWeight: '400'
        }}>
          Teste os endpoints individualmente com formulários interativos
        </p>
      </div>
      
      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '24px',
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <button 
          onClick={() => { setActiveTab('authors'); setOperation('list'); clearForm(); }}
          style={{
            flex: 1,
            padding: '14px 24px',
            border: 'none',
            background: activeTab === 'authors' 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
              : 'transparent',
            color: activeTab === 'authors' ? 'white' : '#64748b',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'authors' ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
          }}
        >
          👤 Autores
        </button>
        <button 
          onClick={() => { setActiveTab('books'); setOperation('list'); clearForm(); }}
          style={{
            flex: 1,
            padding: '14px 24px',
            border: 'none',
            background: activeTab === 'books' 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
              : 'transparent',
            color: activeTab === 'books' ? 'white' : '#64748b',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'books' ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
          }}
        >
          📚 Livros
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Form Section */}
        <div style={{ 
          flex: 1, 
          background: 'white', 
          padding: '28px', 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: '0 0 24px 0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            ⚙️ Configurar Requisição
          </h3>
          
          {/* Operation Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              🎯 Operação:
            </label>
            <select 
              value={operation}
              onChange={(e) => { setOperation(e.target.value); clearForm(); }}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: '12px', 
                border: '2px solid #e5e7eb',
                fontSize: '16px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="list">Listar {activeTab === 'authors' ? 'Autores' : 'Livros'}</option>
              <option value="create">Criar {activeTab === 'authors' ? 'Autor' : 'Livro'}</option>
              <option value="show">Buscar por ID</option>
              <option value="update">Atualizar</option>
              <option value="delete">Excluir</option>
              {activeTab === 'authors' && <option value="books">Livros do Autor</option>}
            </select>
          </div>

          {/* Author Form */}
          {activeTab === 'authors' && (
            <>
              {(operation === 'show' || operation === 'update' || operation === 'delete' || operation === 'books') && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    🆔 ID do Autor:
                  </label>
                  <input
                    type="text"
                    value={authorForm.id}
                    onChange={(e) => setAuthorForm({...authorForm, id: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '12px', 
                      border: errors.id ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      fontSize: '16px',
                      background: 'white',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    placeholder="ex: 1"
                    onFocus={(e) => !errors.id && (e.target.style.borderColor = '#667eea')}
                    onBlur={(e) => !errors.id && (e.target.style.borderColor = '#e5e7eb')}
                  />
                  {errors.id && <span style={{ 
                    color: '#ef4444', 
                    fontSize: '13px',
                    fontWeight: '500',
                    marginTop: '4px',
                    display: 'block'
                  }}>{errors.id}</span>}
                </div>
              )}

              {(operation === 'create' || operation === 'update') && (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nome *:</label>
                    <input
                      type="text"
                      value={authorForm.nome}
                      onChange={(e) => setAuthorForm({...authorForm, nome: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: errors.nome ? '1px solid red' : '1px solid #ccc' 
                      }}
                      placeholder="Nome do autor (mín. 2, máx. 255 caracteres)"
                    />
                    {errors.nome && <span style={{ color: 'red', fontSize: '12px' }}>{errors.nome}</span>}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Biografia:</label>
                    <textarea
                      value={authorForm.bio}
                      onChange={(e) => setAuthorForm({...authorForm, bio: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: errors.bio ? '1px solid red' : '1px solid #ccc',
                        minHeight: '80px'
                      }}
                      placeholder="Biografia do autor (máx. 1000 caracteres)"
                    />
                    {errors.bio && <span style={{ color: 'red', fontSize: '12px' }}>{errors.bio}</span>}
                  </div>
                </>
              )}
            </>
          )}

          {/* Book Form */}
          {activeTab === 'books' && (
            <>
              {(operation === 'show' || operation === 'update' || operation === 'delete') && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>ID do Livro:</label>
                  <input
                    type="text"
                    value={bookForm.id}
                    onChange={(e) => setBookForm({...bookForm, id: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: errors.id ? '1px solid red' : '1px solid #ccc' 
                    }}
                    placeholder="ex: 1"
                  />
                  {errors.id && <span style={{ color: 'red', fontSize: '12px' }}>{errors.id}</span>}
                </div>
              )}

              {(operation === 'create' || operation === 'update') && (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Título *:</label>
                    <input
                      type="text"
                      value={bookForm.titulo}
                      onChange={(e) => setBookForm({...bookForm, titulo: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: errors.titulo ? '1px solid red' : '1px solid #ccc' 
                      }}
                      placeholder="Título do livro (mín. 2, máx. 255 caracteres)"
                    />
                    {errors.titulo && <span style={{ color: 'red', fontSize: '12px' }}>{errors.titulo}</span>}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>ID do Autor *:</label>
                    <input
                      type="text"
                      value={bookForm.autor_id}
                      onChange={(e) => setBookForm({...bookForm, autor_id: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: errors.autor_id ? '1px solid red' : '1px solid #ccc' 
                      }}
                      placeholder="ID do autor que escreveu o livro"
                    />
                    {errors.autor_id && <span style={{ color: 'red', fontSize: '12px' }}>{errors.autor_id}</span>}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Ano de Publicação:</label>
                    <input
                      type="text"
                      value={bookForm.ano_publicacao}
                      onChange={(e) => setBookForm({...bookForm, ano_publicacao: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: errors.ano_publicacao ? '1px solid red' : '1px solid #ccc' 
                      }}
                      placeholder={`ex: 2023 (mín. 1450, máx. ${new Date().getFullYear()})`}
                    />
                    {errors.ano_publicacao && <span style={{ color: 'red', fontSize: '12px' }}>{errors.ano_publicacao}</span>}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Páginas:</label>
                    <input
                      type="text"
                      value={bookForm.paginas}
                      onChange={(e) => setBookForm({...bookForm, paginas: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: errors.paginas ? '1px solid red' : '1px solid #ccc' 
                      }}
                      placeholder="ex: 350 (mínimo 1)"
                    />
                    {errors.paginas && <span style={{ color: 'red', fontSize: '12px' }}>{errors.paginas}</span>}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Gênero:</label>
                    <input
                      type="text"
                      value={bookForm.genero}
                      onChange={(e) => setBookForm({...bookForm, genero: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: errors.genero ? '1px solid red' : '1px solid #ccc' 
                      }}
                      placeholder="ex: Ficção (máx. 100 caracteres)"
                    />
                    {errors.genero && <span style={{ color: 'red', fontSize: '12px' }}>{errors.genero}</span>}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={bookForm.disponivel}
                        onChange={(e) => setBookForm({...bookForm, disponivel: e.target.checked})}
                      />
                      Disponível
                    </label>
                  </div>
                </>
              )}
            </>
          )}

          {/* Execute Button */}
          <button
            onClick={executeRequest}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading 
                ? '#94a3b8' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: loading 
                ? 'none' 
                : '0 4px 15px rgba(102, 126, 234, 0.4)',
              transform: loading ? 'none' : 'translateY(0)',
              marginBottom: '12px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            {loading ? '⏳ Executando...' : `🚀 Executar ${getMethodForOperation(operation)}`}
          </button>

          <button
            onClick={clearForm}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: '#64748b',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.background = 'transparent';
            }}
          >
            🧹 Limpar Formulário
          </button>
        </div>

        {/* Response Section */}
        <div style={{ 
          flex: 1, 
          background: 'white', 
          padding: '28px', 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px' 
          }}>
            <h3 style={{
              margin: '0',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              📋 Histórico de Requisições
            </h3>
            <button
              onClick={clearLogs}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
              }}
            >
              🗑️ Limpar
            </button>
          </div>

          <div style={{ 
            maxHeight: '600px', 
            overflowY: 'auto',
            border: '2px solid #f1f5f9',
            borderRadius: '12px',
            background: '#f8fafc'
          }}>
            {requestLogs.length === 0 ? (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center', 
                color: '#64748b',
                background: 'white',
                borderRadius: '10px',
                margin: '4px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                  Nenhuma requisição ainda
                </div>
                <div style={{ fontSize: '14px', opacity: '0.8' }}>
                  Configure uma operação e clique em "Executar"
                </div>
              </div>
            ) : (
              requestLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '16px',
                    margin: '8px',
                    background: log.error ? '#fef2f2' : '#f0fdf4',
                    borderRadius: '12px',
                    border: `2px solid ${log.error ? '#fecaca' : '#bbf7d0'}`,
                    borderLeft: `6px solid ${log.error ? '#ef4444' : '#22c55e'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '12px' 
                  }}>
                    <strong style={{ 
                      color: log.error ? '#dc2626' : '#16a34a',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}>
                      {log.method} {log.endpoint}
                    </strong>
                    <span style={{ 
                      fontSize: '12px', 
                      color: log.error ? '#dc2626' : '#16a34a',
                      background: log.error ? '#fee2e2' : '#dcfce7',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: '600',
                      border: `1px solid ${log.error ? '#fecaca' : '#bbf7d0'}`
                    }}>
                      {log.status} • {log.timestamp}
                    </span>
                  </div>
                  
                  {log.requestData && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#475569',
                        fontWeight: '600',
                        marginBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        📤 Request
                      </div>
                      <pre style={{
                        background: '#f1f5f9',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        overflow: 'auto',
                        margin: '0',
                        border: '1px solid #e2e8f0',
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                      }}>
                        {JSON.stringify(log.requestData, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {log.response && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#475569',
                        fontWeight: '600',
                        marginBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        📥 Response
                      </div>
                      <pre style={{
                        background: '#f1f5f9',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        overflow: 'auto',
                        margin: '0',
                        maxHeight: '200px',
                        border: '1px solid #e2e8f0',
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                      }}>
                        {JSON.stringify(log.response, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {log.error && (
                    <div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#dc2626',
                        fontWeight: '600',
                        marginBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        ❌ Erro
                      </div>
                      <div style={{
                        background: '#fee2e2',
                        padding: '12px',
                        borderRadius: '8px',
                        color: '#dc2626',
                        fontSize: '14px',
                        margin: '0',
                        border: '1px solid #fecaca',
                        fontWeight: '500'
                      }}>
                        {log.error}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualTester;