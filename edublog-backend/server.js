require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o Banco de Dados MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edublog';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Schema e Model de Postagens (Com suporte a comentários e identificação do autor/docente)
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  username: { type: String, default: 'docente1' }, // Identifica qual docente criou o post
  comments: [{
    name: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// --- ROTAS DE POSTAGENS ---

// 1. Listar todas as postagens
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar postagens' });
  }
});

// 2. Buscar postagem por termo (Pesquisa)
app.get('/posts/search', async (req, res) => {
  try {
    const query = req.query.q;
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao pesquisar postagens' });
  }
});

// 3. Buscar um post específico por ID
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar a postagem' });
  }
});

// 4. Criar postagem (Registrando o autor e o username)
app.post('/posts', async (req, res) => {
  try {
    const { title, author, content, username } = req.body;
    const newPost = new Post({ 
      title, 
      author, 
      content, 
      username: username || 'docente1' 
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar postagem' });
  }
});

// 5. Atualizar postagem por ID
app.put('/posts/:id', async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, author, content },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a postagem' });
  }
});

// 6. Deletar postagem por ID
app.delete('/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }
    res.json({ message: 'Postagem excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir a postagem' });
  }
});

// --- ROTAS DE COMENTÁRIOS ---

// 7. Adicionar um comentário a um post
app.post('/posts/:id/comments', async (req, res) => {
  try {
    const { name, text } = req.body;
    if (!text || text.length < 10) {
      return res.status(400).json({ error: 'O comentário deve ter pelo menos 10 caracteres.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }

    if (!post.comments) {
      post.comments = [];
    }

    post.comments.push({ name: name || 'Anônimo', text, createdAt: new Date() });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar comentário' });
  }
});

// 8. Atualizar um comentário específico de um post
app.put('/posts/:postId/comments/:commentId', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.length < 10) {
      return res.status(400).json({ error: 'O comentário deve ter pelo menos 10 caracteres.' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    comment.text = text;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    res.status(500).json({ error: 'Erro ao atualizar comentário' });
  }
});

// Porta do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});