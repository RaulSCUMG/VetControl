import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

export default function Usuarios() {
  const [cargando, setCargando] = useState(false);

  // catálogos
  const [empleados, setEmpleados] = useState([]);
  const [roles, setRoles] = useState([]);

  // usuarios
  const [users, setUsers] = useState([]);

  // form crear
  const [form, setForm] = useState({
    empleado_id: "",
    usuario: "",
    clave: "",
    rol_id: "",
    activo: true,
  });

  // edición inline
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({ rol_id: "", activo: true });

  // cambiar contraseña
  const [pwOpen, setPwOpen] = useState(false);
  const [pwUser, setPwUser] = useState(null);
  const [pw, setPw] = useState({ a: "", b: "" });
  const [pwErr, setPwErr] = useState("");

  // búsqueda
  const [q, setQ] = useState("");

  // ===== CARGA INICIAL =====
  const cargarTodo = async () => {
    setCargando(true);
    try {
      const [emps, rols, usrs] = await Promise.all([
        api.get("/api/empleados/listarEmpleados"),
        api.get("/api/roles/listarRoles"),
        api.get("/api/usuarios/listarUsuarios"),
      ]);
      setEmpleados(emps.data || []);
      setRoles(rols.data || []);
      setUsers(usrs.data || []);
    } catch (e) {
      console.error(e);
      alert("Error cargando catálogos/usuarios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarTodo(); }, []);

  // ===== CREAR =====
  const crear = async (e) => {
    e.preventDefault();
    if (!form.empleado_id || !form.usuario || !form.clave || !form.rol_id) {
      return alert("Empleado, usuario, clave y rol son obligatorios.");
    }
    const payload = {
      empleado_id: Number(form.empleado_id),
      usuario: form.usuario.trim(),
      clave_hash: form.clave,
      rol_id: Number(form.rol_id),
      activo: form.activo ? 1 : 0,
    };
    setCargando(true);
    try {
      await api.post("/api/usuarios/crearUsuarios", payload);
      setForm({ empleado_id: "", usuario: "", clave: "", rol_id: "", activo: true });
      await cargarTodo();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Error al crear usuario");
    } finally {
      setCargando(false);
    }
  };

  // ===== EDITAR (rol / activo) =====
  const startEdit = (u) => {
    setEditId(u.id);
    setDraft({ rol_id: u.rol_id, activo: !!u.activo });
  };
  const cancelEdit = () => { setEditId(null); setDraft({ rol_id: "", activo: true }); };

  const saveEdit = async () => {
    const u = users.find(x => x.id === editId);
    if (!u) return cancelEdit();

    // necesitamos enviar TODOS los campos que el backend espera
    const payload = {
      empleado_id: u.empleado_id,
      usuario: u.usuario,
      clave_hash: u.clave_hash,
      rol_id: Number(draft.rol_id),
      activo: draft.activo ? 1 : 0,
    };
    setCargando(true);
    try {
      await api.put(`/api/usuarios/actualizarUsuarios/${u.id}`, payload); // :contentReference[oaicite:13]{index=13}
      await cargarTodo();
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Error al actualizar usuario");
    } finally {
      setCargando(false);
    }
  };

  // ===== CAMBIAR PASSWORD =====
  const openPw = (u) => { setPwUser(u); setPw({ a: "", b: "" }); setPwErr(""); setPwOpen(true); };
  const savePw = async (e) => {
    e.preventDefault();
    setPwErr("");
    if (!pw.a || !pw.b) return setPwErr("Completa ambos campos.");
    if (pw.a.length < 6) return setPwErr("Mínimo 6 caracteres.");
    if (pw.a !== pw.b) return setPwErr("Las contraseñas no coinciden.");

    const u = pwUser;
    const payload = {
      empleado_id: u.empleado_id,
      usuario: u.usuario,
      clave_hash: pw.a,
      rol_id: u.rol_id,
      activo: u.activo ? 1 : 0,
    };
    setCargando(true);
    try {
      await api.put(`/api/usuarios/actualizarUsuarios/${u.id}`, payload);
      await cargarTodo();
      setPwOpen(false);
    } catch (err) {
      console.error(err);
      setPwErr(err?.response?.data?.error || "Error al cambiar contraseña");
    } finally {
      setCargando(false);
    }
  };

  // ===== FILTRO =====
  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return users;
    return users.filter(u =>
      [
        u.usuario,
        `${u.empleado_nombre || ""} ${u.empleado_apellido || ""}`,
        u.rol,
        u.activo ? "activo" : "inactivo",
      ]
        .filter(Boolean)
        .map(String)
        .some(v => v.toLowerCase().includes(t))
    );
  }, [users, q]);

  return (
    <div className="doc-wrap">
      <h2>Usuarios</h2>

      {/* Crear */}
      <div className="card" style={{ marginBottom: ".8rem" }}>
        <h3>Crear Usuario</h3>
        <form className="form-grid-3" onSubmit={crear}>
          <label>Empleado
            <select
              value={form.empleado_id}
              onChange={(e)=>setForm(f=>({...f, empleado_id: e.target.value}))}
              required
            >
              <option value="">Seleccione…</option>
              {empleados.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nombre} {e.apellido}
                </option>
              ))}
            </select>
          </label>

          <label>Usuario
            <input value={form.usuario} onChange={(e)=>setForm(f=>({...f, usuario: e.target.value}))} required />
          </label>

          <label>Clave
            <input type="password" value={form.clave} onChange={(e)=>setForm(f=>({...f, clave: e.target.value}))} required />
          </label>

          <label>Rol
            <select
              value={form.rol_id}
              onChange={(e)=>setForm(f=>({...f, rol_id: e.target.value}))}
              required
            >
              <option value="">Seleccione…</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </label>

          <label className="chk">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e)=>setForm(f=>({...f, activo: e.target.checked}))}
            />
            Activo
          </label>

          <div className="actions end">
            <button className="btn btn-primary" disabled={cargando}>Guardar</button>
          </div>
        </form>
      </div>

      {/* Filtro */}
      <div className="inv-toolbar" style={{ marginBottom: ".4rem" }}>
        <input
          className="search big"
          placeholder="Buscar usuario (usuario, empleado, rol…)"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>USUARIO</th>
              <th>EMPLEADO</th>
              <th>ROL</th>
              <th>ACTIVO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(u => (
              <tr key={u.id}>
                {editId === u.id ? (
                  <>
                    <td><b>{u.usuario}</b></td>
                    <td>{u.empleado_nombre} {u.empleado_apellido}</td>
                    <td>
                      <select
                        className="mini"
                        value={draft.rol_id}
                        onChange={(e)=>setDraft(d=>({...d, rol_id: Number(e.target.value)}))}
                      >
                        {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                      </select>
                    </td>
                    <td>
                      <label style={{display:"flex",alignItems:"center",gap:".35rem"}}>
                        <input
                          type="checkbox"
                          checked={draft.activo}
                          onChange={(e)=>setDraft(d=>({...d, activo: e.target.checked}))}
                        />
                        {draft.activo ? "Activo" : "Inactivo"}
                      </label>
                    </td>
                    <td className="actions">
                      <button className="link" onClick={saveEdit} disabled={cargando}>Guardar</button>
                      <button className="link muted" onClick={cancelEdit}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><b>{u.usuario}</b></td>
                    <td>{u.empleado_nombre} {u.empleado_apellido}</td>
                    <td>{u.rol}</td>
                    <td>{u.activo ? "Activo" : "Inactivo"}</td>
                    <td className="actions">
                      <button className="link" onClick={()=>startEdit(u)}>Editar</button>
                      <button className="link" onClick={()=>openPw(u)}>Cambiar contraseña</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {filtrados.length===0 && (
              <tr><td colSpan={5} style={{textAlign:"center", padding:"1rem"}}>Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal cambiar contraseña */}
      {pwOpen && (
        <div className="modal-backdrop" onClick={()=>setPwOpen(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3>Cambiar contraseña</h3>
            <form className="modal-form" onSubmit={savePw}>
              <div className="muted" style={{marginBottom:'.25rem'}}>
                Usuario: <b>{pwUser?.usuario}</b>
              </div>
              <label>Nueva contraseña
                <input type="password" value={pw.a} onChange={(e)=>setPw(s=>({...s, a:e.target.value}))}/>
              </label>
              <label>Confirmar contraseña
                <input type="password" value={pw.b} onChange={(e)=>setPw(s=>({...s, b:e.target.value}))}/>
              </label>
              {pwErr && <div className="login-error">{pwErr}</div>}
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={()=>setPwOpen(false)}>Cancelar</button>
                <button className="btn btn-primary" disabled={cargando}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}