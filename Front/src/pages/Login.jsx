import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../lib/auth";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const redirectTo = loc.state?.from || "/";

  const [form, setForm] = useState({ user: "", pass: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = login(form.user.trim(), form.pass.trim());
    setLoading(false);
    if (!res.ok) return setErr(res.msg || "Credenciales inválidas.");
    nav(redirectTo, { replace: true });
  };

  const [showMenu, setShowMenu] = useState(false);
  useEffect(()=>{
    // add a class to body so we can reliably style the page background
    document.body.classList.add('login-bg');
    return ()=>{ document.body.classList.remove('login-bg'); };
  },[]);
  return (
    <div className="login-wrap">
      <div className="login-settings">
        <button className="settings-btn" onClick={()=>setShowMenu(m=>!m)} title="Cambiar modo">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 5 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.6 5a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 16 5a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19 8.6c.14.31.22.65.22 1H21a2 2 0 0 1 0 4h-.09A1.65 1.65 0 0 0 19 15.4z"/></svg>
        </button>
        {showMenu && (
          <div className="settings-menu">
            <div onClick={()=>{document.body.classList.remove('dark-mode');setShowMenu(false);}}>Modo claro</div>
            <div onClick={()=>{document.body.classList.add('dark-mode');setShowMenu(false);}}>Modo oscuro</div>
          </div>
        )}
      </div>
      <div className="login-card">
        <div className="form-container">
          <p className="title">Login</p>
          <form className="form" onSubmit={submit}>
            <div className="input-group">
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                name="username"
                autoFocus
                type="text"
                value={form.user}
                onChange={(e) => setForm(f => ({ ...f, user: e.target.value }))}
                placeholder="usuario"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.pass}
                onChange={(e) => setForm(f => ({ ...f, pass: e.target.value }))}
                placeholder="••••••••"
              />
            </div>

            {err && <div className="login-error">{err}</div>}

            <button className="sign" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
