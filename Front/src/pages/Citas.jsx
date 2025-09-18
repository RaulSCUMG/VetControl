import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

const to2 = (n) => String(n).padStart(2,"0");
const fmtTime = (d) => `${to2(d.getHours())}:${to2(d.getMinutes())}`;
const dowMon0 = (d) => (d.getDay() + 6) % 7;
const joinDt = (yyyyMmDd, hhmm) => `${yyyyMmDd} ${hhmm}:00`;

export default function Citas() {
  const [appts, setAppts] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    paciente_id: "",
    veterinario_id: "",
    especialidad_id: "",
    fecha: "",
    hora_inicio: "10:00",
    hora_fin: "10:30",
    notas: ""
  });

  const EMPTY_FORM = {
    paciente_id: "",
    veterinario_id: "",
    especialidad_id: "",
    fecha: "",
    hora_inicio: "10:00",
    hora_fin: "10:30",
    notas: ""
  };
  const nueva = () => {
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  // cargar catálogos + citas
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const [cRes, pRes, eRes, esRes] = await Promise.all([
          api.get("/api/citas/listarCitas"),
          api.get("/api/paciente/listarPaciente"),
          api.get("/api/empleados/listarEmpleados"),
          api.get("/api/especialidades/listarEspecialidades"),
        ]);
        setAppts((cRes.data || []).map(fromApiCita));
        setPacientes(pRes.data || []);
        setEmpleados(eRes.data || []);
        setEspecialidades(esRes.data || []);
      } catch (e) {
        setErr(e?.response?.data?.error || "Error cargando agenda");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const veterinarios = useMemo(
    () =>
      (empleados || []).filter(
        (e) => (e.tipo_empleado || "").toLowerCase() === "veterinario" && e.activo !== 0
      ),
    [empleados]
  );

  // mappers
  function fromApiCita(c) {
    const d1 = new Date(c.fecha_inicio);
    const d2 = c.fecha_fin ? new Date(c.fecha_fin) : null;
    return {
      id: c.id,
      dia: dowMon0(d1),
      inicio: fmtTime(d1),
      fin: d2 ? fmtTime(d2) : "",
      paciente: c.paciente,
      veterinario: c.veterinario || "(sin asignar)",
      especialidad: c.especialidad || "",
      fecha_inicio: c.fecha_inicio,
      fecha_fin: c.fecha_fin || null,
      estado: c.estado,
      notas: c.notas || ""
    };
  }

  // util nombres por id
  const pacName = (id) => pacientes.find(p => p.id === Number(id))?.nombre || "";
  const vetName = (id) => {
    const e = empleados.find(v => v.id === Number(id));
    return e ? [e.nombre, e.nombre2, e.apellido, e.apellido2].filter(Boolean).join(" ") : "";
  };
  const espName = (id) => especialidades.find(es => es.id === Number(id))?.nombre || "";

  // crear
  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (!form.paciente_id || !form.fecha || !form.hora_inicio) {
        alert("Paciente, fecha y hora inicio son requeridos");
        return;
      }
      const payload = {
        paciente_id: Number(form.paciente_id),
        veterinario_id: form.veterinario_id ? Number(form.veterinario_id) : null,
        especialidad_id: form.especialidad_id ? Number(form.especialidad_id) : null,
        fecha_inicio: joinDt(form.fecha, form.hora_inicio),
        fecha_fin: form.hora_fin ? joinDt(form.fecha, form.hora_fin) : null,
        notas: form.notas || null,
      };
      const { data } = await api.post("/api/citas/crearCitas", payload);
      // crearCita devuelve ids; armamos nombres para la tarjeta
      const d1 = new Date(payload.fecha_inicio);
      const d2 = payload.fecha_fin ? new Date(payload.fecha_fin) : null;
      const nuevo = {
        id: data.id,
        dia: dowMon0(d1),
        inicio: fmtTime(d1),
        fin: d2 ? fmtTime(d2) : "",
        paciente: pacName(payload.paciente_id),
        veterinario: vetName(payload.veterinario_id),
        especialidad: espName(payload.especialidad_id),
        estado: "Programada",
        notas: form.notas || ""
      };
      setAppts(prev => [...prev, nuevo]);
      setOpen(false);
      setForm(f => ({ ...f, notas: "" }));
    } catch (e2) {
      alert(e2?.response?.data?.error || "Error al crear cita");
    }
  };

  // eliminar
  const eliminar = async (id) => {
    if (!confirm("¿Eliminar cita?")) return;
    try {
      await api.delete(`/api/citas/EliminarCitas/${id}`);
      setAppts(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      alert(e?.response?.data?.error || "Error al eliminar cita");
    }
  };

  // Vista por día
  const porDia = useMemo(() => {
    const m = Array.from({ length: 7 }, () => []);
    for (const a of appts) m[a.dia].push(a);
    m.forEach(arr => arr.sort((x,y) => x.inicio.localeCompare(y.inicio)));
    return m;
  }, [appts]);

  return (
    <div className="agenda-wrap">
      <div className="agenda-header">
        <h2>🗓️ Agenda Semanal</h2>
        <button className="btn btn-primary" onClick={nueva}>+ Nueva Cita</button>
      </div>

      {err && <div className="alert error">{err}</div>}
      {loading ? (
        <div className="skeleton">Cargando…</div>
      ) : (
        <div className="agenda-grid">
          {DIAS.map((d, i) => (
            <div className="day-col" key={d}>
              <div className="day-title">{d}</div>
              <div className="day-body">
                {porDia[i].length === 0 ? (
                  <div className="muted">Sin citas</div>
                ) : (
                  porDia[i].map(a => (
                    <div className="appt" key={a.id}>
                      <div className="appt-time">{a.inicio}{a.fin ? ` - ${a.fin}` : ""}</div>
                      <div className="appt-patient">Paciente: <b>{a.paciente}</b></div>
                      <div className="appt-meta">{a.veterinario || "—"} {a.especialidad ? `• ${a.especialidad}` : ""}</div>
                      <div className="appt-actions">
                        <button className="link muted" onClick={() => eliminar(a.id)}>Eliminar</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear */}
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Nueva Cita</h3>
            <form className="modal-form" onSubmit={guardar}>
              <label>Paciente *</label>
              <select
                value={form.paciente_id}
                onChange={(e) => setForm(f => ({ ...f, paciente_id: e.target.value }))}
                required
              >
                <option value="">Seleccione…</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>

              <label>Veterinario</label>
              <select
                value={form.veterinario_id ?? ""}
                onChange={(e) => setForm(f => ({ ...f, veterinario_id: e.target.value }))}
              >
                <option value="">(sin asignar)</option>
                {veterinarios.map(v => (
                  <option key={v.id} value={v.id}>
                    {[v.nombre, v.nombre2, v.apellido, v.apellido2].filter(Boolean).join(" ")}
                  </option>
                ))}
              </select>

              <label>Especialidad</label>
              <select
                value={form.especialidad_id ?? ""}
                onChange={(e) => setForm(f => ({ ...f, especialidad_id: e.target.value }))}
              >
                <option value="">(ninguna)</option>
                {especialidades.map(es => <option key={es.id} value={es.id}>{es.nombre}</option>)}
              </select>

              <label>Fecha *</label>
              <input type="date" value={form.fecha} onChange={(e)=>setForm(f=>({...f, fecha:e.target.value}))} required />

              <label>Hora inicio *</label>
              <input type="time" value={form.hora_inicio} onChange={(e)=>setForm(f=>({...f, hora_inicio:e.target.value}))} required />

              <label>Hora fin</label>
              <input type="time" value={form.hora_fin} onChange={(e)=>setForm(f=>({...f, hora_fin:e.target.value}))} />

              <label>Notas</label>
              <input value={form.notas} onChange={(e)=>setForm(f=>({...f, notas:e.target.value}))} placeholder="Motivo, observaciones…" />

              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={() => setOpen(false)}>Cancelar</button>
                <button className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
