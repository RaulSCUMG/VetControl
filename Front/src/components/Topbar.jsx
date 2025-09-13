import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaKey, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../lib/auth";

export default function Topbar() {
  const nav = useNavigate();

  // menú usuario
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // modal cambiar contraseña
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ a: "", b: "" });
  const [pwErr, setPwErr] = useState("");

  // cerrar menú al hacer click fuera
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const doLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  const submitPw = (e) => {
    e.preventDefault();
    setPwErr("");
    if (!pw.a || !pw.b) return setPwErr("Completa ambos campos.");
    if (pw.a.length < 6) return setPwErr("Mínimo 6 caracteres.");
    if (pw.a !== pw.b) return setPwErr("Las contraseñas no coinciden.");
    // TODO: llamar a tu API para cambiar contraseña
    alert("Contraseña actualizada (demo).");
    setPw({ a: "", b: "" });
    setPwOpen(false);
  };

  return (
    <header className="topbar">
      {/* Tabs (si las usas) */}
      <div className="spacer" />

      <input className="search" placeholder="Buscar..." />

      {/* Botón de usuario */}
      <button
        ref={btnRef}
        className="icon-btn"
        aria-label="usuario"
        onClick={() => setOpen((v) => !v)}
      >
        <FaUserCircle />
      </button>

      {/* Menú flotante */}
      {open && (
        <div ref={menuRef} className="user-menu">
          <button
            className="user-item"
            onClick={() => {
              setOpen(false);
              setPwOpen(true);
            }}
          >
            <FaKey /> Cambiar contraseña
          </button>
          <button className="user-item danger" onClick={doLogout}>
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      )}

      {/* Modal Cambiar contraseña */}
      {pwOpen && (
        <div className="modal-backdrop" onClick={() => setPwOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cambiar contraseña</h3>
            <form className="modal-form" onSubmit={submitPw}>
              <label>
                Nueva contraseña
                <input
                  type="password"
                  value={pw.a}
                  onChange={(e) => setPw((x) => ({ ...x, a: e.target.value }))}
                  placeholder="••••••••"
                />
              </label>
              <label>
                Confirmar contraseña
                <input
                  type="password"
                  value={pw.b}
                  onChange={(e) => setPw((x) => ({ ...x, b: e.target.value }))}
                  placeholder="••••••••"
                />
              </label>

              {pwErr && <div className="login-error">{pwErr}</div>}

              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={() => setPwOpen(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
