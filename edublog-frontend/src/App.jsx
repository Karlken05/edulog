import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importação das nossas páginas
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas (Alunos e Professores) */}
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas Administrativas (Mais tarde adicionaremos o bloqueio de segurança aqui) */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;