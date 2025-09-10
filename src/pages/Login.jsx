import { useState } from "react";
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

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-brand">VetControl 🐶🐱</div>
        <h2 className="login-title">Iniciar sesión</h2>

        <form onSubmit={submit} className="login-form">
          <label>
            Usuario
            <input
              autoFocus
              value={form.user}
              onChange={(e)=>setForm(f=>({ ...f, user: e.target.value }))}
              placeholder="usuario"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={form.pass}
              onChange={(e)=>setForm(f=>({ ...f, pass: e.target.value }))}
              placeholder="••••••••"
            />
          </label>

          {err && <div className="login-error">{err}</div>}

          <button className="btn btn-primary wide" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar"}
          </button>
        </form>
      </div>
    </div>
  );
}
