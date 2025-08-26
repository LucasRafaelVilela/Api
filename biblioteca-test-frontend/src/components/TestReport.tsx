import React, { useState } from 'react';
import type { TestReport as TestReportType } from '../types/api';
import { TestRunner } from '../services/testRunner';

interface TestReportProps {
  report: TestReportType;
  onRunAgain: () => void;
  onReset: () => void;
}

const TestReport: React.FC<TestReportProps> = ({ report, onRunAgain, onReset }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'suggestions'>('summary');
  const [expandedTest, setExpandedTest] = useState<number | null>(null);

  const getGradeColor = (grade: number): string => {
    if (grade >= 1.7) return '#28a745'; // Verde
    if (grade >= 1.0) return '#ffc107'; // Amarelo
    return '#dc3545'; // Vermelho
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  };

  const downloadReport = () => {
    const testRunner = new TestRunner({ baseUrl: '', timeout: 0, stopOnFirstError: false });
    const content = testRunner.generateTextSummary(report);
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-api-biblioteca-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const suggestions = React.useMemo(() => {
    const testRunner = new TestRunner({ baseUrl: '', timeout: 0, stopOnFirstError: false });
    return testRunner.generateSuggestions(report);
  }, [report]);

  return (
    <div className="slide-in" style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: 'none',
      marginBottom: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      overflow: 'hidden'
    }}>
      {/* Header com nota */}
      <div style={{
        backgroundColor: getGradeColor(report.grade),
        color: 'white',
        padding: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '2.5em',
          margin: '0 0 10px 0',
          fontWeight: 'bold'
        }}>
          {report.grade}/2.0
        </h2>
        <p style={{ 
          fontSize: '1.2em',
          margin: '0',
          opacity: 0.9
        }}>
          {report.percentage.toFixed(1)}% dos testes aprovados
        </p>
      </div>

      {/* Estatísticas resumidas */}
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2em', color: '#28a745' }}>✅</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{report.summary.passed}</div>
            <div style={{ color: '#6c757d' }}>Aprovados</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2em', color: '#dc3545' }}>❌</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{report.summary.failed}</div>
            <div style={{ color: '#6c757d' }}>Falharam</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2em', color: '#ffc107' }}>⚠️</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{report.summary.warnings}</div>
            <div style={{ color: '#6c757d' }}>Avisos</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2em', color: '#007bff' }}>📊</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{report.totalScore}/{report.maxScore}</div>
            <div style={{ color: '#6c757d' }}>Pontos</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e9ecef'
      }}>
        {[
          { key: 'summary', label: '📋 Resumo', count: '' },
          { key: 'details', label: '🔍 Detalhes', count: `(${report.tests.length})` },
          { key: 'suggestions', label: '💡 Sugestões', count: `(${suggestions.length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              flex: 1,
              padding: '15px',
              border: 'none',
              backgroundColor: activeTab === tab.key ? '#007bff' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#6c757d',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
              transition: 'all 0.3s'
            }}
          >
            {tab.label} {tab.count}
          </button>
        ))}
      </div>

      {/* Conteúdo das tabs */}
      <div style={{ padding: '20px' }}>
        {activeTab === 'summary' && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#495057' }}>📊 Resumo Geral</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ color: '#495057', marginBottom: '15px' }}>🎯 Avaliação</h4>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                  <strong>Nota Final:</strong> <span style={{ color: getGradeColor(report.grade) }}>{report.grade}/2.0</span>
                </div>
                <div style={{ fontSize: '16px', color: '#6c757d' }}>
                  {report.percentage >= 90 ? '🏆 Excelente implementação!' :
                   report.percentage >= 70 ? '👍 Boa implementação!' :
                   report.percentage >= 50 ? '⚠️ Implementação parcial' :
                   '🚨 Necessita melhorias significativas'}
                </div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ color: '#495057', marginBottom: '15px' }}>📈 Performance</h4>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '5px'
                  }}>
                    <span>Taxa de Sucesso:</span>
                    <span style={{ fontWeight: 'bold' }}>{report.percentage.toFixed(1)}%</span>
                  </div>
                  <div style={{
                    backgroundColor: '#e9ecef',
                    height: '8px',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: getGradeColor(report.grade),
                      height: '100%',
                      width: `${report.percentage}%`,
                      borderRadius: '4px',
                      transition: 'width 0.3s'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #bbdefb'
            }}>
              <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>🎓 Critérios de Avaliação</h4>
              <div style={{ color: '#1976d2', lineHeight: '1.6' }}>
                <div>• <strong>Funcionalidade Básica (50%):</strong> Endpoints funcionando corretamente</div>
                <div>• <strong>Validações (30%):</strong> Campos obrigatórios e regras de validação</div>
                <div>• <strong>Regras de Negócio (20%):</strong> Duplicidade, exclusões com restrições</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#495057' }}>🔍 Detalhes dos Testes</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setExpandedTest(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                {expandedTest !== null ? '📄 Recolher Todos' : '📋 Expandir Todos'}
              </button>
            </div>

            {report.tests.map((test, index) => (
              <div key={index} style={{
                marginBottom: '15px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{
                    padding: '15px',
                    backgroundColor: test.status === 'pass' ? '#d4edda' : 
                                   test.status === 'fail' ? '#f8d7da' : '#fff3cd',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => setExpandedTest(expandedTest === index ? null : index)}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '18px', marginRight: '10px' }}>
                      {getStatusIcon(test.status)}
                    </span>
                    <strong>{test.method}</strong> {test.endpoint}
                    <div style={{ 
                      fontSize: '14px',
                      color: '#6c757d',
                      marginTop: '5px'
                    }}>
                      {test.message}
                    </div>
                  </div>
                  <div style={{ 
                    textAlign: 'right',
                    marginLeft: '15px'
                  }}>
                    <div style={{ 
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: test.status === 'pass' ? '#155724' : '#721c24'
                    }}>
                      {test.score}/{test.maxScore}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                      {expandedTest === index ? '🔽' : '▶️'}
                    </div>
                  </div>
                </div>

                {expandedTest === index && (
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #e9ecef'
                  }}>
                    {/* Sempre mostrar detalhes primeiro se existirem */}
                    {test.details && (
                      <div style={{ marginBottom: '20px' }}>
                        <strong style={{ color: '#dc3545', fontSize: '16px' }}>
                          🔍 Diagnóstico do Problema:
                        </strong>
                        <div style={{
                          backgroundColor: '#fff3cd',
                          border: '1px solid #ffeaa7',
                          borderRadius: '6px',
                          padding: '15px',
                          marginTop: '10px',
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          color: '#856404'
                        }}>
                          {test.details}
                        </div>
                      </div>
                    )}

                    {test.request && (
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{
                          backgroundColor: '#e3f2fd',
                          color: '#1565c0',
                          padding: '8px 12px',
                          borderRadius: '6px 6px 0 0',
                          border: '1px solid #90caf9',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          📤 Dados Enviados
                        </div>
                        <pre style={{
                          backgroundColor: '#263238',
                          color: '#80cbc4',
                          padding: '15px',
                          borderRadius: '0 0 6px 6px',
                          border: '1px solid #90caf9',
                          borderTop: 'none',
                          fontSize: '13px',
                          overflow: 'auto',
                          margin: '0',
                          maxHeight: '200px',
                          fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                          lineHeight: '1.4',
                          textAlign: 'left'
                        }}>
                          {JSON.stringify(test.request, null, 2)}
                        </pre>
                      </div>
                    )}

                    {test.response && (
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{
                          backgroundColor: '#e8f5e8',
                          color: '#2e7d32',
                          padding: '8px 12px',
                          borderRadius: '6px 6px 0 0',
                          border: '1px solid #81c784',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          📥 Resposta Recebida
                        </div>
                        <pre style={{
                          backgroundColor: '#1e1e1e',
                          color: '#a5d6a7',
                          padding: '15px',
                          borderRadius: '0 0 6px 6px',
                          border: '1px solid #81c784',
                          borderTop: 'none',
                          fontSize: '13px',
                          overflow: 'auto',
                          margin: '0',
                          maxHeight: '200px',
                          fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                          lineHeight: '1.4',
                          textAlign: 'left'
                        }}>
                          {JSON.stringify(test.response, null, 2)}
                        </pre>
                      </div>
                    )}

                    {test.expected && (
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{
                          backgroundColor: '#fff3e0',
                          color: '#ef6c00',
                          padding: '8px 12px',
                          borderRadius: '6px 6px 0 0',
                          border: '1px solid #ffb74d',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          🎯 O que eu estava esperando
                        </div>
                        <pre style={{
                          backgroundColor: '#2e1a0a',
                          color: '#ffcc80',
                          padding: '15px',
                          borderRadius: '0 0 6px 6px',
                          border: '1px solid #ffb74d',
                          borderTop: 'none',
                          fontSize: '13px',
                          overflow: 'auto',
                          margin: '0',
                          maxHeight: '200px',
                          fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                          lineHeight: '1.4',
                          textAlign: 'left'
                        }}>
                          {typeof test.expected === 'string' ? test.expected : JSON.stringify(test.expected, null, 2)}
                        </pre>
                      </div>
                    )}

                    {test.error && (
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{
                          backgroundColor: '#ffebee',
                          color: '#c62828',
                          padding: '8px 12px',
                          borderRadius: '6px 6px 0 0',
                          border: '1px solid #ef9a9a',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          🚨 Erro Técnico
                        </div>
                        <div style={{
                          backgroundColor: '#2d1b1b',
                          color: '#ffcdd2',
                          padding: '15px',
                          borderRadius: '0 0 6px 6px',
                          border: '1px solid #ef9a9a',
                          borderTop: 'none',
                          fontSize: '13px',
                          fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                          wordBreak: 'break-all',
                          lineHeight: '1.4',
                          textAlign: 'left'
                        }}>
                          {test.error}
                        </div>
                      </div>
                    )}

                    {/* Rodapé com dica de teste manual */}
                    <div style={{
                      marginTop: '20px',
                      padding: '10px',
                      backgroundColor: '#d1ecf1',
                      border: '1px solid #b8daff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#0c5460'
                    }}>
                      <strong>💡 Teste Manual:</strong> 
                      {test.method === 'GET' ? (
                        <span> Acesse <code>http://localhost:8000{test.endpoint}</code> no navegador</span>
                      ) : (
                        <span> Use Postman/Insomnia: <code>{test.method} http://localhost:8000{test.endpoint}</code></span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#495057' }}>💡 Sugestões de Melhoria</h3>
            
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#856404', marginBottom: '15px' }}>🎯 Próximos Passos</h4>
              {suggestions.length > 0 ? (
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
                  {suggestions.map((suggestion, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>{suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#856404', margin: '0' }}>
                  🎉 Parabéns! Sua implementação está funcionando perfeitamente!
                </p>
              )}
            </div>

            <div style={{
              backgroundColor: '#d1ecf1',
              border: '1px solid #b8daff',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h4 style={{ color: '#0c5460', marginBottom: '15px' }}>📚 Recursos Úteis</h4>
              <div style={{ color: '#0c5460', lineHeight: '1.6' }}>
                <div>• Revisar a documentação da API no arquivo API_Biblioteca_Basica.md</div>
                <div>• Verificar validações Laravel: php artisan make:request</div>
                <div>• Implementar Resources para padronizar JSON: php artisan make:resource</div>
                <div>• Usar status codes corretos: return response()-&gt;json($data, 201)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botões de ação */}
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onRunAgain}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#0056b3';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#007bff';
          }}
        >
          🔄 Executar Novamente
        </button>

        <button
          onClick={downloadReport}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#218838';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#28a745';
          }}
        >
          📥 Baixar Relatório
        </button>

        <button
          onClick={onReset}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#5a6268';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#6c757d';
          }}
        >
          ⬅️ Nova Configuração
        </button>
      </div>
    </div>
  );
};

export default TestReport;