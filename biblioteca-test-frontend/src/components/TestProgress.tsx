import React from 'react';

interface TestProgressProps {
  progress: number;
  message: string;
  isRunning: boolean;
  onReset: () => void;
}

const TestProgress: React.FC<TestProgressProps> = ({ progress, message, isRunning, onReset }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '10px',
      border: '1px solid #e9ecef',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        color: '#495057',
        marginBottom: '20px',
        fontSize: '1.5em'
      }}>
        {isRunning ? '⏳ Executando Testes...' : '✅ Testes Concluídos'}
      </h2>

      {/* Barra de progresso */}
      <div style={{
        backgroundColor: '#e9ecef',
        height: '20px',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '15px',
        border: '1px solid #ced4da'
      }}>
        <div style={{
          backgroundColor: isRunning ? '#007bff' : '#28a745',
          height: '100%',
          width: `${progress}%`,
          borderRadius: '10px',
          transition: 'width 0.3s ease-in-out, background-color 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '12px'
        }}>
          {progress > 10 && `${Math.round(progress)}%`}
        </div>
      </div>

      {/* Mensagem de status */}
      <div style={{
        padding: '15px',
        backgroundColor: isRunning ? '#e3f2fd' : '#f8f9fa',
        borderRadius: '6px',
        marginBottom: '20px',
        border: `1px solid ${isRunning ? '#bbdefb' : '#e9ecef'}`
      }}>
        <span style={{ 
          color: isRunning ? '#1976d2' : '#495057',
          fontSize: '16px'
        }}>
          {isRunning && '🔄'} {message}
        </span>
      </div>

      {/* Spinner quando está executando */}
      {isRunning && (
        <div style={{ 
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Lista de etapas */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '6px',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          fontSize: '1.1em',
          marginBottom: '10px',
          color: '#495057'
        }}>
          📝 Etapas do Teste:
        </h3>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          <div style={{ 
            marginBottom: '5px',
            color: progress >= 10 ? '#28a745' : '#6c757d'
          }}>
            {progress >= 10 ? '✅' : '⏳'} Conexão com API
          </div>
          <div style={{ 
            marginBottom: '5px',
            color: progress >= 50 ? '#28a745' : '#6c757d'
          }}>
            {progress >= 50 ? '✅' : progress >= 10 ? '⏳' : '⏸️'} Testes de Autores
          </div>
          <div style={{ 
            marginBottom: '5px',
            color: progress >= 90 ? '#28a745' : '#6c757d'
          }}>
            {progress >= 90 ? '✅' : progress >= 50 ? '⏳' : '⏸️'} Testes de Livros
          </div>
          <div style={{ 
            color: progress >= 100 ? '#28a745' : '#6c757d'
          }}>
            {progress >= 100 ? '✅' : progress >= 90 ? '⏳' : '⏸️'} Cálculo da Pontuação
          </div>
        </div>
      </div>

      {/* Botão de voltar (só quando não está executando) */}
      {!isRunning && (
        <button
          onClick={onReset}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '12px 24px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
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
          ⬅️ Voltar para Configuração
        </button>
      )}
    </div>
  );
};

export default TestProgress;