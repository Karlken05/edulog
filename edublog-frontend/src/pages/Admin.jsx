import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../services/api';

// --- ANIMAÇÕES ---
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
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
  background-image: radial-gradient(circle at top, #1e1e1e 0%, #121212 100%);
  color: #ffffff;
  padding: 3rem 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: ${fadeIn} 0.5s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  color: #D4AF37;
  font-size: 2.2rem;
  margin: 0;
  letter-spacing: 0.5px;
`;

const Subtitle = styled.span`
  color: #888;
  font-size: 0.9rem;
  margin-top: 0.3rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const HomeButton = styled(Link)`
  background-color: transparent;
  color: #D4AF37;
  border: 1px solid rgba(212, 175, 55, 0.4);
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(212, 175, 55, 0.1);
    border-color: #D4AF37;
  }
`;

const CreateButton = styled(Link)`
  background: linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%);
  color: #121212;
  padding: 0.7rem 1.4rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
    background: linear-gradient(135deg, #e6be42, #b5952f);
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.4);
  padding: 0.7rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff6b6b;
    color: #121212;
  }
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostItem = styled.li`
  background-color: rgba(30, 30, 30, 0.75);
  backdrop-filter: blur(8px);
  padding: 1.5rem 1.8rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #D4AF37;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex-wrap: wrap;
  gap: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
`;

const PostInfo = styled.div`
  flex-grow: 1;
  min-width: 250px;
`;

const PostTitle = styled.h3`
  margin: 0 0 0.4rem 0;
  color: #fff;
  font-size: 1.2rem;
`;

const AuthorTag = styled.small`
  color: #888;
  font-size: 0.85rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const EditButton = styled(Link)`
  background-color: transparent;
  color: #4da6ff;
  border: 1px solid rgba(77, 166, 255, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background-color: #4da6ff;
    color: #121212;
  }
`;

const DeleteButton = styled.button`
  background-color: transparent;
  color: #ff4d4d;
  border: 1px solid rgba(255, 77, 77, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #ff4d4d;
    color: #121212;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  border: 1px dashed rgba(212, 175, 55, 0.3);
  color: #888;
  font-size: 1.1rem;
`;

// --- COMPONENTE PRINCIPAL ---
export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null); // Estado para armazenar os dados do usuário logado
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Verifica se o usuário está logado
    const storedUser = localStorage.getItem('edublog_user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const currentUser = JSON.parse(storedUser);
    setUser(currentUser); // Salva os dados do usuário no estado

    // 2. Busca todos os posts e aplica a regra de filtro
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        
        // REGRA DE PERMISSÃO:
        if (currentUser.role === 'professor') {
          // Professor coordenador vê absolutamente tudo
          setPosts(response.data);
        } else {
          // Docente vê apenas os posts criados por ele mesmo
          const myPosts = response.data.filter(post => post.username === currentUser.username);
          setPosts(myPosts);
        }
      } catch (error) {
        console.error('Erro ao buscar as postagens:', error);
      }
    };

    fetchPosts();
  }, [navigate]);

  // Função de Logout
  const handleLogout = () => {
    localStorage.removeItem('edublog_user');
    navigate('/login');
  };

  // Função para deletar uma postagem
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta postagem permanentemente?');
    if (confirmDelete) {
      try {
        await api.delete(`/posts/${id}`);
        setPosts(posts.filter(post => post._id !== id));
      } catch (error) {
        console.error('Erro ao excluir a postagem:', error);
        alert('Erro ao excluir. Tente novamente.');
      }
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <TitleSection>
            <Title>Painel Administrativo</Title>
            <Subtitle>
              {user ? `Logado como: ${user.displayName} (${user.role})` : 'Gerenciamento de publicações'}
            </Subtitle>
          </TitleSection>
          
          <HeaderActions>
            <HomeButton to="/">Ver Feed</HomeButton>
            <CreateButton to="/create">+ Nova Postagem</CreateButton>
            <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
          </HeaderActions>
        </Header>

        <PostList>
          {posts.map(post => (
            <PostItem key={post._id}>
              <PostInfo>
                <PostTitle>{post.title}</PostTitle>
                <AuthorTag>Autor: {post.author} {post.username ? `(${post.username})` : ''}</AuthorTag>
              </PostInfo>
              <ActionButtons>
                <EditButton to={`/edit/${post._id}`}>Editar</EditButton>
                <DeleteButton onClick={() => handleDelete(post._id)}>Excluir</DeleteButton>
              </ActionButtons>
            </PostItem>
          ))}
          {posts.length === 0 && (
            <EmptyState>
              Nenhuma postagem encontrada para o seu perfil. Clique em "+ Nova Postagem" para começar.
            </EmptyState>
          )}
        </PostList>
      </ContentWrapper>
    </Container>
  );
}