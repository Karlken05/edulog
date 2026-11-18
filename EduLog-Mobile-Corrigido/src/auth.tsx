import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { request, ROUTES, User, ApiError } from './api';
type AuthState = { user: User | null; token: string | null; ready: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void> };
const Context = createContext<AuthState | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
 const [user,setUser] = useState<User|null>(null); const [token,setToken] = useState<string|null>(null); const [ready,setReady] = useState(false);
 useEffect(() => { (async () => { try { const raw=await SecureStore.getItemAsync('edulog_session'); if(raw){ const s=JSON.parse(raw); if(s?.token && s?.user?.role){setUser(s.user);setToken(s.token);} } } catch { await SecureStore.deleteItemAsync('edulog_session'); } finally { setReady(true); } })(); },[]);
 const logout=async()=>{setUser(null);setToken(null);await SecureStore.deleteItemAsync('edulog_session');};
 const login=async(email:string,password:string)=>{
  const result=await request<any>(ROUTES.login,undefined,{method:'POST',body:JSON.stringify({email,password})});
  const t=result.accessToken || result.token; const u=result.user || result.usuario;
  if(!t || !u?.role) throw new Error('Resposta de login incompatível: esperado token e user.role. Confira src/api.ts e src/auth.tsx.');
  const role=String(u.role).toLowerCase();
  const normalized:User={...u,role:role==='professor'||role==='docente'?'teacher':role==='aluno'||role==='estudante'?'student':role==='administrador'?'admin':role as User['role']};
  if(!['admin','teacher','student'].includes(normalized.role)) throw new Error('Perfil não reconhecido.');
  setUser(normalized);setToken(t);await SecureStore.setItemAsync('edulog_session',JSON.stringify({user:normalized,token:t}));
 };
 return <Context.Provider value={{user,token,ready,login,logout}}>{children}</Context.Provider>;
}
export function useAuth(){const ctx=useContext(Context);if(!ctx)throw new Error('AuthProvider ausente');return ctx;}
