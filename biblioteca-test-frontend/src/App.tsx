import React, { useState } from 'react';
import ApiTester from './components/ApiTester';
import ManualTester from './components/ManualTester';
import { ApiClient } from './services/apiClient';
import './App.css'

function App() {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [apiClient] = useState(() => new ApiClient('http://localhost:8000'));

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>
        Sistema de Testes API Biblioteca
      </h1>
      
      {/* Mode Selector */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2em',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <strong>Escolha o modo de teste:</strong>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => setMode('auto')}
            style={{
              padding: '12px 24px',
              background: mode === 'auto' ? '#007bff' : 'white',
              color: mode === 'auto' ? 'white' : '#007bff',
              border: '2px solid #007bff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            🤖 Testes Automáticos
          </button>
          <button
            onClick={() => setMode('manual')}
            style={{
              padding: '12px 24px',
              background: mode === 'manual' ? '#28a745' : 'white',
              color: mode === 'manual' ? 'white' : '#28a745',
              border: '2px solid #28a745',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            🛠️ Testes Manuais
          </button>
        </div>
        <div style={{ 
          marginTop: '10px', 
          fontSize: '14px', 
          color: '#666' 
        }}>
          {mode === 'auto' 
            ? 'Executa todos os testes automaticamente e gera relatório de pontuação'
            : 'Permite testar endpoints individuais com formulários personalizados'
          }
        </div>
      </div>

      {/* Render appropriate component */}
      {mode === 'auto' ? (
        <ApiTester />
      ) : (
        <ManualTester apiClient={apiClient} />
      )}
    </div>
  );
}

export default App
