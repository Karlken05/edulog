# 📚 EduBlog — Plataforma de Publicações Acadêmicas Web & Mobile

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-Web-61DAFB?logo=react&logoColor=black)
![React Native](https://img.shields.io/badge/React_Native-Mobile-61DAFB?logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-Mobile-000020?logo=expo&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

## 📖 Sobre o Projeto

Fala, pessoal! Seja bem-vindo ao repositório do **EduBlog**, uma plataforma de publicações acadêmicas desenvolvida para facilitar a criação, o compartilhamento e o gerenciamento de artigos e conteúdos educacionais.

O projeto começou como uma aplicação web fullstack, com uma interface moderna em tema escuro, utilizando preto, dourado e efeitos de *glassmorphism*.

Posteriormente, o sistema foi ampliado com o desenvolvimento de um **aplicativo mobile utilizando React Native e Expo**, permitindo que estudantes, professores e administradores acessem os conteúdos acadêmicos diretamente pelo celular.

A plataforma utiliza uma API REST desenvolvida com Node.js e Express, integrada ao MongoDB Atlas para armazenamento das informações.

O objetivo é oferecer um ambiente digital organizado, acessível e seguro para a divulgação do conhecimento acadêmico.

---

## 🎯 Objetivos

- Facilitar a publicação e a consulta de artigos acadêmicos.
- Oferecer acesso aos conteúdos por meio de aplicações web e mobile.
- Permitir que professores publiquem e gerenciem conteúdos.
- Disponibilizar funcionalidades administrativas para gerenciamento de usuários e publicações.
- Implementar autenticação e controle de acesso por perfis.
- Centralizar os dados utilizando uma API REST e um banco de dados em nuvem.

---

## 🚀 Funcionalidades

### 💻 Plataforma Web

A aplicação web oferece:

- Visualização de publicações acadêmicas.
- Pesquisa de artigos.
- Leitura completa das publicações.
- Sistema de comentários e debates.
- Autenticação de docentes e administradores.
- Criação e edição de artigos.
- Painel administrativo.
- Gerenciamento de publicações conforme as permissões do usuário.
- Interface responsiva com tema escuro e detalhes dourados.

### 📱 Aplicativo Mobile

O aplicativo mobile foi desenvolvido com React Native, TypeScript e Expo.

Entre as funcionalidades implementadas estão:

- Listagem de publicações acadêmicas.
- Pesquisa de postagens por palavras-chave.
- Visualização completa dos artigos.
- Autenticação utilizando JWT.
- Persistência segura da sessão com Expo SecureStore.
- Controle de acesso conforme o perfil do usuário.
- Criação de publicações por usuários autorizados.
- Edição e exclusão de publicações por administradores.
- Gerenciamento de professores e alunos.
- Integração com a API REST.
- Interface adaptada para dispositivos móveis.

O aplicativo foi testado em um iPhone utilizando o ambiente de desenvolvimento Expo.

---

## 🛠️ Tecnologias Utilizadas

### Front-End Web

| Tecnologia | Finalidade |
|---|---|
| React | Construção da interface |
| React Router DOM | Gerenciamento de rotas |
| Styled Components | Estilização dos componentes |
| Axios | Comunicação com a API REST |
| Vite | Ambiente de desenvolvimento |

### Aplicativo Mobile

| Tecnologia | Finalidade |
|---|---|
| React Native | Desenvolvimento mobile |
| Expo | Execução e desenvolvimento do aplicativo |
| TypeScript | Tipagem estática |
| React Hooks | Gerenciamento de estados e efeitos |
| Expo SecureStore | Armazenamento seguro do token |
| Fetch API | Comunicação HTTP com o backend |

### Back-End

| Tecnologia | Finalidade |
|---|---|
| Node.js | Ambiente de execução |
| Express | Construção da API REST |
| MongoDB Atlas | Banco de dados em nuvem |
| Mongoose | Modelagem e persistência de dados |
| JSON Web Token (JWT) | Autenticação |
| bcryptjs | Hash de senhas |
| CORS | Configuração de acesso à API |
| Dotenv | Gerenciamento de variáveis de ambiente |

---

## 🔐 Autenticação e Controle de Acesso

O projeto utiliza diferentes níveis de permissão para controlar o acesso às funcionalidades.

### Plataforma Web

A aplicação web original possui perfis de docentes e administrador.

- **Docente:** cria publicações e gerencia seus próprios artigos.
- **Administrador / Coordenador:** possui acesso administrativo às publicações.
- **Visitante:** consulta os conteúdos públicos e utiliza os recursos de comentários disponíveis.

### Aplicativo Mobile

A aplicação mobile utiliza autenticação baseada em JWT e três perfis:

| Perfil | Permissões |
|---|---|
| Administrador | Gerenciar publicações, professores e alunos |
| Professor | Consultar conteúdos e criar publicações |
| Aluno | Consultar e pesquisar publicações |

Após a autenticação, o aplicativo utiliza o token JWT para acessar os recursos protegidos da API.

As opções disponíveis na interface são apresentadas de acordo com o perfil do usuário.

**Observação:** as regras de autenticação do aplicativo mobile foram implementadas no backend atualizado. O comportamento da aplicação web original deve ser validado após essas alterações.

---

## 🗂️ Estrutura do Projeto

```text
edulog/
│
├── edublog-backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
│
├── edublog-frontend/
│   └── ...
│
├── EduLog-Mobile-Corrigido/
│   ├── App.tsx
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── api.ts
│       ├── auth.tsx
│       ├── theme.ts
│       └── ui.tsx
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

O projeto está organizado em três componentes principais:

**Backend:** responsável pela API REST, regras de negócio, autenticação e comunicação com o banco de dados.

**Frontend Web:** interface utilizada para acessar a plataforma pelo navegador.

**Aplicativo Mobile:** interface desenvolvida para dispositivos móveis, integrada à API.

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

Antes de começar, tenha instalado:

- Node.js e npm.
- Git.
- Um editor de código, como o Visual Studio Code.
- Acesso a um cluster MongoDB Atlas.
- Expo Go no celular, caso queira testar o aplicativo em um dispositivo físico.

### 1. Clonar o repositório

```bash
git clone https://github.com/Karlken05/edulog.git
cd edulog
```

### 2. Configurar o Backend

Entre na pasta do backend:

```bash
cd edublog-backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` com as configurações necessárias:

```env
MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=uma_chave_secreta_forte_e_aleatoria
PORT=3000
```

Para a criação inicial de um administrador, a configuração do backend também aceita as variáveis:

```env
ADMIN_EMAIL=email_do_administrador
ADMIN_PASSWORD=senha_forte_do_administrador
```

Utilize essas credenciais apenas durante a inicialização necessária e retire-as do arquivo de configuração depois de criar o administrador.

Inicie o servidor:

```bash
node server.js
```

Com a configuração correta, a API estará disponível em:

```text
http://localhost:3000
```

### 3. Executar o Front-End Web

Abra outro terminal e acesse:

```bash
cd edublog-frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

Abra no navegador o endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

### 4. Executar o Aplicativo Mobile

Abra um novo terminal na pasta do aplicativo:

```bash
cd EduLog-Mobile-Corrigido
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` com a URL da API:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000
```

Substitua `SEU_IP_LOCAL` pelo endereço IPv4 do computador que está executando o backend.

Por exemplo, se o computador utiliza o IP `192.168.1.100`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

O celular e o computador devem estar conectados a uma rede que permita a comunicação entre os dispositivos.

Inicie o Expo:

```bash
npx expo start
```

Depois, abra o aplicativo Expo Go no celular e utilize o QR Code exibido no terminal.

**Importante:** `localhost` no celular não representa o computador. Por isso, ao utilizar um dispositivo físico, configure o endereço IP da máquina que executa a API.

---

## 🔄 Arquitetura da Aplicação

A plataforma utiliza uma arquitetura cliente-servidor.

```text
       ┌─────────────────────┐
       │    Front-End Web    │
       │        React        │
       └──────────┬──────────┘
                  │
                  │ HTTP / REST
                  │
       ┌──────────▼──────────┐
       │   API Node.js       │
       │      Express        │
       │   Autenticação JWT  │
       └──────────┬──────────┘
                  │
          ┌───────▼───────┐
          │ MongoDB Atlas │
          │  Banco edublog│
          └───────────────┘
                  ▲
                  │
       ┌──────────┴──────────┐
       │  Aplicativo Mobile  │
       │ React Native + Expo │
       └─────────────────────┘
```

O frontend web e o aplicativo mobile são clientes da API.

O backend centraliza o acesso aos dados, a autenticação e as operações de gerenciamento.

O MongoDB Atlas é responsável pela persistência das informações.

---

## 🌐 API REST

O backend disponibiliza endpoints para operações relacionadas às publicações, autenticação e gerenciamento de usuários.

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/auth/login` | Autenticação |
| GET | `/auth/me` | Consultar usuário autenticado |
| GET | `/posts` | Listar publicações |
| GET | `/posts/search` | Pesquisar publicações |
| POST | `/posts` | Criar publicação |
| PUT | `/posts/:id` | Atualizar publicação |
| DELETE | `/posts/:id` | Excluir publicação |
| GET | `/teachers` | Listar professores |
| GET | `/students` | Listar alunos |

O backend também possui operações de gerenciamento de professores, alunos e comentários.

O acesso às operações protegidas depende das permissões definidas para cada perfil.

---

## 📱 Testes Realizados

Durante o desenvolvimento do aplicativo mobile, foram realizados testes funcionais em um iPhone.

Foram verificados:

- Conexão entre aplicativo e backend.
- Comunicação com MongoDB Atlas.
- Listagem e pesquisa de publicações.
- Visualização de artigos.
- Autenticação do administrador.
- Criação de publicações.
- Cadastro de professores.
- Login e criação de publicação por professor.
- Cadastro de alunos.
- Acesso de leitura pelo aluno.
- Restrição de opções administrativas na interface do aluno.
- Edição e exclusão de publicações pelo administrador.

Esses testes validaram os principais fluxos funcionais da aplicação mobile.

---

## 🔒 Segurança

O projeto adota mecanismos como:

- Autenticação por JWT.
- Hash de senhas utilizando bcryptjs.
- Separação de permissões por perfil.
- Armazenamento do token mobile utilizando Expo SecureStore.
- Variáveis de ambiente para configurações sensíveis.
- Exclusão de arquivos `.env` e `node_modules` do versionamento.

**Nunca publique credenciais reais, senhas, strings de conexão ou chaves JWT no repositório.**

As variáveis com prefixo `EXPO_PUBLIC_` são incorporadas ao aplicativo e não devem conter segredos.

---

## 🧩 Desafios do Desenvolvimento

Entre os principais desafios enfrentados durante o desenvolvimento estiveram:

**Integração entre mobile e backend:** configuração da comunicação entre o aplicativo executado no iPhone e a API em execução no computador.

**Autenticação e permissões:** implementação do fluxo de login com JWT e apresentação das funcionalidades de acordo com os perfis.

**Integração com MongoDB Atlas:** configuração da conexão com o banco de dados e persistência das informações.

**Evolução de um projeto existente:** ampliação de uma plataforma originalmente web para incluir uma aplicação mobile, reutilizando o backend.

**Organização do repositório:** inclusão do aplicativo mobile no mesmo repositório, preservando o código da aplicação web.

---

## 🎥 Demonstração

O vídeo demonstrativo do projeto será disponibilizado aqui.

**Link:** Em breve.

A apresentação mostrará o funcionamento do aplicativo, a autenticação, as funcionalidades administrativas e a integração com o backend.

---

## 📌 Melhorias Futuras

Algumas possibilidades de evolução do EduBlog incluem:

- Notificações para novas publicações.
- Upload de imagens e documentos.
- Favoritos e histórico de leitura.
- Melhorias no sistema de comentários.
- Testes automatizados.
- Implantação do backend em um servidor público.
- Publicação do aplicativo em lojas de aplicativos.
- Painel de estatísticas e relatórios.

---

## 👨‍💻 Autor

**Karl Kenko**

Desenvolvimento Fullstack e Mobile.

GitHub: [Karlken05](https://github.com/Karlken05)

---

## 📄 Considerações Finais

O EduBlog representa a evolução de uma plataforma acadêmica web para um ecossistema com acesso também por dispositivos móveis.

O projeto reúne conceitos de desenvolvimento fullstack, APIs REST, banco de dados NoSQL, autenticação, controle de permissões e desenvolvimento mobile.

Mais do que uma aplicação de publicações, o EduBlog é um projeto voltado ao aprendizado contínuo, à organização do conhecimento e à aplicação prática de tecnologias modernas.