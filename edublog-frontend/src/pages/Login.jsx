import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// --- ANIMAÇÕES ---
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- ESTILOS (Styled Components) ---
const Container = styled.div`
  min-height: 100vh;
  background-color: #121212;
  background-image: radial-gradient(circle at center, #1e1e1e 0%, #121212 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
`;

const LoginBox = styled.div`
  background-color: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(10px);
  padding: 3rem 2.5rem;
  border-radius: 12px;
  border-top: 4px solid #D4AF37;
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  width: 100%;
  max-width: 420px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const HeaderWrapper = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #D4AF37;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  color: #ccc;
  font-size: 0.85rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  border-radius: 6px;
  border: 1px solid #333;
  background-color: rgba(20, 20, 20, 0.9);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #D4AF37;
    box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
  }
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.9rem;
  background: linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%);
  color: #121212;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
    background: linear-gradient(135deg, #e6be42, #b5952f);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 77, 77, 0.1);
  border: 1px solid rgba(255, 77, 77, 0.3);
  color: #ff6b6b;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
`;

const HintBox = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.8rem;
  color: #777;
  text-align: center;
  line-height: 1.4;
`;

// --- COMPONENTE PRINCIPAL ---
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    let role = '';
    let displayName = '';

    // Validação dos perfis (2 docentes e 1 professor administrador)
    if (username === 'docente1' && password === '123456') {
      role = 'docente';
      displayName = 'Docente Ana';
    } else if (username === 'docente2' && password === '123456') {
      role = 'docente';
      displayName = 'Docente Carlos';
    } else if (username === 'professor' && password === 'admin123') {
      role = 'professor'; // Acesso total
      displayName = 'Prof. Coordenador';
    } else {
      setError('Usuário ou senha incorretos. Tente novamente.');
      return;
    }

    // Salva os dados completos da sessão no navegador
    localStorage.setItem('edublog_user', JSON.stringify({ username, role, displayName }));
    
    // Redireciona para o painel administrativo
    navigate('/admin');
  };

  return (
    <Container>
      <LoginBox>
        <HeaderWrapper>
          <Title>EduBlog</Title>
          <Subtitle>Acesso Restrito ao Corpo Docente</Subtitle>
        </HeaderWrapper>

        <Form onSubmit={handleLogin}>
          <InputGroup>
            <Label>Usuário</Label>
            <Input 
              type="text" 
              placeholder="ex: docente1, docente2 ou professor" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Senha</Label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit">Entrar no Sistema</Button>
        </Form>

        <HintBox>
          <strong>Dica de acesso:</strong><br/>
          Docentes: <code>docente1</code> / <code>docente2</code> (Senha: <code>123456</code>)<br/>
          Professor: <code>professor</code> (Senha: <code>admin123</code>)
        </HintBox>
      </LoginBox>
    </Container>
  );
}