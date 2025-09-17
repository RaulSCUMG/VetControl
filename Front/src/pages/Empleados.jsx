import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

export default function Empleados() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // catálogos (IDs reales)
  const [tipos, setTipos] = useState([]);           // [{id, nombre}]
  const [especialidades, setEspecialidades] = useState([]); // [{id, nombre}]

  const [q, setQ] = useState("");
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    nombre2: "",
    apellido: "",
    apellido2: "",
    apellidoCasada: "",
    dpi: "",
    telefono: "",
    tipo_empleado_id: null,   // ← ID (requerido por API)
    especialidad_id: null,    // ← opcional
    activo: true,
  });

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/empleados/listarEmpleados").then(r => r.data);
      setItems(data); // ya vienen con tipo_empleado y especialidad por JOIN
    } finally {
      setLoading(false);
    }
  };

  // (Opcional) carga catálogos si existen endpoints; si no, usa valores dummy
  const cargarCatalogos = async () => {
    try {
      const [te, esp] = await Promise.allSettled([
        api.get("/api/tipoEmpleado/listarTipo"),
        api.get("/api/especialidades/listarEspecialidades"),
      ]);
      if (te.status === "fulfilled") setTipos(te.value.data);
      else setTipos([]); // o colocar unos fijos de prueba
      if (esp.status === "fulfilled") setEspecialidades(esp.value.data);
      else setEspecialidades([]);
    } catch {
      setTipos([]);
      setEspecialidades([]);
    }
  };

  useEffect(() => {
    cargar();
    cargarCatalogos();
  }, []);

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((e) =>
      [
        e.nombre, e.nombre2, e.apellido, e.apellido2, e.apellido_casada,
        e.dpi, e.telefono, e.tipo_empleado, e.especialidad, e.activo ? "activo" : "inactivo",
      ]
        .filter(Boolean)
        .map(String)
        .some((v) => v.toLowerCase().includes(t))
    );
  }, [items, q]);

  const resetForm = () => setForm({
    id: null,
    nombre: "",
    nombre2: "",
    apellido: "",
    apellido2: "",
    apellidoCasada: "",
    dpi: "",
    telefono: "",
    tipo_empleado_id: null,
    especialidad_id: null,
    activo: true,
  });

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.dpi || !form.tipo_empleado_id) {
      return alert("Nombre, Apellido, DPI y Tipo de empleado son obligatorios.");
    }

    const payload = {
      nombre: form.nombre,
      nombre2: form.nombre2 || null,
      apellido: form.apellido,
      apellido2: form.apellido2 || null,
      apellido_casada: form.apellidoCasada || null,
      dpi: form.dpi,
      telefono: form.telefono || null,
      tipo_empleado_id: Number(form.tipo_empleado_id),
      especialidad_id: form.especialidad_id ? Number(form.especialidad_id) : null,
      activo: form.activo ? 1 : 0,
    };
    console.log("Payload a enviar:", payload);

    setLoading(true);
    try {
        if (form.id) {
          await api.put(`/api/empleados/actualizarEmpleados/${form.id}`, payload);
        } else {
          await api.post(`/api/empleados/crearEmpleados`, payload);
        }
        await cargar();
        resetForm();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Error al guardar el empleado");
    } finally {
      setLoading(false);
    }
  };

const startEdit = (e) => {
  const tipo = tipos.find(t => t.nombre === e.tipo_empleado);
  const espec = especialidades.find(s => s.nombre === e.especialidad);

  setForm({
    id: e.id,
    nombre: e.nombre || "",
    nombre2: e.nombre2 || "",
    apellido: e.apellido || "",
    apellido2: e.apellido2 || "",
    apellidoCasada: e.apellido_casada || "",
    dpi: e.dpi || "",
    telefono: e.telefono || "",
    tipo_empleado_id: tipo ? Number(tipo.id) : null,
    especialidad_id: espec ? Number(espec.id) : null,
    activo: !!e.activo,
  });
};

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar empleado?")) return;
    setLoading(true);
    try {
      await api.delete(`/api/empleados/EliminarEmpleados/${id}`);
      await cargar();
      if (form.id === id) resetForm();
    } finally {
      setLoading(false);
    }
  };

  // para precargar IDs exactos al editar, puedes pedir /obtener/:id:
  const precargarIdsDeEmpleado = async (id) => {
    const emp = await api.get(`/api/empleados/obtener/${id}`).then(r => r.data);
    // si el controlador devuelve también los ids, mapea aquí;
    // si no, habría que ajustar el backend para enviarlos.
  };

  return (
    <div className="doc-wrap">
      <h2>Empleados</h2>

      <div className="card" style={{ marginBottom: ".8rem" }}>
        <h3>{form.id ? "Editar Empleado" : "Registrar Empleado"}</h3>
        <form className="form-grid-3" onSubmit={guardar}>
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
          <label>DPI
            <input name="dpi" value={form.dpi} onChange={cambiar} required />
          </label>

          <label>Teléfono
            <input name="telefono" value={form.telefono} onChange={cambiar} />
          </label>

          <label>Puesto
            <select name="tipo_empleado_id" value={form.tipo_empleado_id} onChange={cambiar} required>
              <option value="">Seleccione…</option>
              {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </label>

          <label>Especialidad (opcional)
            <select name="especialidad_id" value={form.especialidad_id} onChange={cambiar}>
              <option value="">—</option>
              {especialidades.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <input type="checkbox" name="activo" checked={form.activo} onChange={cambiar} />
            Activo
          </label>

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

      <div className="inv-toolbar" style={{ marginBottom: ".4rem" }}>
        <input
          className="search big"
          placeholder="Buscar empleado (nombre, DPI, tipo, teléfono…)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>NOMBRE COMPLETO</th>
              <th>TIPO</th>
              <th>ESPECIALIDAD</th>
              <th>DPI</th>
              <th>TELÉFONO</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((e) => (
              <tr key={e.id}>
                <td>
                  <div className="stack">
                    <b>{e.nombre} {e.nombre2 || ""}</b>
                    <span>{e.apellido} {e.apellido2 || ""} {e.apellido_casada ? `(${e.apellido_casada})` : ""}</span>
                  </div>
                </td>
                <td>{e.tipo_empleado || "—"}</td>
                <td>{e.especialidad || "—"}</td>
                <td>{e.dpi || "—"}</td>
                <td>{e.telefono || "—"}</td>
                <td>{e.activo ? "Activo" : "Inactivo"}</td>
                <td className="actions">
                  <button className="link" onClick={() => startEdit(e)}>Editar</button>
                  <button className="link danger" onClick={() => eliminar(e.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "1rem" }}>Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
