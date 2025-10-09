export type UserRole = 'admin' | 'caixa';
export const USERS = [
  { usuario: 'admin', senha: '1234', nome: 'Administrador', role: 'admin' as UserRole, token: 'token-admin' },
  { usuario: 'caixa', senha: '1234', nome: 'Operador de Caixa', role: 'caixa' as UserRole, token: 'token-caixa' }
];
export function issueToken(u: string, s: string) {
  const user = USERS.find(x => x.usuario === u && x.senha === s);
  if (!user) return null;
  return { token: user.token, role: user.role, usuario: { nome: user.nome, usuario: user.usuario } };
}
