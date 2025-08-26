import React, { useState } from 'react';
import type { TestConfig } from '../types/api';

interface ConfigFormProps {
  config: TestConfig;
  onChange: (config: TestConfig) => void;
  onStart: () => void;
  disabled: boolean;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ config, onChange, onStart, disabled }) => {
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valida URL
    try {
      new URL(baseUrl);
    } catch {
      alert('URL inválida. Use formato: http://localhost:8000');
      return;
    }

    onChange({
      ...config,
      baseUrl: baseUrl.replace(/\/$/, '') // Remove barra final
    });
    
    onStart();
  };

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
        ⚙️ Configuração da API
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#495057'
          }}>
            URL Base da API Laravel:
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://localhost:8000"
            required
            disabled={disabled}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ced4da',
              borderRadius: '6px',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ced4da'}
          />
          <small style={{ 
            color: '#6c757d',
            fontSize: '14px',
            marginTop: '5px',
            display: 'block'
          }}>
            Exemplo: http://localhost:8000 ou https://sua-api.com
          </small>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ 
            color: '#495057',
            fontSize: '1.1em',
            marginBottom: '10px'
          }}>
            📋 O que será testado:
          </h3>
          <ul style={{ 
            margin: '0',
            paddingLeft: '20px',
            color: '#6c757d'
          }}>
            <li><strong>Autores:</strong> CRUD completo + validações (0.8 pontos)</li>
            <li><strong>Livros:</strong> CRUD completo + regras de negócio (0.8 pontos)</li>
            <li><strong>Estrutura:</strong> Códigos HTTP + JSON padronizado (0.4 pontos)</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={disabled || !baseUrl}
          style={{
            backgroundColor: disabled ? '#6c757d' : '#28a745',
            color: 'white',
            padding: '15px 30px',
            fontSize: '18px',
            border: 'none',
            borderRadius: '6px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            width: '100%',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => {
            if (!disabled) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#218838';
            }
          }}
          onMouseOut={(e) => {
            if (!disabled) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#28a745';
            }
          }}
        >
          {disabled ? '⏳ Executando...' : '🚀 Executar Testes'}
        </button>
      </form>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '6px'
      }}>
        <strong style={{ color: '#856404' }}>💡 Dica:</strong>
        <span style={{ color: '#856404', marginLeft: '8px' }}>
          Certifique-se de que sua API Laravel está rodando e acessível na URL informada antes de executar os testes.
        </span>
      </div>
    </div>
  );
};

export default ConfigForm;