import api from './api';

const TOKEN_KEY = 'vc_token';
const USER_KEY = 'vc_user';

export async function login(usuario, clave) {
  try {
    const { data } = await api.post('/api/auth/login', { usuario, clave });
    // Se espera { token, user }
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return { ok: true };
  } catch (e) {
    const msg = e?.response?.data?.error || 'Credenciales inválidas.';
    return { ok: false, msg };
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function me() {
  try {
    const { data } = await api.get('/api/auth/me');
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return { ok: true, user: data.user };
  } catch {
    logout();
    return { ok: false };
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}