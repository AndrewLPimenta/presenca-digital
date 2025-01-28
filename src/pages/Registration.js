import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../index.css';

function Registration() {
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [alunos, setAlunos] = useState([]); // Estado para armazenar a lista de alunos

    // Função para carregar os alunos
    const loadAlunos = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/alunos');
            const data = await response.json();
            setAlunos(data); // Atualiza o estado com a lista de alunos
        } catch (error) {
            setMessage('Erro ao carregar alunos.');
        }
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validação para garantir que a matrícula tenha exatamente 9 caracteres
        if (matricula.length !== 9) {
            setMessage('A matrícula deve ter exatamente 9 caracteres.');
            setSuccess(false);
            return;
        }

        if (!nome || !matricula) {
            setMessage('Nome e matrícula são obrigatórios.');
            setSuccess(false);
            return;
        }

        const aluno = { nome, matricula };

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aluno),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setMessage(data.message);
                loadAlunos(); // Carregar a lista de alunos após o registro
            } else {
                setSuccess(false);
                setMessage(data.message);
            }
        } catch (error) {
            setSuccess(false);
            setMessage('Erro ao registrar aluno. Tente novamente.');
        }
    };

    // Carregar os alunos assim que o componente for montado
    useEffect(() => {
        loadAlunos();
    }, []);

    return (
        <main>
            <Header />
            <div className="form-container">
            <div className="welcome-message">
              <h1 className="welcome-h1">Bem-vindo(a) ao Gestão de Presença Digital cadastre-se para desfrutar de nossa tecnologia!.</h1>
              <h5 className="welcome-p">Basta inserir seu Nome e Sua Matrícula!</h5>
            </div>

                <form className="form" onSubmit={handleSubmit}>
                    <span className="heading">Registrar Aluno</span>

                    <div className="form-group">
                        <input
                            className="form-input"
                            required
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <label>Nome Completo</label>
                    </div>

                    <div className="form-group">
                        <input
                            className="form-input"
                            required
                            type="text"
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                        />
                        <label>Matrícula (9 caracteres)</label>
                    </div>

                    <button type="submit">Registrar</button>

                    {message && (
                        <div className={success ? 'success-message' : 'error-message'}>
                            {message}
                        </div>
                    )}
                    <div className="alunos-list">
                        <h2>Alunos já Registrados</h2>
                        <ul>
                            {alunos.map((aluno, index) => (
                                <li key={index}>
                                    {aluno.nome} - <span className="blurred-matricula">{aluno.matricula}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </form>
            </div>


        </main>
    );
}

export default Registration;
