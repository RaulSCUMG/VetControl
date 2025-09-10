import { useEffect, useMemo, useState } from "react";

const LS_KEY = "vc_veterinarios";

const ESPECIALIDADES = [
  "Medicina general",
  "Cirugía veterinaria",
  "Cardiología",
  "Anestesiología",
  "Emergencias y cuidados críticos",
  "Medicina interna",
];

function useVeterinarios() {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  useEffect(() => localStorage.setItem(LS_KEY, JSON.stringify(items)), [items]);
  return { items, setItems };
}

export default function Veterinario() {
  const { items, setItems } = useVeterinarios();

  const [q, setQ] = useState(""); // búsqueda
  const [form, setForm] = useState({
    nombre: "",
    nombre2: "",
    apellido: "",
    apellido2: "",
    apellidoCasada: "",
    colegiado: "",
    dpi: "",
    telefono: "",
    especialidad: "General",
  });

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const crear = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido) {
      return alert("Nombre y Apellido son obligatorios.");
    }
    const nuevo = {
      id: crypto.randomUUID(),
      ...form,
    };
    setItems((prev) => [nuevo, ...prev]);
    setForm({
      nombre: "",
      nombre2: "",
      apellido: "",
      apellido2: "",
      apellidoCasada: "",
      colegiado: "",
      dpi: "",
      telefono: "",
      especialidad: "General",
    });
  };

  // edición en línea
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const startEdit = (it) => {
    setEditingId(it.id);
    setDraft({ ...it });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };
  const saveEdit = () => {
    setItems((prev) => prev.map((d) => (d.id === editingId ? draft : d)));
    cancelEdit();
  };
  const eliminar = (id) => {
    if (!confirm("¿Eliminar veterinario?")) return;
    setItems((prev) => prev.filter((d) => d.id !== id));
  };

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((d) =>
      [
        d.nombre,
        d.nombre2,
        d.apellido,
        d.apellido2,
        d.apellidoCasada,
        d.colegiado,
        d.dpi,
        d.telefono,
        d.especialidad,
      ]
        .filter(Boolean)
        .map(String)
        .some((v) => v.toLowerCase().includes(t))
    );
  }, [items, q]);

  return (
    <div className="doc-wrap">
      <h2>Veterinario</h2>

      {/* Formulario */}
      <div className="card" style={{ marginBottom: ".8rem" }}>
        <h3>Registrar Veterinario</h3>
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
          <label>Núm. colegiado
            <input name="colegiado" value={form.colegiado} onChange={cambiar} placeholder="Opcional" />
          </label>

          <label>DPI
            <input name="dpi" value={form.dpi} onChange={cambiar} />
          </label>
          <label>Teléfono
            <input name="telefono" value={form.telefono} onChange={cambiar} />
          </label>
          <label>Especialidad
            <select name="especialidad" value={form.especialidad} onChange={cambiar}>
              {ESPECIALIDADES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </label>

          <div className="actions end">
            <button className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>

      {/* Barra de búsqueda */}
      <div className="inv-toolbar" style={{ marginBottom: ".4rem" }}>
        <input
          className="search big"
          placeholder="Buscar veterinario (nombre, dpi, especialidad…) "
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
              <th>COLEGIADO</th>
              <th>DPI</th>
              <th>TELÉFONO</th>
              <th>ESPECIALIDAD</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((d) => (
              <tr key={d.id}>
                {editingId === d.id ? (
                  <>
                    <td>
                      <div className="stack">
                        <input className="mini" value={draft.nombre} onChange={(e)=>setDraft(s=>({...s, nombre:e.target.value}))}/>
                        <input className="mini" value={draft.nombre2} onChange={(e)=>setDraft(s=>({...s, nombre2:e.target.value}))}/>
                        <input className="mini" value={draft.apellido} onChange={(e)=>setDraft(s=>({...s, apellido:e.target.value}))}/>
                        <input className="mini" value={draft.apellido2} onChange={(e)=>setDraft(s=>({...s, apellido2:e.target.value}))}/>
                        <input className="mini" value={draft.apellidoCasada} onChange={(e)=>setDraft(s=>({...s, apellidoCasada:e.target.value}))}/>
                      </div>
                    </td>
                    <td><input className="mini" value={draft.colegiado||""} onChange={(e)=>setDraft(s=>({...s, colegiado:e.target.value}))}/></td>
                    <td><input className="mini" value={draft.dpi||""} onChange={(e)=>setDraft(s=>({...s, dpi:e.target.value}))}/></td>
                    <td><input className="mini" value={draft.telefono||""} onChange={(e)=>setDraft(s=>({...s, telefono:e.target.value}))}/></td>
                    <td>
                      <select className="mini" value={draft.especialidad} onChange={(e)=>setDraft(s=>({...s, especialidad:e.target.value}))}>
                        {ESPECIALIDADES.map(e=><option key={e}>{e}</option>)}
                      </select>
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
                        <b>{d.nombre} {d.nombre2}</b>
                        <span>{d.apellido} {d.apellido2} {d.apellidoCasada ? `(${d.apellidoCasada})` : ""}</span>
                      </div>
                    </td>
                    <td>{d.colegiado || "—"}</td>
                    <td>{d.dpi || "—"}</td>
                    <td>{d.telefono || "—"}</td>
                    <td>{d.especialidad}</td>
                    <td className="actions">
                      <button className="link" onClick={()=>startEdit(d)}>Editar</button>
                      <button className="link danger" onClick={()=>eliminar(d.id)}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {lista.length === 0 && (
              <tr><td colSpan={6} style={{textAlign:"center", padding:"1rem"}}>Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
