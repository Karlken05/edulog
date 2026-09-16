📚 EduBlog — Plataforma de Artigos Acadêmicos
Fala, pessoal! Este repositório contém o código fonte do EduBlog, uma aplicação web fullstack que desenvolvi para o gerenciamento de artigos e publicações acadêmicas. O projeto foca em entregar uma experiência moderna, contando com uma interface sofisticada em tema escuro (preto e dourado com efeitos de glassmorphism), controle de acesso por níveis de permissão para os docentes e um sistema dinâmico de comentários e debates para os leitores.

🛠️ Tecnologias que utilizei
Para construir esse projeto, dividi a arquitetura entre front-end e back-end utilizando as seguintes tecnologias:

Front-End:
React (utilizando componentes funcionais e hooks como useState e useEffect)

React Router DOM (para gerenciar as rotas e navegação entre as páginas)

Styled Components (para estilizar os componentes de forma modular e manter o padrão visual de luxo)

Axios (para fazer a integração e consumo dos endpoints da API REST)

Back-End:
Node.js com Express (construção da API RESTful)

MongoDB Atlas & Mongoose (para persistência de dados e modelagem de subdocumentos para os comentários)

CORS & Dotenv (para segurança de conexões e variáveis de ambiente)

🔐 Como funciona o Controle de Acesso (Perfis)
Implementei um sistema de permissões para separar o que cada usuário pode fazer:

Docente 1 (docente1 / 123456): Consegue criar posts e gerenciar exclusivamente as publicações criadas por ele.

Docente 2 (docente2 / 123456): Mesma regra, gerencia apenas os seus próprios artigos.

Professor Coordenador / Admin (professor / admin123): Tem acesso total para visualizar, editar e excluir qualquer postagem do sistema.

Nota: A leitura do feed principal e a interação com comentários (criar e editar) são totalmente públicas e abertas para qualquer visitante.

🚀 Como rodar o projeto na sua máquina
Se você quiser testar a aplicação localmente, siga o passo a passo abaixo:

1. Configurando e rodando o Back-End
Abra o seu terminal na pasta do servidor (edublog-backend):

Bash
# Instale as dependências
npm install

# Crie um arquivo .env na raiz da pasta com a sua string de conexão do MongoDB:
MONGO_URI=sua_string_de_conexao_do_mongodb_atlas
PORT=3000

# Inicie o servidor
node server.js
2. Configurando e rodando o Front-End
Abra um novo terminal na pasta da interface (edublog-frontend):

Bash
# Instale as dependências
npm install

# Inicie o projeto em modo de desenvolvimento
npm run dev
Depois é só abrir o link gerado pelo Vite no navegador (geralmente http://localhost:5173) e explorar a aplicação!

🗂️ Arquitetura e Estrutura de Telas
Home.jsx: Página inicial que lista todas as publicações e conta com barra de pesquisa em tempo real.

PostDetail.jsx: Tela de leitura do artigo completo, onde os leitores também podem interagir enviando e modificando comentários.

Login.jsx: Tela de autenticação unificada que reconhece o perfil de cada docente ou administrador.

Admin.jsx: Painel restrito e inteligente que filtra os posts de acordo com quem está logado.

CreatePost.jsx: Formulário para novas publicações acadêmicas com feedback visual de sucesso.

EditPost.jsx: Tela para alteração de artigos existentes carregando os dados do banco.

services/api.js: Arquivo centralizado do Axios para comunicação com a API.