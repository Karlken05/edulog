
/**
 * EDULOG MOBILE
 * Arquivo: src/api.ts
 * Comunicação com o backend Node.js + MongoDB
 */

// ========================================
// CONFIGURAÇÃO DA API
// ========================================

export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  'http://192.168.1.105:3000'
).replace(/\/$/, '');

console.log('EDULOG - API URL:', API_URL);

// ========================================
// TIPOS
// ========================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type Comment = {
  _id: string;
  name: string;
  text: string;
  createdAt?: string;
};

export type Post = {
  _id: string;
  title: string;
  author: string;
  content: string;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
  comments?: Comment[];
};

export type Person = {
  _id: string;
  name?: string;
  nome?: string;
  email?: string;
  [key: string]: unknown;
};

export type Role = 'admin' | 'teacher' | 'student';

export type User = {
  id?: string;
  name?: string;
  email?: string;
  role: Role;
};

// ========================================
// ROTAS DA API
// ========================================

export const ROUTES = {
  login: '/auth/login',
  teachers: '/teachers',
  students: '/students',
};

// ========================================
// FUNÇÃO PRINCIPAL DE REQUISIÇÃO
// ========================================

export async function request<T>(
  path: string,
  token?: string | null,
  init: RequestInit = {}
): Promise<T> {

  const url = `${API_URL}${path}`;

  console.log('EDULOG - Requisição:', url);

  try {

    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
        ...init.headers,
      },
    });

    console.log(
      'EDULOG - Status HTTP:',
      response.status
    );

    const raw = await response.text();

    let body: any;

    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      body = {
        error: raw || 'Resposta inválida do servidor',
      };
    }

    if (!response.ok) {
      throw new ApiError(
        body.error ||
        body.message ||
        `Erro HTTP ${response.status}`,
        response.status
      );
    }

    console.log('EDULOG - Requisição concluída:', path);

    return body as T;

  } catch (error) {

    console.error(
      'EDULOG - Erro na requisição:',
      url,
      error
    );

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Não foi possível conectar à API em ${url}. Verifique o IP, a rede Wi-Fi e se o backend está funcionando.`,
      0
    );
  }
}

// ========================================
// POSTAGENS
// ========================================

export const posts = {

  // Listar ou pesquisar postagens
  list: (q = '') => {
    const term = q.trim();

    const path = term
      ? `/posts/search?q=${encodeURIComponent(term)}`
      : '/posts';

    return request<Post[]>(path);
  },

  // Buscar postagem por ID
  get: (id: string) => {
    return request<Post>(
      `/posts/${encodeURIComponent(id)}`
    );
  },

  // Criar ou atualizar postagem
  save: (
    data: Pick<Post, 'title' | 'author' | 'content'>,
    token: string,
    id?: string
  ) => {

    const path = id
      ? `/posts/${encodeURIComponent(id)}`
      : '/posts';

    return request<Post>(
      path,
      token,
      {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Excluir postagem
  remove: (id: string, token: string) => {
    return request<{ message: string }>(
      `/posts/${encodeURIComponent(id)}`,
      token,
      {
        method: 'DELETE',
      }
    );
  },

  // Adicionar comentário
  comment: (
    id: string,
    name: string,
    text: string
  ) => {

    return request<Post>(
      `/posts/${encodeURIComponent(id)}/comments`,
      undefined,
      {
        method: 'POST',
        body: JSON.stringify({
          name,
          text,
        }),
      }
    );
  },

};

// ========================================
// PROFESSORES E ALUNOS
// ========================================

export const people = (
  kind: 'teachers' | 'students'
) => ({

  // Listar com paginação
  list: (
    token: string,
    page = 1
  ) => {

    return request<
      Person[] | {
        data?: Person[];
        items?: Person[];
        totalPages?: number;
      }
    >(
      `${ROUTES[kind]}?page=${page}&limit=10`,
      token
    );
  },

  // Buscar por ID
  get: (
    id: string,
    token: string
  ) => {

    return request<Person>(
      `${ROUTES[kind]}/${encodeURIComponent(id)}`,
      token
    );
  },

  // Criar ou atualizar
  save: (
    data: {
      name: string;
      email: string;
      password?: string;
    },
    token: string,
    id?: string
  ) => {

    const path = id
      ? `${ROUTES[kind]}/${encodeURIComponent(id)}`
      : ROUTES[kind];

    return request<Person>(
      path,
      token,
      {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Excluir
  remove: (
    id: string,
    token: string
  ) => {

    return request<{ message: string }>(
      `${ROUTES[kind]}/${encodeURIComponent(id)}`,
      token,
      {
        method: 'DELETE',
      }
    );
  },

});
