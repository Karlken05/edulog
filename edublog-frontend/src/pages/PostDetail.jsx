import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../services/api';

// --- ANIMAÇÕES ---
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
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
  background-image: radial-gradient(circle at top, #1a1a1a 0%, #121212 100%);
  color: #ffffff;
  padding: 3rem 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ContentWrapper = styled.article`
  max-width: 850px;
  width: 100%;
  background-color: rgba(30, 30, 30, 0.75);
  backdrop-filter: blur(12px);
  padding: 3.5rem;
  border-radius: 12px;
  border-top: 4px solid #D4AF37;
  border-left: 1px solid rgba(212, 175, 55, 0.15);
  border-right: 1px solid rgba(212, 175, 55, 0.15);
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #D4AF37;
  text-decoration: none;
  margin-bottom: 2.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    transform: translateX(-4px);
  }
`;

const Title = styled.h1`
  color: #D4AF37;
  font-size: 2.8rem;
  line-height: 1.25;
  margin-bottom: 1.2rem;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 0.5rem;

  strong {
    color: #fff;
    font-weight: 500;
  }
`;

const BodyText = styled.div`
  color: #dcdcdc;
  line-height: 1.9;
  font-size: 1.15rem;
  white-space: pre-wrap; 
  letter-spacing: 0.2px;
  margin-bottom: 3rem;
`;

// --- SEÇÃO DE COMENTÁRIOS ---
const CommentsSection = styled.section`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const CommentsTitle = styled.h3`
  color: #D4AF37;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(20, 20, 20, 0.6);
  padding: 1.8rem;
  border-radius: 10px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 2.5rem;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 15, 15, 0.9);
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #D4AF37;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 15, 15, 0.9);
  color: #fff;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #D4AF37;
  }
`;

const ErrorText = styled.span`
  color: #ff6b6b;
  font-size: 0.85rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%);
  color: #121212;
  border: none;
  padding: 0.8rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #e5be40, #bc9930);
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentCard = styled.div`
  background: rgba(25, 25, 25, 0.6);
  padding: 1.2rem;
  border-radius: 8px;
  border-left: 3px solid #D4AF37;
  border: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;

  strong {
    color: #D4AF37;
  }

  div {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  span {
    color: #777;
    font-size: 0.8rem;
  }
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  color: #4da6ff;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }

  &.cancel {
    color: #ff6b6b;
  }
`;

const CommentText = styled.p`
  color: #ccc;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.4rem;
`;

const NoComments = styled.p`
  color: #777;
  font-style: italic;
  font-size: 0.95rem;
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 45px;
  height: 45px;
  border: 3px solid rgba(212, 175, 55, 0.2);
  border-top: 3px solid #D4AF37;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingMessage = styled.p`
  color: #D4AF37;
  font-size: 1.1rem;
  letter-spacing: 1px;
`;

// --- COMPONENTE PRINCIPAL ---
export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  
  // Estados para o formulário de novo comentário
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Estados para controle de edição de comentário existente
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Erro ao buscar os detalhes da postagem:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim().length < 10) {
      setErrorMsg('O comentário precisa ter pelo menos 10 caracteres.');
      return;
    }
    setErrorMsg('');

    try {
      const response = await api.post(`/posts/${id}/comments`, {
        name: commentName.trim() || 'Anônimo',
        text: commentText.trim()
      });
      setPost(response.data);
      setCommentName('');
      setCommentText('');
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      alert('Não foi possível enviar o comentário.');
    }
  };

  // Iniciar edição
  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  // Salvar alteração do comentário
  const saveEdit = async (commentId) => {
    if (editText.trim().length < 10) {
      alert('O comentário editado precisa ter pelo menos 10 caracteres.');
      return;
    }

    try {
      const response = await api.put(`/posts/${id}/comments/${commentId}`, {
        text: editText.trim()
      });
      setPost(response.data);
      setEditingCommentId(null);
      setEditText('');
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
      alert('Erro ao atualizar comentário.');
    }
  };

  if (!post) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingMessage>Carregando conteúdo exclusivo...</LoadingMessage>
      </LoadingContainer>
    );
  }

  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  return (
    <Container>
      <ContentWrapper>
        <BackButton to="/">
          ← Voltar para a Página Principal
        </BackButton>

        <Title>{post.title}</Title>

        <MetaInfo>
          <span>Autor(a): <strong>{post.author}</strong></span>
          {formattedDate && <span>Publicado em {formattedDate}</span>}
        </MetaInfo>

        <BodyText>
          {post.content}
        </BodyText>

        {/* SEÇÃO DE COMENTÁRIOS */}
        <CommentsSection>
          <CommentsTitle>Comentários e Debates</CommentsTitle>

          <CommentForm onSubmit={handleCommentSubmit}>
            <Input 
              type="text"
              placeholder="Seu nome (Opcional)"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
            />
            <TextArea 
              placeholder="Escreva seu comentário (mínimo de 10 caracteres)..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
            <SubmitButton type="submit">Publicar Comentário</SubmitButton>
          </CommentForm>

          <CommentsList>
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <CommentCard key={comment._id}>
                  <CommentHeader>
                    <strong>{comment.name}</strong>
                    <div>
                      <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('pt-BR') : 'Agora'}</span>
                      {editingCommentId !== comment._id ? (
                        <ActionBtn onClick={() => startEditing(comment)}>Editar</ActionBtn>
                      ) : (
                        <ActionBtn className="cancel" onClick={() => setEditingCommentId(null)}>Cancelar</ActionBtn>
                      )}
                    </div>
                  </CommentHeader>

                  {editingCommentId !== comment._id ? (
                    <CommentText>{comment.text}</CommentText>
                  ) : (
                    <EditContainer>
                      <TextArea 
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <SubmitButton type="button" onClick={() => saveEdit(comment._id)}>
                        Salvar Alterações
                      </SubmitButton>
                    </EditContainer>
                  )}
                </CommentCard>
              ))
            ) : (
              <NoComments>Seja o primeiro(a) a comentar neste artigo!</NoComments>
            )}
          </CommentsList>
        </CommentsSection>
      </ContentWrapper>
    </Container>
  );
}