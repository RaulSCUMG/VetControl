import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const SEXOS = ["Macho", "Hembra", "Otro"];

export default function Pacientes() {
  const [tab, setTab] = useState("Listado");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nombre: "", especie: "", raza: "", sexo: "Macho",
    nacimiento: "", vacunas: "", alergias: "", tratamientos: "",
    responsable: "", telefono: "", correo: ""
  });

  // --- helpers: API <-> UI
  const fromApi = (p) => ({
    id: p.id,
    nombre: p.nombre || "",
    especie: p.especie || "",
    raza: p.raza || "",
    sexo: p.sexo || "Macho",
    nacimiento: p.fecha_nacimiento || "",
    vacunas: p.vacunas || "",
    alergias: p.alergias || "",
    tratamientos: p.tratamientos || "",
    responsable: p.responsable || "",
    telefono: p.telefono_resp || "",
    correo: p.correo_resp || "",
  });

  const toApi = (f) => ({
    nombre: f.nombre?.trim(),
    especie: f.especie?.trim(),
    raza: f.raza?.trim() || null,
    sexo: f.sexo || "Macho",
    fecha_nacimiento: f.nacimiento || null,
    vacunas: f.vacunas?.trim() || null,
    alergias: f.alergias?.trim() || null,
    tratamientos: f.tratamientos?.trim() || null,
    responsable: f.responsable?.trim(),
    telefono_resp: f.telefono?.trim() || null,
    correo_resp: f.correo?.trim() || null,
  });

  // --- carga inicial
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get("/api/paciente/listarPaciente");
        setItems((data || []).map(fromApi));
      } catch (e) {
        setErr(e?.response?.data?.error || "Error cargando pacientes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtrados = useMemo(() => {
    if (!q.trim()) return items;
    const g = q.toLowerCase();
    return items.filter((p) =>
      [p.nombre, p.especie, p.raza, p.sexo, p.responsable, p.telefono, p.correo]
        .map((v) => String(v || ""))
        .some((v) => v.toLowerCase().includes(g))
    );
  }, [items, q]);

  // --- acciones
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const nuevo = () => {
    setEditingId(null);
    setForm({
      nombre: "", especie: "", raza: "", sexo: "Macho",
      nacimiento: "", vacunas: "", alergias: "", tratamientos: "",
      responsable: "", telefono: "", correo: ""
    });
    setTab("Registro");
  };

  const editar = (it) => {
    setEditingId(it.id);
    setForm({ ...it });
    setTab("Registro");
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar paciente?")) return;
    try {
      await api.delete(`/api/paciente/EliminarPaciente/${id}`);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      alert(e?.response?.data?.error || "Error al eliminar");
    }
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      const payload = toApi(form);
      if (!payload.nombre || !payload.especie || !payload.responsable) {
        alert("Nombre, especie y responsable son requeridos");
        return;
      }

      if (editingId) {
        await api.put(`/api/paciente/actualizarPaciente/${editingId}`, payload);
        setItems((prev) =>
          prev.map((x) => (x.id === editingId ? { ...form, id: editingId } : x))
        );
      } else {
        const { data } = await api.post("/api/paciente/crearPaciente", payload);
        setItems((prev) => [{ ...fromApi(data) }, ...prev]);
      }

      setTab("Listado");
      setEditingId(null);
    } catch (e2) {
      alert(e2?.response?.data?.error || "Error al guardar");
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="card" style={{ paddingBottom: 8, marginBottom: 12 }}>
        <div className="tabs">
          {["Listado", "Registro"].map((t) => (
            <button key={t} className={`pill ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "Listado" && (
        <div className="card">
          <div className="actions" style={{ marginBottom: 20 }}>
            <input
              className="search big"
              placeholder="Buscar por nombre, especie, responsable…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="spacer" />
            <button className="btn btn-primary" onClick={nuevo}>+ Nuevo</button>
          </div>

          {err && <div className="alert error">{err}</div>}
          {loading ? (
            <div className="skeleton">Cargando…</div>
          ) : (
            <div className="table-card">
              <table className="table">
                <thead>
                  <tr>
                    <th>NOMBRE</th>
                    <th>ESPECIE</th>
                    <th>RAZA</th>
                    <th>SEXO</th>
                    <th>NACIMIENTO</th>
                    <th>RESPONSABLE</th>
                    <th>TELÉFONO</th>
                    <th>CORREO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>{p.especie}</td>
                      <td>{p.raza || "—"}</td>
                      <td>{p.sexo}</td>
                      <td>{p.nacimiento || "—"}</td>
                      <td>{p.responsable}</td>
                      <td>{p.telefono || "—"}</td>
                      <td>{p.correo || "—"}</td>
                      <td className="actions">
                        <button className="link" onClick={() => editar(p)}>Editar</button>
                        <button className="link muted" onClick={() => eliminar(p.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                  {!filtrados.length && (
                    <tr><td colSpan={9} className="muted">Sin registros</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "Registro" && (
        <div className="card form-card">
          <h2 className="form-title">{editingId ? "Editar Paciente" : "Registro de Paciente"}</h2>

          <form onSubmit={guardar} className="form-body">
            <h4 className="section-title">Datos Generales</h4>
            <div className="form-grid">
              <div className="field">
                <label>Nombre *</label>
                <input name="nombre" value={form.nombre} onChange={onChange} required />
              </div>
              <div className="field">
                <label>Especie *</label>
                <input name="especie" value={form.especie} onChange={onChange} required />
              </div>
              <div className="field">
                <label>Raza</label>
                <input name="raza" value={form.raza} onChange={onChange} />
              </div>
              <div className="field">
                <label>Sexo</label>
                <select name="sexo" value={form.sexo ?? ""} onChange={onChange}>
                  {SEXOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="field col-2">
                <label>Fecha de Nacimiento</label>
                <input type="date" name="nacimiento" value={form.nacimiento} onChange={onChange} />
              </div>
            </div>

            <h4 className="section-title">Datos Clínicos</h4>
            <div className="form-grid">
              <div className="field">
                <label>Vacunas</label>
                <input name="vacunas" value={form.vacunas} onChange={onChange} />
              </div>
              <div className="field">
                <label>Alergias</label>
                <input name="alergias" value={form.alergias} onChange={onChange} />
              </div>
              <div className="field col-2">
                <label>Tratamientos</label>
                <input name="tratamientos" value={form.tratamientos} onChange={onChange} />
              </div>
            </div>

            <h4 className="section-title">Responsable *</h4>
            <div className="form-grid">
              <div className="field">
                <label>Nombre *</label>
                <input name="responsable" value={form.responsable} onChange={onChange} required />
              </div>
              <div className="field">
                <label>Teléfono</label>
                <input name="telefono" value={form.telefono} onChange={onChange} />
              </div>
              <div className="field col-2">
                <label>Correo</label>
                <input type="email" name="correo" value={form.correo} onChange={onChange} />
              </div>
            </div>

            <div className="form-footer">
              <button className="btn btn-primary">{editingId ? "Guardar cambios" : "Guardar"}</button>
              <button type="button" className="btn ghost" onClick={() => setTab("Listado")}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}