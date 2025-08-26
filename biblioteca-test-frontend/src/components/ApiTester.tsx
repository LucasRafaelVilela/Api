import React, { useState } from 'react';
import { TestRunner } from '../services/testRunner';
import type { TestReport as TestReportType, TestConfig } from '../types/api';
import ConfigForm from './ConfigForm';
import TestProgress from './TestProgress';
import TestReportComponent from './TestReport';

const ApiTester: React.FC = () => {
  const [config, setConfig] = useState<TestConfig>({
    baseUrl: 'http://localhost:8000',
    timeout: 10000,
    stopOnFirstError: false
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [report, setReport] = useState<TestReportType | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleConfigChange = (newConfig: TestConfig) => {
    setConfig(newConfig);
  };

  const runTests = async () => {
    setIsRunning(true);
    setHasStarted(true);
    setProgress(0);
    setProgressMessage('Iniciando testes...');
    setReport(null);

    try {
      const testRunner = new TestRunner(config);
      
      const testReport = await testRunner.runAllTests(
        (progress: number, message: string) => {
          setProgress(progress);
          setProgressMessage(message);
        }
      );

      setReport(testReport);
      setProgressMessage('Testes concluídos!');
    } catch (error: any) {
      setProgressMessage(`Erro: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetTests = () => {
    setReport(null);
    setHasStarted(false);
    setProgress(0);
    setProgressMessage('');
  };

  return (
    <div>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ 
          color: '#2c3e50',
          marginBottom: '10px',
          fontSize: '2.5em'
        }}>
          🧪 Testador de API Biblioteca
        </h1>
        <p style={{ 
          color: '#6c757d',
          fontSize: '1.1em',
          margin: '0'
        }}>
          Sistema de avaliação automática para APIs Laravel • Pontuação: 0-2 pontos
        </p>
      </header>

      {!hasStarted && (
        <ConfigForm 
          config={config}
          onChange={handleConfigChange}
          onStart={runTests}
          disabled={isRunning}
        />
      )}

      {hasStarted && (
        <TestProgress 
          progress={progress}
          message={progressMessage}
          isRunning={isRunning}
          onReset={resetTests}
        />
      )}

      {report && (
        <TestReportComponent 
          report={report}
          onRunAgain={runTests}
          onReset={resetTests}
        />
      )}
    </div>
  );
};

export default ApiTester;