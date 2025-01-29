import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ListForm = () => {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [isQRCodeScanned, setIsQRCodeScanned] = useState(false);
  const [isAlunoVerificado, setIsAlunoVerificado] = useState(false);
  const [alunos, setAlunos] = useState([]);  // Lista de alunos simulada ou vinda de uma API
  const [qrCodeMessage, setQrCodeMessage] = useState('');  // Mensagem para mostrar ao clicar no botão de QR Code

  // Função para buscar alunos API
  const buscarAlunos = async () => {
    try {
      const response = await axios.get('https://precenca-digital-back-end-ixgy.vercel.app/api/alunos');
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setErrorMessage('Erro ao buscar alunos');
    }
  };

  // Função para verificar se o aluno existe API
  const verificarAluno = () => {
    const alunoExistente = alunos.find(aluno => aluno.matricula === matricula);

    if (alunoExistente) {
      setNome(alunoExistente.nome);  // Preenche o nome do aluno
      setIsAlunoVerificado(true);
      setErrorMessage('');
      setSuccessMessage('');
    } else {
      setNome('');
      setIsAlunoVerificado(false);
      setErrorMessage('Aluno não encontrado.');
      setSuccessMessage('');
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!matricula && !qrCode) {
      setErrorMessage('Você precisa escanear o QR Code ou inserir a matrícula manualmente.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post('https://precenca-digital-back-end-2998-6juewadp3.vercel.app/api/register', {
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
      setQrCode(null);
      setIsQRCodeScanned(false);
    } catch (error) {
      setErrorMessage('Erro ao marcar a presença.');
      setSuccessMessage('');
    }
  };

  // Função simulada para escanear o QR Code
  const handleQRCodeScan = () => {
    // Exibe a mensagem de "Em breve!" quando o botão for clicado
    setQrCodeMessage('Em breve!');
  };

  // Efeito para verificar aluno ao alterar matrícula
  useEffect(() => {
    if (matricula.length > 0) {
      verificarAluno();
    }
  }, [matricula]);

  // Carregar alunos ao montar o componente
  useEffect(() => {
    buscarAlunos();
  }, []);

  return (
    <main>
      <StyledWrapper>
        <div className="form-container">
          <form className="form" onSubmit={handleSubmit}>
            <div className="welcome-message">
              <h1 className="welcome-h1">Bem-vindo.</h1>
              <h2 className="welcome-h1">Agora é só me dizer quem você é e sua matrícula para marcar sua presença!</h2>
              <p className="welcome-p">Diga adeus ao papel e caneta.</p>
            </div>

            <span className="heading">Marcar Presença</span>

            <div className="form-group">
              <input
                className="form-input"
                required
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                onBlur={verificarAluno}  // Verifica o aluno ao sair do campo matrícula
              />
              <label>Matrícula</label>
            </div>

            <div className="form-group">
              <input
                className="form-input"
                type="text"
                value={nome}
                readOnly
                disabled
              />
              <label>Nome</label>
            </div>

            {isAlunoVerificado && (
              <div className="success-message">Aluno verificado: {nome}</div>
            )}

            <div className="qr-scanner">
              <button
                type="button"
                className="qr-button"
                onClick={handleQRCodeScan}
                disabled={!isAlunoVerificado}
              >
                Ler QR-Code
              </button>

              {/* Exibe a mensagem de "Em breve!" */}
              {qrCodeMessage && (
                <div className="qr-message">
                  <p>{qrCodeMessage}</p>
                </div>
              )}
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
    padding-top: 2rem;
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
    padding-top: 1.2rem;
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
    flex-direction: column;
    border-radius: 5px;
    background-color: #212121;
    padding: 0.2rem;
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

  .qr-message {
    color: #ff9800;
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
  }
`;

export default ListForm;
