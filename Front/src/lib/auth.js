const KEY = "vc_auth";

export function login(username, password) {
  // Demo: acepta cualquier user/pass no vacíos. Cambia esto por tu API.
  if (!username || !password) return { ok: false, msg: "Ingresa usuario y contraseña." };
  const user = { username, ts: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getUser() {
  const raw = localStorage.getItem(KEY);
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function isAuthed() {
  return !!getUser();
}
