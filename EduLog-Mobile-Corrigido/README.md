# EduLog Mobile — Tech Challenge

Aplicativo mobile independente em **React Native + Expo + TypeScript**, preservando o projeto web anterior.

## Instalação

1. Instale Node.js 20.19+ e Expo Go no celular.
2. Execute `npm install` nesta pasta.
3. Copie `.env.example` para `.env` e ajuste `EXPO_PUBLIC_API_URL` para o IP local do computador que executa a API (ex.: `http://192.168.1.20:3000`). `localhost` no celular não aponta para o computador.
4. Inicie o MongoDB e o back-end do EduLog, na porta 3000.
5. Execute `npx expo start` e abra o QR code no Expo Go. Celular e computador devem estar na mesma rede; alternativamente, use API HTTPS acessível.
6. Rode `npm run typecheck` para validar TypeScript.

## Arquitetura

- `App.tsx`: navegação e telas (posts, login, painel administrativo, professores e alunos).
- `src/api.ts`: cliente REST e configuração centralizada dos endpoints.
- `src/auth.tsx`: Context API, login e persistência de sessão com Expo SecureStore.
- `src/ui.tsx`: componentes reutilizáveis e estilos.
- `src/theme.ts`: cores.

## Funcionalidades

- Visitantes: lista pública, pesquisa, leitura e comentários.
- Professores autenticados: criação e edição de posts; painel de posts conforme política de acesso do servidor.
- Administradores: gestão de posts, professores e alunos.
- Estudantes: leitura; ações de edição não aparecem.
- Listagem de usuários com paginação (10 itens por página; requer suporte do servidor).

## ATENÇÃO — compatibilidade com o back-end enviado

A versão de `edublog-backend/server.js` no arquivo `projeto Edulog.7z` tem rotas de posts e comentários, mas **não possui** `/auth/login`, `/teachers` ou `/students` nem middleware JWT. O feedback do professor descreve outra versão mais completa. Para concluir a integração, substitua a API por essa versão aprovada ou ajuste `ROUTES` e os formatos de resposta em `src/api.ts` e `src/auth.tsx` aos endpoints reais. Este projeto **não cria autenticação fictícia** nem altera o back-end original.

A API enviada também não verifica token nas rotas de escrita. A proteção efetiva exige validação de JWT e perfis no servidor. Esconder botões no mobile não é segurança.

## Testes recomendados

1. Visitante abre posts, pesquisa e lê detalhes sem login.
2. Professor faz login, cria e edita um post.
3. Aluno não consegue modificar posts (teste também chamada REST direta: servidor deve devolver 403).
4. Admin lista, cadastra, edita e exclui docentes e alunos.
5. Teste 401, 403, rede desconectada e paginação.

## Vídeo (máximo 15 minutos)

Introdução e arquitetura (2 min), navegação pública (2 min), login/permissões (3 min), CRUD posts (3 min), CRUD usuários (3 min), testes e desafios (2 min).

## Experiência e desafios

A principal decisão foi preservar o front-end React web e construir um cliente React Native independente, compartilhando a API REST. A maior dependência identificada foi a divergência entre a API incluída no arquivo recebido e a API JWT descrita no feedback; a integração administrativa exige a versão correta do servidor.

## Ajustes desta revisão

- Corrigida a entrada no painel de posts para professores autenticados.
- Login retorna à tela anterior quando existe histórico de navegação.
- Erros HTTP preservam o status para tratar sessões expiradas (401) nas ações protegidas.
- Leitura de sessão local tolera dados corrompidos.
- **Pendente de validação real:** a API fornecida não contém os endpoints de autenticação, professores e alunos descritos no feedback. Não foram inventados endpoints no servidor.
