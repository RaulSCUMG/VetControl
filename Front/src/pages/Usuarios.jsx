import { useEffect, useMemo, useState } from "react";

/* ===== Claves de storage ===== */
const LS_EMPLEADOS = "vc_empleados";
const LS_USUARIOS  = "vc_usuarios";

/* Catálogo de roles (ajústalo a tu gusto) */
const ROLES = [
  "Administrador",
  "Veterinario",
  "Facturación",
  "Bodega",
  "Recepción",
  "Reportes",
];

/* ===== Hook: Empleados desde localStorage ===== */
function useEmpleados() {
  const [empleados, setEmpleados] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_EMPLEADOS) || "[]"); }
    catch { return []; }
  });
  // Si en otra pestaña cambian empleados
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_EMPLEADOS) {
        try { setEmpleados(JSON.parse(e.newValue || "[]")); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return empleados;
}

/* ===== Hook: Usuarios CRUD en localStorage ===== */
function useUsuarios() {
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_USUARIOS) || "[]"); }
    catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem(LS_USUARIOS, JSON.stringify(users));
  }, [users]);
  return { users, setUsers };
}

/* ===== Modal: buscador de empleados ===== */
function PickerEmpleado({ open, initialQuery = "", onClose, onPick }) {
  const empleados = useEmpleados();
  const [q, setQ] = useState(initialQuery);
  const [selId, setSelId] = useState(null);

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return empleados;
    return empleados.filter((e) =>
      [
        e.nombre, e.nombre2, e.apellido, e.apellido2, e.apellidoCasada,
        e.dpi, e.telefono, e.tipoEmpleado,
      ]
        .filter(Boolean)
        .map(String)
        .some((v) => v.toLowerCase().includes(t))
    );
  }, [q, empleados]);

  const confirmar = () => {
    if (!selId) return onClose();
    const emp = empleados.find((e) => e.id === selId);
    if (emp) onPick(emp);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <h3>Buscar empleado</h3>

        <div className="picker-search">
          <input
            autoFocus
            placeholder="Nombre, DPI, teléfono, tipo…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            onKeyDown={(e)=>e.key==="Enter" && e.preventDefault()}
          />
        </div>

        <div className="picker-list" style={{maxHeight:"50vh"}}>
          {lista.map((e)=>(
            <label key={e.id} className="picker-row" style={{gridTemplateColumns:"auto 1fr auto"}}>
              <input
                type="radio"
                name="empPick"
                checked={selId===e.id}
                onChange={()=>setSelId(e.id)}
              />
              <div className="pk-name">
                <b>{e.nombre} {e.nombre2}</b> — {e.apellido} {e.apellido2} {e.apellidoCasada ? `(${e.apellidoCasada})` : ""}
                <div className="muted" style={{fontSize:".85rem"}}>
                  DPI: {e.dpi || "—"} · Tel: {e.telefono || "—"} · {e.tipoEmpleado}
                </div>
              </div>
              <div className="pk-price">{e.activo ? "Activo" : "Inactivo"}</div>
            </label>
          ))}
          {lista.length===0 && <div className="muted" style={{padding:".5rem 0"}}>Sin coincidencias</div>}
        </div>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={confirmar}>Seleccionar</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Página: Usuarios ===== */
export default function Usuarios() {
  const empleados = useEmpleados();
  const { users, setUsers } = useUsuarios();

  // form crear
  const [form, setForm] = useState({
    empleadoId: null,
    empleadoNombre: "",
    username: "",
    password: "",
    role: "Recepción",
    activo: true,
  });

  // picker empleado
  const [openPicker, setOpenPicker] = useState(false);
  const [empQuery, setEmpQuery] = useState("");

  const setEmpleado = (emp) => {
    const nombreCompleto = `${emp.nombre || ""} ${emp.nombre2 || ""} ${emp.apellido || ""} ${emp.apellido2 || ""}`
      .replace(/\s+/g,' ')
      .trim();
    setForm((f)=>({ ...f, empleadoId: emp.id, empleadoNombre: nombreCompleto }));
  };

  const crear = (e) => {
    e.preventDefault();
    if (!form.empleadoId) return alert("Selecciona un empleado.");
    if (!form.username || !form.password) return alert("Usuario y clave son requeridos.");
    if (users.some(u => u.username.toLowerCase() === form.username.trim().toLowerCase())) {
      return alert("El usuario ya existe.");
    }
    const nuevo = {
      id: crypto.randomUUID(),
      empleadoId: form.empleadoId,
      empleadoNombre: form.empleadoNombre,
      username: form.username.trim(),
      // DEMO: en producción nunca guardes plano
      password: form.password,
      role: form.role,
      activo: form.activo,
      ts: Date.now(),
    };
    setUsers(prev => [nuevo, ...prev]);
    setForm({
      empleadoId: null, empleadoNombre: "", username: "", password: "",
      role: "Recepción", activo: true,
    });
    setEmpQuery("");
  };

  // edición inline
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState(null);
  const startEdit = (u) => { setEditId(u.id); setDraft({ role: u.role, activo: u.activo }); };
  const cancelEdit = () => { setEditId(null); setDraft(null); };
  const saveEdit = () => {
    setUsers(prev => prev.map(u => u.id === editId ? { ...u, ...draft } : u));
    cancelEdit();
  };

  // modal cambiar contraseña
  const [pwOpen, setPwOpen] = useState(false);
  const [pwUser, setPwUser] = useState(null);
  const [pw, setPw] = useState({ a: "", b: "" });
  const [pwErr, setPwErr] = useState("");
  const openPw = (u) => { setPwUser(u); setPw({a:"",b:""}); setPwErr(""); setPwOpen(true); };
  const savePw = (e) => {
    e.preventDefault();
    setPwErr("");
    if (!pw.a || !pw.b) return setPwErr("Completa ambos campos.");
    if (pw.a.length < 6) return setPwErr("Mínimo 6 caracteres.");
    if (pw.a !== pw.b) return setPwErr("Las contraseñas no coinciden.");
    setUsers(prev => prev.map(x => x.id === pwUser.id ? { ...x, password: pw.a } : x));
    setPwOpen(false);
  };

  // búsqueda tabla
  const [q, setQ] = useState("");
  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return users;
    return users.filter(u =>
      [u.username, u.empleadoNombre, u.role, u.activo ? "activo":"inactivo"]
        .filter(Boolean)
        .map(String)
        .some(v => v.toLowerCase().includes(t))
    );
  }, [users, q]);

  return (
    <div className="doc-wrap">
      <h2>Usuarios</h2>

      {/* Crear usuario */}
      <div className="card" style={{ marginBottom: ".8rem" }}>
        <h3>Crear Usuario</h3>
        <form className="form-grid-3" onSubmit={crear}>
          <label>Empleado
            <div className="picker-trigger">
              <input
                placeholder="Buscar empleado…"
                value={empQuery}
                onChange={(e)=>setEmpQuery(e.target.value)}
                onKeyDown={(e)=>e.key==="Enter" && (e.preventDefault(), setOpenPicker(true))}
              />
              <button type="button" className="btn mini" onClick={()=>setOpenPicker(true)}>Buscar</button>
            </div>
            {form.empleadoNombre && (
              <div className="muted" style={{marginTop:".25rem"}}>
                Seleccionado: <b>{form.empleadoNombre}</b>
              </div>
            )}
          </label>

          <label>Usuario
            <input value={form.username} onChange={(e)=>setForm(f=>({...f, username: e.target.value}))} />
          </label>

          <label>Clave
            <input type="password" value={form.password} onChange={(e)=>setForm(f=>({...f, password: e.target.value}))} />
          </label>

          <label>Rol
            <select value={form.role} onChange={(e)=>setForm(f=>({...f, role: e.target.value}))}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
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
            <button className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>

      {/* Filtro rápido */}
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
                    <td>{u.username}</td>
                    <td>{u.empleadoNombre}</td>
                    <td>
                      <select className="mini" value={draft.role} onChange={(e)=>setDraft(d=>({...d, role: e.target.value}))}>
                        {ROLES.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td>
                      <label style={{display:"flex",alignItems:"center",gap:".35rem"}}>
                        <input type="checkbox" checked={draft.activo} onChange={(e)=>setDraft(d=>({...d, activo: e.target.checked}))}/>
                        {draft.activo ? "Activo" : "Inactivo"}
                      </label>
                    </td>
                    <td className="actions">
                      <button className="link" onClick={saveEdit}>Guardar</button>
                      <button className="link muted" onClick={cancelEdit}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><b>{u.username}</b></td>
                    <td>{u.empleadoNombre}</td>
                    <td>{u.role}</td>
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

      {/* Modal picker empleado */}
      <PickerEmpleado
        open={openPicker}
        initialQuery={empQuery}
        onClose={()=>setOpenPicker(false)}
        onPick={setEmpleado}
      />

      {/* Modal cambiar contraseña */}
      {pwOpen && (
        <div className="modal-backdrop" onClick={()=>setPwOpen(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3>Cambiar contraseña</h3>
            <form className="modal-form" onSubmit={savePw}>
              <div className="muted" style={{marginBottom:'.25rem'}}>
                Usuario: <b>{pwUser?.username}</b>
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
                <button className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}