import { useEffect, useMemo, useState } from "react";

const LS_KEY = "vc_empleados";

/** Catálogo de tipos de empleado (puedes editar/añadir) */
const TIPOS = [
  "Veterinario",
  "Facturador",
  "Bodeguero",
  "Recepcionista",
  "Administrador",
  "Asistente",
  "Groomer",
  "Limpieza",
  "Seguridad",
];

function useEmpleados() {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  useEffect(() => localStorage.setItem(LS_KEY, JSON.stringify(items)), [items]);
  return { items, setItems };
}

export default function Empleados() {
  const { items, setItems } = useEmpleados();

  const [q, setQ] = useState(""); // búsqueda
  const [form, setForm] = useState({
    nombre: "",
    nombre2: "",
    apellido: "",
    apellido2: "",
    apellidoCasada: "",
    colegiado: "",     // opcional (para veterinarios)
    dpi: "",
    telefono: "",
    tipoEmpleado: "Veterinario",
    activo: true,
  });

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const crear = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido) {
      return alert("Nombre y Apellido son obligatorios.");
    }
    const nuevo = { id: crypto.randomUUID(), ...form };
    setItems((prev) => [nuevo, ...prev]);
    setForm({
      nombre: "", nombre2: "", apellido: "", apellido2: "",
      apellidoCasada: "", colegiado: "", dpi: "", telefono: "",
      tipoEmpleado: "Veterinario", activo: true,
    });
  };

  // edición en línea
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);

  const startEdit = (it) => { setEditingId(it.id); setDraft({ ...it }); };
  const cancelEdit = () => { setEditingId(null); setDraft(null); };
  const saveEdit = () => {
    setItems((prev) => prev.map((e) => (e.id === editingId ? draft : e)));
    cancelEdit();
  };
  const eliminar = (id) => {
    if (!confirm("¿Eliminar empleado?")) return;
    setItems((prev) => prev.filter((e) => e.id !== id));
  };

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((e) =>
      [
        e.nombre, e.nombre2, e.apellido, e.apellido2, e.apellidoCasada,
        e.colegiado, e.dpi, e.telefono, e.tipoEmpleado, e.activo ? "activo" : "inactivo",
      ]
        .filter(Boolean)
        .map(String)
        .some((v) => v.toLowerCase().includes(t))
    );
  }, [items, q]);

  return (
    <div className="doc-wrap">
      <h2>Empleados</h2>

      {/* Formulario */}
      <div className="card" style={{ marginBottom: ".8rem" }}>
        <h3>Registrar Empleado</h3>
        <form className="form-grid-3" onSubmit={crear}>
          <label>Nombre
            <input name="nombre" value={form.nombre} onChange={cambiar} required />
          </label>
          <label>Nombre 2
            <input name="nombre2" value={form.nombre2} onChange={cambiar} />
          </label>
          <label>Apellido
            <input name="apellido" value={form.apellido} onChange={cambiar} required />
          </label>

          <label>Apellido 2
            <input name="apellido2" value={form.apellido2} onChange={cambiar} />
          </label>
          <label>Apellido casada
            <input name="apellidoCasada" value={form.apellidoCasada} onChange={cambiar} />
          </label>
          <label>Núm. colegiado (opcional)
            <input name="colegiado" value={form.colegiado} onChange={cambiar} placeholder="Solo si aplica" />
          </label>
          <div className="form-row-4">
            <label>DPI
              <input name="dpi" value={form.dpi} onChange={cambiar} />
            </label>
            <label>Teléfono
              <input name="telefono" value={form.telefono} onChange={cambiar} />
            </label>
            <label>Tipo empleado
              <select name="tipoEmpleado" value={form.tipoEmpleado} onChange={cambiar}>
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <input type="checkbox" name="activo" checked={form.activo} onChange={cambiar} />
              Activo
            </label>
          </div>

          <div className="actions end">
            <button className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>

      {/* Búsqueda */}
      <div className="inv-toolbar" style={{ marginBottom: ".4rem" }}>
        <input
          className="search big"
          placeholder="Buscar empleado (nombre, DPI, tipo, teléfono…)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>NOMBRE COMPLETO</th>
              <th>TIPO</th>
              <th>DPI</th>
              <th>TELÉFONO</th>
              <th>COLEGIADO</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((e) => (
              <tr key={e.id}>
                {editingId === e.id ? (
                  <>
                    <td>
                      <div className="stack">
                        <input className="mini" value={draft.nombre} onChange={(ev)=>setDraft(s=>({...s, nombre: ev.target.value}))}/>
                        <input className="mini" value={draft.nombre2||""} onChange={(ev)=>setDraft(s=>({...s, nombre2: ev.target.value}))}/>
                        <input className="mini" value={draft.apellido} onChange={(ev)=>setDraft(s=>({...s, apellido: ev.target.value}))}/>
                        <input className="mini" value={draft.apellido2||""} onChange={(ev)=>setDraft(s=>({...s, apellido2: ev.target.value}))}/>
                        <input className="mini" value={draft.apellidoCasada||""} onChange={(ev)=>setDraft(s=>({...s, apellidoCasada: ev.target.value}))}/>
                      </div>
                    </td>
                    <td>
                      <select className="mini" value={draft.tipoEmpleado} onChange={(ev)=>setDraft(s=>({...s, tipoEmpleado: ev.target.value}))}>
                        {TIPOS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </td>
                    <td><input className="mini" value={draft.dpi||""} onChange={(ev)=>setDraft(s=>({...s, dpi: ev.target.value}))}/></td>
                    <td><input className="mini" value={draft.telefono||""} onChange={(ev)=>setDraft(s=>({...s, telefono: ev.target.value}))}/></td>
                    <td><input className="mini" value={draft.colegiado||""} onChange={(ev)=>setDraft(s=>({...s, colegiado: ev.target.value}))}/></td>
                    <td>
                      <label style={{display:"flex",alignItems:"center",gap:".35rem"}}>
                        <input type="checkbox" checked={!!draft.activo} onChange={(ev)=>setDraft(s=>({...s, activo: ev.target.checked}))}/>
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
                    <td>
                      <div className="stack">
                        <b>{e.nombre} {e.nombre2}</b>
                        <span>{e.apellido} {e.apellido2} {e.apellidoCasada ? `(${e.apellidoCasada})` : ""}</span>
                      </div>
                    </td>
                    <td>{e.tipoEmpleado}</td>
                    <td>{e.dpi || "—"}</td>
                    <td>{e.telefono || "—"}</td>
                    <td>{e.colegiado || "—"}</td>
                    <td>{e.activo ? "Activo" : "Inactivo"}</td>
                    <td className="actions">
                      <button className="link" onClick={()=>startEdit(e)}>Editar</button>
                      <button className="link danger" onClick={()=>eliminar(e.id)}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {lista.length === 0 && (
              <tr><td colSpan={7} style={{textAlign:"center", padding:"1rem"}}>Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}