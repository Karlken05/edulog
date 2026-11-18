
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI || !JWT_SECRET) {
  console.error('Configure MONGO_URI e JWT_SECRET no .env');
  process.exit(1);
}

// ==========================================
// MODELOS
// ==========================================

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  username: { type: String, default: 'docente1' },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    name: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    required: true
  }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);

// ==========================================
// UTILITÁRIOS
// ==========================================

const publicUser = (user) => ({
  id: String(user._id),
  _id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role
});

const validId = (id) => mongoose.isValidObjectId(id);

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const match = /^Bearer (.+)$/i.exec(header);

  if (!match) {
    return res.status(401).json({
      error: 'Token não informado'
    });
  }

  try {
    const decoded = jwt.verify(match[1], JWT_SECRET);

    req.authId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido ou expirado'
    });
  }
}

async function loadUser(req, res, next) {
  try {
    const user = await User.findById(req.authId);

    if (!user) {
      return res.status(401).json({
        error: 'Usuário não encontrado'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

const authenticated = [auth, loadUser];

function allow(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Você não tem permissão'
      });
    }

    next();
  };
}

function canModifyPost(req, post) {
  if (req.user.role === 'admin') return true;

  return (
    req.user.role === 'teacher' &&
    post.createdBy &&
    String(post.createdBy) === String(req.user._id)
  );
}

function cleanEmail(value) {
  return String(value || '').trim().toLowerCase();
}

// ==========================================
// ROTA DE TESTE
// ==========================================

app.get('/', (req, res) => {
  res.json({
    message: 'API EduLog funcionando!',
    database: mongoose.connection.name,
    connected: mongoose.connection.readyState === 1
  });
});

// ==========================================
// AUTENTICAÇÃO JWT
// ==========================================

app.post('/auth/login', async (req, res) => {
  try {
    const email = cleanEmail(req.body.email);
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Informe e-mail e senha'
      });
    }

    const user = await User.findOne({ email })
      .select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        error: 'E-mail ou senha inválidos'
      });
    }

    const correct = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!correct) {
      return res.status(401).json({
        error: 'E-mail ou senha inválidos'
      });
    }

    const token = jwt.sign(
      { id: String(user._id) },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: publicUser(user)
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro ao realizar login'
    });
  }
});

app.get('/auth/me', ...authenticated, (req, res) => {
  res.json(publicUser(req.user));
});

// ==========================================
// POSTAGENS - LEITURA PÚBLICA
// ==========================================

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(posts);
  } catch (error) {
    console.error('Erro ao buscar postagens:', error);
    res.status(500).json({
      error: 'Erro ao buscar postagens'
    });
  }
});

app.get('/posts/search', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();

    if (!query) return res.json([]);

    const escaped = query.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const posts = await Post.find({
      $or: [
        { title: { $regex: escaped, $options: 'i' } },
        { content: { $regex: escaped, $options: 'i' } },
        { author: { $regex: escaped, $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .lean();

    res.json(posts);
  } catch (error) {
    console.error('Erro na pesquisa:', error);
    res.status(500).json({
      error: 'Erro ao pesquisar postagens'
    });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        error: 'ID inválido'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Postagem não encontrada'
      });
    }

    res.json(post);
  } catch (error) {
    console.error('Erro ao buscar postagem:', error);
    res.status(500).json({
      error: 'Erro ao buscar postagem'
    });
  }
});

// ==========================================
// POSTAGENS - OPERAÇÕES PROTEGIDAS
// ==========================================

app.post(
  '/posts',
  ...authenticated,
  allow('admin', 'teacher'),
  async (req, res) => {
    try {
      const { title, content } = req.body;

      if (!title?.trim() || !content?.trim()) {
        return res.status(400).json({
          error: 'Título e conteúdo são obrigatórios'
        });
      }

      const post = await Post.create({
        title: title.trim(),
        content: content.trim(),
        author: req.user.name,
        username: req.user.email,
        createdBy: req.user._id
      });

      res.status(201).json(post);
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
      res.status(500).json({
        error: 'Erro ao criar postagem'
      });
    }
  }
);

app.put(
  '/posts/:id',
  ...authenticated,
  allow('admin', 'teacher'),
  async (req, res) => {
    try {
      if (!validId(req.params.id)) {
        return res.status(400).json({
          error: 'ID inválido'
        });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          error: 'Postagem não encontrada'
        });
      }

      if (!canModifyPost(req, post)) {
        return res.status(403).json({
          error: 'Você não pode editar esta postagem'
        });
      }

      const { title, content, author } = req.body;

      if (title !== undefined) post.title = title;
      if (content !== undefined) post.content = content;

      if (author !== undefined && req.user.role === 'admin') {
        post.author = author;
      }

      await post.save();
      res.json(post);
    } catch (error) {
      console.error('Erro ao editar postagem:', error);
      res.status(500).json({
        error: 'Erro ao editar postagem'
      });
    }
  }
);

app.delete(
  '/posts/:id',
  ...authenticated,
  allow('admin', 'teacher'),
  async (req, res) => {
    try {
      if (!validId(req.params.id)) {
        return res.status(400).json({
          error: 'ID inválido'
        });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          error: 'Postagem não encontrada'
        });
      }

      if (!canModifyPost(req, post)) {
        return res.status(403).json({
          error: 'Você não pode excluir esta postagem'
        });
      }

      await post.deleteOne();

      res.json({
        message: 'Postagem excluída com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao excluir postagem:', error);
      res.status(500).json({
        error: 'Erro ao excluir postagem'
      });
    }
  }
);

// ==========================================
// COMENTÁRIOS
// ==========================================

app.post('/posts/:id/comments', async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        error: 'ID inválido'
      });
    }

    const { name, text } = req.body;

    if (typeof text !== 'string' || text.trim().length < 10) {
      return res.status(400).json({
        error: 'O comentário deve ter pelo menos 10 caracteres'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Postagem não encontrada'
      });
    }

    post.comments.push({
      name: name || 'Anônimo',
      text: text.trim()
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao comentar:', error);
    res.status(500).json({
      error: 'Erro ao adicionar comentário'
    });
  }
});

app.put(
  '/posts/:postId/comments/:commentId',
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { text } = req.body;

      if (!validId(postId) || !validId(commentId)) {
        return res.status(400).json({
          error: 'ID inválido'
        });
      }

      if (typeof text !== 'string' || text.trim().length < 10) {
        return res.status(400).json({
          error: 'O comentário deve ter pelo menos 10 caracteres'
        });
      }

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          error: 'Postagem não encontrada'
        });
      }

      const comment = post.comments.id(commentId);

      if (!comment) {
        return res.status(404).json({
          error: 'Comentário não encontrado'
        });
      }

      comment.text = text.trim();
      await post.save();

      res.json(post);
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
      res.status(500).json({
        error: 'Erro ao editar comentário'
      });
    }
  }
);

// ==========================================
// PROFESSORES E ALUNOS
// ==========================================

// Os dois perfis são armazenados na coleção users.
// A API expõe /teachers e /students separadamente.

function registerPeopleRoutes(path, role) {

  // Listagem paginada
  app.get(
    path,
    ...authenticated,
    allow('admin', 'teacher'),
    async (req, res) => {
      try {
        const page = Math.max(
          1,
          Number.parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
          100,
          Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
        );

        const filter = { role };

        const [users, total] = await Promise.all([
          User.find(filter)
            .sort({ name: 1 })
            .skip((page - 1) * limit)
            .limit(limit),
          User.countDocuments(filter)
        ]);

        res.json({
          items: users.map(publicUser),
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        });
      } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({
          error: 'Erro ao listar usuários'
        });
      }
    }
  );

  // Buscar pessoa
  app.get(
    `${path}/:id`,
    ...authenticated,
    allow('admin', 'teacher'),
    async (req, res) => {
      try {
        if (!validId(req.params.id)) {
          return res.status(400).json({
            error: 'ID inválido'
          });
        }

        const user = await User.findOne({
          _id: req.params.id,
          role
        });

        if (!user) {
          return res.status(404).json({
            error: 'Cadastro não encontrado'
          });
        }

        res.json(publicUser(user));
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
          error: 'Erro ao buscar usuário'
        });
      }
    }
  );

  // Criar pessoa - somente admin
  app.post(
    path,
    ...authenticated,
    allow('admin'),
    async (req, res) => {
      try {
        const { name, password } = req.body;
        const email = cleanEmail(req.body.email);

        if (
          typeof name !== 'string' ||
          !name.trim() ||
          !email ||
          typeof password !== 'string' ||
          password.length < 8
        ) {
          return res.status(400).json({
            error: 'Informe nome, e-mail e senha com pelo menos 8 caracteres'
          });
        }

        const existing = await User.findOne({ email });

        if (existing) {
          return res.status(409).json({
            error: 'E-mail já cadastrado'
          });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
          name: name.trim(),
          email,
          passwordHash,
          role
        });

        res.status(201).json(publicUser(user));
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({
          error: 'Erro ao cadastrar usuário'
        });
      }
    }
  );

  // Atualizar pessoa - somente admin
  app.put(
    `${path}/:id`,
    ...authenticated,
    allow('admin'),
    async (req, res) => {
      try {
        if (!validId(req.params.id)) {
          return res.status(400).json({
            error: 'ID inválido'
          });
        }

        const user = await User.findOne({
          _id: req.params.id,
          role
        });

        if (!user) {
          return res.status(404).json({
            error: 'Cadastro não encontrado'
          });
        }

        if (req.body.name !== undefined) {
          if (
            typeof req.body.name !== 'string' ||
            !req.body.name.trim()
          ) {
            return res.status(400).json({
              error: 'Nome inválido'
            });
          }

          user.name = req.body.name.trim();
        }

        if (req.body.email !== undefined) {
          const email = cleanEmail(req.body.email);

          if (!email) {
            return res.status(400).json({
              error: 'E-mail inválido'
            });
          }

          const existing = await User.findOne({
            email,
            _id: { $ne: user._id }
          });

          if (existing) {
            return res.status(409).json({
              error: 'E-mail já cadastrado'
            });
          }

          user.email = email;
        }

        if (req.body.password !== undefined) {
          if (
            typeof req.body.password !== 'string' ||
            req.body.password.length < 8
          ) {
            return res.status(400).json({
              error: 'A senha deve ter pelo menos 8 caracteres'
            });
          }

          user.passwordHash = await bcrypt.hash(
            req.body.password,
            12
          );
        }

        await user.save();
        res.json(publicUser(user));
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({
          error: 'Erro ao atualizar usuário'
        });
      }
    }
  );

  // Excluir pessoa - somente admin
  app.delete(
    `${path}/:id`,
    ...authenticated,
    allow('admin'),
    async (req, res) => {
      try {
        if (!validId(req.params.id)) {
          return res.status(400).json({
            error: 'ID inválido'
          });
        }

        const user = await User.findOneAndDelete({
          _id: req.params.id,
          role
        });

        if (!user) {
          return res.status(404).json({
            error: 'Cadastro não encontrado'
          });
        }

        res.json({
          message: 'Cadastro excluído com sucesso'
        });
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({
          error: 'Erro ao excluir usuário'
        });
      }
    }
  );
}

registerPeopleRoutes('/teachers', 'teacher');
registerPeopleRoutes('/students', 'student');

// ==========================================
// ERROS
// ==========================================

app.use((error, req, res, next) => {
  console.error('Erro interno:', error);

  res.status(500).json({
    error: 'Erro interno do servidor'
  });
});

// ==========================================
// PRIMEIRO ADMINISTRADOR
// ==========================================

async function createInitialAdmin() {
  const adminCount = await User.countDocuments({
    role: 'admin'
  });

  if (adminCount > 0) return;

  const email = cleanEmail(process.env.ADMIN_EMAIL);
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      'Nenhum admin cadastrado. Configure ADMIN_EMAIL e ADMIN_PASSWORD no .env.'
    );
    return;
  }

  if (password.length < 12) {
    throw new Error(
      'ADMIN_PASSWORD deve ter pelo menos 12 caracteres'
    );
  }

  const existing = await User.findOne({ email });

  if (existing) {
    throw new Error(
      'ADMIN_EMAIL já pertence a outro usuário'
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await User.create({
    name: 'Administrador EduLog',
    email,
    passwordHash,
    role: 'admin'
  });

  console.log('Administrador inicial criado:', email);
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'edublog',
      serverSelectionTimeoutMS: 10000
    });

    console.log('MongoDB conectado!');
    console.log('Banco:', mongoose.connection.name);

    await createInitialAdmin();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar backend:', error);
    process.exit(1);
  }
}

start();
