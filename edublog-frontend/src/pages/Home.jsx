import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../services/api';

// --- ANIMAÇÕES ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- ESTILOS SOPHISTICATED & LUXURY ---
const Container = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a1a1a 0%, #0d0d0d 100%);
  color: #f3f3f3;
  padding: 3rem 2rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h1`
  color: #f0e6d2;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #fff 0%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  letter-spacing: 0.5px;
`;

const SearchWrapper = styled.div`
  position: relative;
  max-width: 550px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(10px);
  color: #fff;
  font-size: 1.05rem;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

  &::placeholder {
    color: #777;
  }

  &:focus {
    border-color: #d4af37;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.2), 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: rgba(25, 25, 25, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(212, 175, 55, 0.4);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 15px rgba(212, 175, 55, 0.1);

    &::before {
      opacity: 1;
    }
  }
`;

const CardTitle = styled.h2`
  color: #f5f5f5;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  line-height: 1.4;
`;

const CardAuthor = styled.div`
  font-size: 0.85rem;
  color: #d4af37;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.2rem;
  font-weight: 500;
`;

const CardDescription = styled.p`
  color: #b0b0b0;
  font-size: 0.95rem;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 1.8rem;
`;

const ReadButton = styled(Link)`
  align-self: flex-start;
  background: transparent;
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.5);
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d4af37;
    color: #121212;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
  }
`;

const EmptyState = styled.p`
  text-align: center;
  color: #777;
  grid-column: 1 / -1;
  font-size: 1.1rem;
  padding: 3rem;
`;

// --- COMPONENTE PRINCIPAL ---
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = searchTerm ? `/posts/search?q=${searchTerm}` : '/posts';
        const response = await api.get(endpoint);
        setPosts(response.data);
      } catch (error) {
        console.error('Erro ao buscar as postagens da API:', error);
      }
    };

    const delay = setTimeout(() => {
      fetchPosts();
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <Container>
      <Header>
        <Title>EduBlog</Title>
        <Subtitle>Explore artigos, tutoriais e conhecimento de alto nível</Subtitle>
        <SearchWrapper>
          <SearchInput 
            type="text" 
            placeholder="Pesquisar por artigos ou temas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
      </Header>

      <Grid>
        {posts.length > 0 ? (
          posts.map(post => (
            <Card key={post._id}>
              <CardTitle>{post.title}</CardTitle>
              <CardAuthor>Por {post.author}</CardAuthor>
              <CardDescription>
                {post.content.length > 110 ? `${post.content.substring(0, 110)}...` : post.content}
              </CardDescription>
              <ReadButton to={`/post/${post._id}`}>Ler Artigo</ReadButton>
            </Card>
          ))
        ) : (
          <EmptyState>Nenhum artigo encontrado no momento.</EmptyState>
        )}
      </Grid>
    </Container>
  );
}