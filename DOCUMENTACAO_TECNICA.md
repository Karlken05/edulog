# Documentação Técnica — EduLog Mobile

## 1. Introdução

O EduLog Mobile é a extensão para dispositivos móveis de uma plataforma de publicações acadêmicas originalmente desenvolvida para a web.

O aplicativo foi construído com React Native, Expo e TypeScript, utilizando uma API REST desenvolvida em Node.js e Express, integrada ao MongoDB Atlas.

O objetivo é permitir que alunos, professores e administradores acessem e gerenciem conteúdos acadêmicos de acordo com suas permissões.

## 2. Arquitetura do Sistema

O projeto utiliza uma arquitetura cliente-servidor, organizada em três camadas principais.

**Camada de apresentação:** aplicativo React Native responsável pelas telas, navegação, formulários e interação com os usuários.

**Camada de aplicação:** API REST em Node.js e Express responsável pelo processamento das requisições, autenticação, autorização e regras de negócio.

**Camada de persistência:** MongoDB Atlas utilizado para armazenamento das publicações, usuários e demais informações.

### Fluxo de comunicação

```text
Aplicativo React Native
         |
         | Requisições HTTP
         v
API REST — Node.js / Express
         |
         | Mongoose
         v
     MongoDB Atlas
```

O aplicativo utiliza requisições HTTP para consultar e modificar os dados. Nas operações protegidas, envia um token JWT para autenticação.

## 3. Tecnologias Utilizadas

| Tecnologia | Aplicação |
|---|---|
| React Native | Interface mobile |
| Expo | Ambiente de desenvolvimento |
| TypeScript | Tipagem do aplicativo |
| React Hooks | Gerenciamento de estados |
| Expo SecureStore | Armazenamento do token |
| Node.js | Execução do backend |
| Express | API REST |
| MongoDB Atlas | Banco de dados |
| Mongoose | Modelagem dos dados |
| JWT | Autenticação |
| bcryptjs | Hash de senhas |

## 4. Organização do Código

### Aplicativo Mobile

**App.tsx:** componente principal da aplicação.

**src/api.ts:** centraliza a comunicação com o backend e a definição das rotas utilizadas.

**src/auth.tsx:** gerencia o estado de autenticação, login, logout e persistência da sessão.

**src/theme.ts:** concentra configurações visuais.

**src/ui.tsx:** reúne componentes de interface utilizados pelo aplicativo.

### Backend

**server.js:** contém a configuração do servidor Express, a conexão com MongoDB Atlas e as rotas da API.

**package.json:** define as dependências e os scripts do backend.

**.env:** armazena configurações locais e credenciais, sem ser publicado no repositório.

## 5. Autenticação e Perfis

O aplicativo utiliza autenticação baseada em JSON Web Token.

O fluxo de autenticação é:

1. O usuário informa suas credenciais.
2. O aplicativo envia os dados para `/auth/login`.
3. O backend valida as credenciais.
4. Após a autenticação, um token JWT é disponibilizado.
5. O aplicativo armazena o token utilizando Expo SecureStore.
6. O token é utilizado nas requisições autenticadas.

### Perfis

| Perfil | Funcionalidades |
|---|---|
| Administrador | Gerenciamento de publicações, professores e alunos |
| Professor | Consulta e criação de publicações |
| Aluno | Consulta e pesquisa de conteúdos |

A interface apresenta funcionalidades de acordo com o perfil autenticado.

A autorização também deve ser aplicada no backend, independentemente das opções exibidas no aplicativo.

## 6. Funcionalidades Implementadas

### Publicações

O aplicativo permite listar, pesquisar e visualizar publicações acadêmicas.

Usuários autorizados podem criar conteúdos, enquanto administradores possuem recursos de edição e exclusão.

### Professores e alunos

O painel administrativo disponibiliza funcionalidades para gerenciamento de professores e alunos.

### Pesquisa

A pesquisa permite localizar publicações por palavras-chave utilizando a API.

### Persistência

As informações são armazenadas no MongoDB Atlas, permitindo que diferentes clientes utilizem os dados disponibilizados pelo backend.

## 7. Desafios Técnicos e Soluções

### Comunicação entre iPhone e servidor local

**Desafio:** inicialmente, o aplicativo mobile precisava acessar uma API executada em um computador Windows.

**Solução:** configuração da variável `EXPO_PUBLIC_API_URL` com o endereço IPv4 local do computador, permitindo a comunicação pela rede.

### Integração com MongoDB Atlas

**Desafio:** configurar corretamente a conexão e utilizar o banco de dados esperado.

**Solução:** utilização do Mongoose com o banco `edublog`, verificando a inicialização do servidor e a persistência dos registros.

### Implementação da autenticação

**Desafio:** controlar o acesso às funcionalidades administrativas e manter a sessão do usuário no aplicativo.

**Solução:** implementação de autenticação JWT, gerenciamento do estado de login e armazenamento seguro do token com Expo SecureStore.

### Separação de permissões

**Desafio:** disponibilizar funcionalidades diferentes para administradores, professores e alunos.

**Solução:** implementação de perfis e apresentação condicional das funcionalidades no aplicativo, com necessidade de validação das restrições diretamente na API.

### Evolução de um sistema existente

**Desafio:** adicionar uma aplicação mobile sem substituir o projeto web já desenvolvido.

**Solução:** organização dos componentes no mesmo repositório, preservando as pastas do frontend web e do backend e adicionando o projeto React Native.

## 8. Testes Funcionais

Foram realizados testes manuais utilizando um iPhone.

| Teste | Resultado |
|---|---|
| Conexão com a API | Aprovado |
| Listagem de publicações | Aprovado |
| Pesquisa de publicações | Aprovado |
| Visualização de artigos | Aprovado |
| Login do administrador | Aprovado |
| Criação de publicações | Aprovado |
| Cadastro de professor | Aprovado |
| Publicação por professor | Aprovado |
| Cadastro de aluno | Aprovado |
| Acesso de leitura do aluno | Aprovado |
| Edição de publicação pelo administrador | Aprovado |
| Exclusão de publicação pelo administrador | Aprovado |

Os resultados representam os fluxos funcionais testados manualmente. Ainda é recomendada uma validação específica das permissões diretamente nos endpoints protegidos.

## 9. Segurança

Os principais mecanismos utilizados incluem autenticação JWT, hash de senhas com bcryptjs, armazenamento seguro do token no dispositivo e separação de permissões por perfil.

As configurações sensíveis são mantidas em variáveis de ambiente.

Antes de disponibilizar o backend publicamente, devem ser revisadas as credenciais, a autorização de todas as rotas protegidas e as configurações de produção.

## 10. Melhorias Futuras

- Implementação de testes automatizados.
- Aprimoramento das mensagens de erro.
- Notificações sobre novas publicações.
- Upload de arquivos e imagens.
- Implantação da API em ambiente de produção.
- Ampliação dos recursos de interação entre professores e alunos.

## 11. Conclusão

O desenvolvimento do EduLog Mobile permitiu aplicar conceitos de desenvolvimento mobile, integração com APIs REST, persistência de dados, autenticação e controle de acesso.

A solução demonstra a possibilidade de ampliar uma plataforma acadêmica web para dispositivos móveis, reutilizando a infraestrutura de backend e banco de dados.

O projeto também proporcionou experiência prática na integração entre diferentes tecnologias e na resolução de desafios de comunicação, autenticação e organização de código.