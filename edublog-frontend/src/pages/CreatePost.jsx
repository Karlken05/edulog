import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../services/api';

// --- ANIMAÇÕES ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// --- ESTILOS SOPHISTICATED & LUXURY ---
const Container = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a1a1a 0%, #0d0d0d 100%);
  color: #f3f3f3;
  padding: 3rem 2rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BackLink = styled(Link)`
  align-self: flex-start;
  max-width: 700px;
  width: 100%;
  margin: 0 auto 1.5rem auto;
  color: #888;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;

  &:hover {
    color: #d4af37;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  background: rgba(25, 25, 25, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
  }
`;

const Title = styled.h1`
  color: #f5f5f5;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #fff 0%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.8rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #d4af37;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const Input = styled.input`
  padding: 1rem 1.2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(20, 20, 20, 0.8);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #d4af37;
    box-shadow: 0 0 12px rgba(212, 175, 55, 0.25);
  }
`;

const TextArea = styled.textarea`
  padding: 1rem 1.2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(20, 20, 20, 0.8);
  color: #fff;
  font-size: 1rem;
  min-height: 180px;
  resize: vertical;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #d4af37;
    box-shadow: 0 0 12px rgba(212, 175, 55, 0.25);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%);
  color: #121212;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
    background: linear-gradient(135deg, #e5be40, #bc9930);
  }

  &:active {
    transform: translateY(0);
  }
`;

// --- CARTA / CARD DE AGRADECIMENTO FLUTUANTE ---
const WelcomeCardOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const WelcomeModal = styled.div`
  background: linear-gradient(145deg, rgba(30, 30, 30, 0.95), rgba(15, 15, 15, 0.98));
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 480px;
  width: 90%;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.2);
  animation: ${slideIn} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const ModalBadge = styled.div`
  color: #d4af37;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.8rem;
  font-weight: 700;
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  color: #aaa;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ModalButtonPrimary = styled.button`
  background: linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%);
  color: #121212;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
    background: linear-gradient(135deg, #e5be40, #bc9930);
  }
`;

const ModalButtonSecondary = styled.button`
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    background: rgba(212, 175, 55, 0.1);
  }
`;

// --- COMPONENTE PRINCIPAL ---
export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', { title, author, content });
      // Exibe a carta sofisticada de agradecimento ao docente
      setShowWelcomeModal(true);
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
      alert('Erro ao publicar artigo. Verifique os dados.');
    }
  };

  const handleGoToAdmin = () => {
    setShowWelcomeModal(false);
    navigate('/admin'); // Retorna direto para o painel administrativo
  };

  const handleGoToHome = () => {
    setShowWelcomeModal(false);
    navigate('/'); // Vai para o feed principal
  };

  return (
    <Container>
      <BackLink to="/admin">← Voltar para o Painel Administrativo</BackLink>
      
      <FormWrapper>
        <Title>Nova Postagem</Title>
        <Subtitle>Publique conteúdos acadêmicos com excelência e sofisticação</Subtitle>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Título do Artigo</Label>
            <Input 
              type="text" 
              placeholder="Ex: Arquiteturas Modernas em Nuvem..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Nome do Professor / Autor</Label>
            <Input 
              type="text" 
              placeholder="Ex: Prof. Karl" 
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Conteúdo do Artigo</Label>
            <TextArea 
              placeholder="Escreva o conteúdo completo do artigo aqui..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </FormGroup>

          <SubmitButton type="submit">Publicar Artigo</SubmitButton>
        </form>
      </FormWrapper>

      {/* CARTA / MODAL SOFISTICADO DE AGRADECIMENTO AO DOCENTE */}
      {showWelcomeModal && (
        <WelcomeCardOverlay>
          <WelcomeModal>
            <ModalBadge>Publicação Concluída</ModalBadge>
            <ModalTitle>Parabéns, Professor(a)!</ModalTitle>
            <ModalText>
              Agradecemos imensamente pela sua contribuição. Seu artigo foi publicado com sucesso e já está integrado à base de conhecimento do EduBlog.
            </ModalText>
            <ButtonGroup>
              <ModalButtonPrimary onClick={handleGoToAdmin}>
                Ir para o Admin
              </ModalButtonPrimary>
              <ModalButtonSecondary onClick={handleGoToHome}>
                Ver no Feed
              </ModalButtonSecondary>
            </ButtonGroup>
          </WelcomeModal>
        </WelcomeCardOverlay>
      )}
    </Container>
  );
}