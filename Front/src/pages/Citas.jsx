import { useMemo, useState } from "react";

const DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const ESPECIALIDADES = ["Cirugía", "Dermatología"];
const TURNOS = ["Mañana", "Tarde"];

// Tarjeta simple de cita
function ApptCard({ a }) {
  return (
    <div className="appt">
      <div className="appt-time">{a.inicio} - {a.fin}</div>
      <div className="appt-patient">Paciente: <b>{a.paciente}</b></div>
      <div className="appt-meta">{a.veterinario} • {a.especialidad}</div>
    </div>
  );
}

// Modal sencillo (sin libs)
function Modal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    dia: 0,
    inicio: "10:00",
    paciente: "",
    veterinario: "",
    especialidad: ESPECIALIDADES[0]
  });

  if (!open) return null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, dia: Number(form.dia) });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <h3>Nueva Cita</h3>
        <form onSubmit={submit} className="modal-form">
          <label>Día
            <select name="dia" value={form.dia} onChange={onChange}>
              {DIAS.map((d,i)=> <option key={d} value={i}>{d}</option>)}
            </select>
          </label>
          <label>Inicio
            <input type="time" name="inicio" value={form.inicio} onChange={onChange}/>
          </label>
          <label>Paciente
            <input name="paciente" placeholder="Nombre del paciente" value={form.paciente} onChange={onChange} required/>
          </label>
          <label>Veterinario
            <input name="veterinario" placeholder="Nombre del doctor" value={form.veterinario} onChange={onChange} required/>
          </label>
          <label>Especialidad
            <select name="especialidad" value={form.especialidad} onChange={onChange}>
              {ESPECIALIDADES.map(e => <option key={e}>{e}</option>)}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Citas() {
  // datos demo
  const [appts, setAppts] = useState([
    { dia:0, inicio:"10:00 AM", fin:"11:00 AM", paciente:"Max",   veterinario:"Dra. Pérez", especialidad:"Cirugía" },
    { dia:0, inicio:"02:00 PM", fin:"03:00 PM", paciente:"Bella", veterinario:"Dr. López",  especialidad:"Dermatología" },
    { dia:1, inicio:"11:00 AM", fin:"12:00 PM", paciente:"Luna",  veterinario:"Dra. Pérez", especialidad:"Cirugía" },
  ]);

  const [fechaBase, setFechaBase] = useState(""); // (decorativo)
  const [filtros, setFiltros] = useState({ especialidad: new Set(), turno: new Set() });
  const [open, setOpen] = useState(false);

  const toggle = (grupo, valor) => {
    setFiltros(f => {
      const s = new Set(f[grupo]);
      s.has(valor) ? s.delete(valor) : s.add(valor);
      return { ...f, [grupo]: s };
    });
  };

  const filtradas = useMemo(() => {
    return appts.filter(a => {
      const espOK = filtros.especialidad.size ? filtros.especialidad.has(a.especialidad) : true;
      const turOK = filtros.turno.size ? filtros.turno.has(a.turno) : true;
      return espOK && turOK;
    });
  }, [appts, filtros]);

  const guardar = (a) => {
    // normalizar hora a formato lindo
    const fix = (h) => h.includes(":") && !h.toUpperCase().includes("M") ? 
      (Number(h.split(":")[0]) >= 12 ? h+" PM" : h+" AM") : h;
    setAppts(prev => [...prev, { ...a, inicio: fix(a.inicio), fin: fix(a.fin) }]);
    setOpen(false);
  };

  return (
    <div className="agenda-wrap">
      <div className="agenda-header">
        <h2>🗓️ Agenda Semanal</h2>
        <input className="date-input" type="date" value={fechaBase} onChange={(e)=>setFechaBase(e.target.value)} placeholder="YYYY-MM-DD"/>
      </div>

      <div className="agenda-grid">
        {/* columnas Lunes-Domingo */}
        {DIAS.map((d,i)=>(
          <div className="day-col" key={d}>
            <div className="day-title">{d}</div>
            <div className="day-body">
              {filtradas.filter(a=>a.dia===i).map((a,idx)=><ApptCard key={idx} a={a} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Botón flotante */}
      <button className="fab" onClick={()=>setOpen(true)}>+ Nueva Cita</button>

      <Modal open={open} onClose={()=>setOpen(false)} onSave={guardar} />
    </div>
  );
}