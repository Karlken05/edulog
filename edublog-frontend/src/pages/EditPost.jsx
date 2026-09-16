import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

// --- ESTILOS ---
const Container = styled.div`
  min-height: 100vh;
  background-color: #121212;
  color: #ffffff;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormBox = styled.div`
  background-color: #1e1e1e;
  padding: 2.5rem;
  border-radius: 8px;
  border-top: 4px solid #D4AF37;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
`;

const Title = styled.h2`
  color: #D4AF37;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid #333;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #D4AF37;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid #333;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  min-height: 150px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #D4AF37;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  background-color: #D4AF37;
  color: #121212;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b5952f;
  }
`;

const BackLink = styled(Link)`
  color: #D4AF37;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1.5rem;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

// --- COMPONENTE ---
export default function EditPost() {
  const { id } = useParams(); // Captura o ID da postagem na URL
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  // Busca os dados atuais do post para preencher o formulário automaticamente
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setContent(response.data.content);
      } catch (error) {
        console.error('Erro ao carregar dados para edição:', error);
      }
    };

    fetchPostData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Envia a atualização para a API
      await api.put(`/posts/${id}`, { title, author, content });
      navigate('/admin'); // Retorna ao painel administrativo
    } catch (error) {
      console.error('Erro ao atualizar postagem:', error);
      alert('Erro ao atualizar a postagem.');
    }
  };

  return (
    <Container>
      <FormBox>
        <BackLink to="/admin">← Voltar ao Painel</BackLink>
        <Title>Editar Postagem</Title>
        <Form onSubmit={handleUpdate}>
          <Input 
            type="text" 
            placeholder="Título da postagem" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          <Input 
            type="text" 
            placeholder="Nome do Autor" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            required 
          />
          <TextArea 
            placeholder="Conteúdo do post..." 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
          />
          <Button type="submit">Salvar Alterações</Button>
        </Form>
      </FormBox>
    </Container>
  );
}