import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { BrowserMultiFormatReader } from '@zxing/library'; // Importa a biblioteca para leitura do QR Code

const ListForm = () => {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [qrCode, setQrCode] = useState(null); // Variável para armazenar o QR code lido
  const [isQRCodeScanned, setIsQRCodeScanned] = useState(false); // Para saber se o QR code foi lido
  const [isAlunoVerificado, setIsAlunoVerificado] = useState(false); // Verifica se o aluno foi encontrado

  // Função para verificar se o aluno está no banco de dados
  const verificarAluno = async () => {
    if (!matricula) return;

    try {
      const response = await axios.post('http://localhost:3000/api/verify-student', {
        matricula,
      });

      if (response.data.success) {
        setNome(response.data.nome);
        setIsAlunoVerificado(true);
        setErrorMessage('');
        setSuccessMessage('Aluno verificado com sucesso!');
      } else {
        setErrorMessage('Aluno não encontrado.');
        setIsAlunoVerificado(false);
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Erro ao verificar aluno.');
      setSuccessMessage('');
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Se o QR Code foi lido, a matrícula já está preenchida automaticamente
    if (!matricula && !qrCode) {
      setErrorMessage('Você precisa escanear o QR Code ou inserir a matrícula manualmente.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/mark-attendance', {
        matricula: qrCode || matricula,
        nome,
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setErrorMessage('');
      } else {
        setErrorMessage(response.data.message);
        setSuccessMessage('');
      }

      // Limpar os campos após o envio
      setNome('');
      setMatricula('');
      setQrCode(null); // Limpar QR Code lido
      setIsQRCodeScanned(false); // Resetar a flag do QR Code
    } catch (error) {
      setErrorMessage('Erro ao marcar a presença.');
      setSuccessMessage('');
    }
  };

  // Função para processar a leitura do QR Code
  const handleScan = (result) => {
    if (result) {
      setQrCode(result.getText());
      setIsQRCodeScanned(true);
      setErrorMessage('');
      setSuccessMessage('QR Code lido com sucesso!');
    }
  };

  const handleError = (err) => {
    setErrorMessage('Erro ao escanear QR Code.');
    setSuccessMessage('');
  };

  // Função para iniciar o scanner de QR Code
  const startScanner = () => {
    if (!isAlunoVerificado) {
      setErrorMessage('Você precisa verificar o aluno antes de iniciar a leitura do QR Code.');
      return;
    }

    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(null, 'video', (result, error) => {
        if (result) {
          handleScan(result);
        }
        if (error) {
          handleError(error);
        }
      })
      .catch(handleError);
  };

  // Efeito para verificar aluno ao alterar matrícula
  useEffect(() => {
    if (matricula.length > 0) {
      verificarAluno();
    }
  }, [matricula]);

  return (
    <main>
      <StyledWrapper>
        <div className="form-container">
          <form className="form" onSubmit={handleSubmit}>
            <div className="welcome-message">
              <h1 className="welcome-h1">Bem-vindo.</h1>
              <p className="welcome-p">Agora é só me dizer quem você é e sua matrícula para marcar sua presença!</p>
            </div>

            <span className="heading">Marcar Presença</span>

            <div className="form-group">
              <input
                className="form-input"
                required
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                onBlur={verificarAluno} // Verifica o aluno ao sair do campo matrícula
              />
              <label>Matrícula</label>
            </div>

            {/* Nome será preenchido automaticamente após verificação do aluno */}
            <div className="form-group">
              <input
                className="form-input"
                type="text"
                value={nome}
                readOnly
                disabled // Nome só pode ser visualizado depois da verificação
              />
              <label>Nome</label>
            </div>

            {isAlunoVerificado && (
              <div className="success-message">Aluno verificado: {nome}</div>
            )}

            {/* Se o QR Code não foi lido, mostrar a opção para escanear */}
            <div className="qr-scanner">
              <button
                type="button"
                className="qr-button"
                onClick={startScanner}
                disabled={!isAlunoVerificado} // Botão de QR Code só pode ser clicado após verificação
              >
                Iniciar Leitura de QR Code
              </button>
              <div id="video" style={{}} />
            </div>

            <button type="submit" disabled={!isQRCodeScanned && !matricula}>
              Marcar Presença
            </button>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </form>
        </div>
      </StyledWrapper>
    </main>
  );
};

const StyledWrapper = styled.div`
  .form-container {
    background: linear-gradient(#212121, #212121) padding-box,
      linear-gradient(120deg, transparent 25%, #1cb0ff, #40ff99) border-box;
    border: 2px solid transparent;
    padding: 32px 24px;
    font-size: 14px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    border-radius: 16px;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .heading {
    font-size: 20px;
    font-weight: 600;
  }

  .form-input {
    color: white;
    background: transparent;
    border: 1px solid #414141;
    border-radius: 5px;
    padding: 8px;
    outline: none;
  }

  button {
    border-radius: 5px;
    padding: 6px;
    background: #ffffff14;
    color: #c7c5c5;
    border: 1px solid #414141;
  }

  button:hover {
    background: #212121;
    cursor: pointer;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: #414141;
    position: relative;
  }

  .form-group label {
    position: absolute;
    top: 0;
    left: 0;
    padding: 5px;
    pointer-events: none;
    transition: 0.5s;
  }

  .form-group input:focus ~ label,
  .form-group input:valid ~ label {
    top: -16px;
    left: 0;
    background: #212121 padding-box;
    padding: 10px 0 0 0;
    color: #bdb8b8;
    font-size: 12px;
  }

  .qr-scanner {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 5px;
    background-color: #212121;
    padding: 2rem;
    justify-content: center;
  }

  .qr-button {
    border-radius: 5px;
    padding: 12px;
    background: #1cb0ff;
    color: white;
    border: 1px solid #414141;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;
  }

  .qr-button:hover {
    background: #40ff99;
  }

  .qr-button:disabled {
    background: #6c6c6c;
    cursor: not-allowed;
  }

  .success-message {
    color: #1cb0ff;
    font-size: 16px;
    font-weight: 600;
  }

  .error-message {
    color: #d81d1d;
    font-size: 16px;
    font-weight: 600;
  }
`;

export default ListForm;
