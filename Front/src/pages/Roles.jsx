import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Roles() {
  const [pantallas, setPantallas] = useState([]);              // [{id,codigo,nombre}]
  const [roles, setRoles] = useState([]);                      // [{id,nombre}]
  const [loading, setLoading] = useState(false);

  // formulario (crear/editar)
  const [form, setForm] = useState({ id: null, nombre: "", pantallasIds: [] });
  const [pantallasPrev, setPantallasPrev] = useState([]);      // snapshot para calcular diffs en update

  // cargar catálogos
  const cargarPantallas = async () => {
    const data = await api.get("/api/pantallas/listarPantallas").then(r => r.data);
    setPantallas(data);
  };

  const cargarRoles = async () => {
    const data = await api.get("/api/roles/listarRoles").then(r => r.data);
    setRoles(data);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([cargarPantallas(), cargarRoles()]);
    })();
  }, []);

  const resetForm = () =>
    setForm({ id: null, nombre: "", pantallasIds: [] });

  const togglePantalla = (pid) => {
    setForm(f => f.pantallasIds.includes(pid)
      ? { ...f, pantallasIds: f.pantallasIds.filter(x => x !== pid) }
      : { ...f, pantallasIds: [...f.pantallasIds, pid] });
  };

  // Cargar detalle del rol (incluye checkboxes marcados)
  const editarRol = async (id) => {
    setLoading(true);
    try {
      // 1) nombre del rol
      const rol = await api.get(`/api/roles/obtener/${id}`).then(r => r.data); // {id,nombre} :contentReference[oaicite:6]{index=6}
      // 2) pantallas del rol
      const ps = await api.get(`/api/rolesPantallas/obtener/${id}`).then(r => r.data); // [{pantalla_id,nombre}] :contentReference[oaicite:7]{index=7}
      const ids = ps.map(x => x.pantalla_id);
      setForm({ id: rol.id, nombre: rol.nombre, pantallasIds: ids });
      setPantallasPrev(ids); // snapshot para calcular diferencias en guardar()
    } finally {
      setLoading(false);
    }
  };

  // Crear/Actualizar rol + sincronizar roles_pantallas (POST/DELETE por diff)
  const guardar = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return alert("Nombre requerido");

    setLoading(true);
    try {
      let rolId = form.id;

      if (form.id) {
        // actualizar nombre
        await api.put(`/api/roles/actualizarRol/${form.id}`, { nombre: form.nombre }); // :contentReference[oaicite:8]{index=8}
      } else {
        // crear y tomar id
        const nuevo = await api.post(`/api/roles/crearRol`, { nombre: form.nombre }).then(r => r.data); // :contentReference[oaicite:9]{index=9}
        rolId = nuevo.id;
      }

      // diffs: qué asignar y qué quitar
      const setNew = new Set(form.pantallasIds);
      const setPrev = new Set(form.id ? pantallasPrev : []); // si es nuevo, prev = []
      const toAdd = [...setNew].filter(x => !setPrev.has(x));
      const toDel = [...setPrev].filter(x => !setNew.has(x));

      // crear asignaciones nuevas
      for (const pid of toAdd) {
        await api.post(`/api/rolesPantallas/crearPantallasRoles`, { rol_id: rolId, pantalla_id: pid }); // :contentReference[oaicite:10]{index=10}
      }
      // eliminar asignaciones removidas
      for (const pid of toDel) {
        await api.delete(`/api/rolesPantallas/eliminarPantallasRoles/${rolId}/${pid}`); // :contentReference[oaicite:11]{index=11}
      }

      // refrescar lista y limpiar form
      await cargarRoles();
      resetForm();
      setPantallasPrev([]);
    } catch (err) {
      console.error(err);
      alert("Error al guardar el rol");
    } finally {
      setLoading(false);
    }
  };

  const eliminarRol = async (id) => {
    if (!confirm("¿Eliminar rol?")) return;
    setLoading(true);
    try {
      await api.delete(`/api/roles/EliminarRol/${id}`); // :contentReference[oaicite:12]{index=12}
      await cargarRoles();
      if (form.id === id) resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-wrap">
      <h2>Roles</h2>

      <div className="card" style={{ marginBottom: ".8rem" }}>
        <h3>{form.id ? "Editar Rol" : "Crear Rol"}</h3>
        <form className="form-grid-3" onSubmit={guardar}>
          <label>Nombre
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej. Recepción"
              required
            />
          </label>

          <div className="col-span-5">
            <b>Pantallas</b>
            <div className="pantallas-grid">
              {pantallas.map((p) => (
                <label key={p.id} className="pantalla-item">
                  <input
                    type="checkbox"
                    checked={form.pantallasIds.includes(p.id)}
                    onChange={() => togglePantalla(p.id)}
                  />
                  {p.nombre}
                </label>
              ))}
            </div>
          </div>

          <div className="actions end" style={{ gridColumn: "1 / -1" }}>
            <button className="btn btn-primary" disabled={loading}>
              {form.id ? "Actualizar" : "Guardar"}
            </button>
            {form.id && (
              <button type="button" className="btn ghost" onClick={resetForm} style={{ marginLeft: 8 }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>ROL</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id}>
                <td><b>{r.nombre}</b></td>
                <td className="actions">
                  <button className="link" onClick={() => editarRol(r.id)} disabled={loading}>Editar</button>
                  <button className="link danger" onClick={() => eliminarRol(r.id)} disabled={loading} style={{ marginLeft: 8 }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr><td colSpan={2} style={{ textAlign: "center", padding: "1rem" }}>Sin roles</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}