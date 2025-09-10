import { useState } from "react";

export default function Patients() {
  const [form, setForm] = useState({
    nombre: "", especie: "", raza: "", sexo: "",
    nacimiento: "",
    vacunas: "", alergias: "", tratamientos: "",
    responsable: "", telefono: "", correo: "",
    archivo: null
  });

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const guardar = (e) => {
    e.preventDefault();
    // aquí podrías enviar a tu API
    console.log("Datos a guardar:", form);
    alert("Paciente guardado (demo)");
  };

  return (
    <div className="card form-card">
      <h2 className="form-title">Registro de Paciente</h2>

      <form onSubmit={guardar} className="form-body">
        {/* Sección: Datos Generales */}
        <h4 className="section-title">Datos Generales</h4>
        <div className="form-grid">
          <div className="field">
            <label>Nombre</label>
            <input name="nombre" placeholder="Nombre del paciente" value={form.nombre} onChange={onChange}/>
          </div>
          <div className="field">
            <label>Especie</label>
            <input name="especie" placeholder="Especie" value={form.especie} onChange={onChange}/>
          </div>
          <div className="field">
            <label>Raza</label>
            <input name="raza" placeholder="Raza" value={form.raza} onChange={onChange}/>
          </div>
          <div className="field">
            <label>Sexo</label>
            <input name="sexo" placeholder="Sexo" value={form.sexo} onChange={onChange}/>
          </div>
          <div className="field">
            <label>Fecha de Nacimiento</label>
            <input name="nacimiento" type="date" placeholder="YYYY-MM-DD" value={form.nacimiento} onChange={onChange}/>
          </div>
        </div>

        {/* Sección: Datos Clínicos */}
        <h4 className="section-title">Datos Clínicos</h4>
        <div className="form-grid">
          <div className="field">
            <label>Vacunas</label>
            <input name="vacunas" placeholder="Vacunas" value={form.vacunas} onChange={onChange}/>
          </div>
          <div className="field">
            <label>Alergias</label>
            <input name="alergias" placeholder="Alergias" value={form.alergias} onChange={onChange}/>
          </div>
          <div className="field col-2">
            <label>Tratamientos Actuales</label>
            <input name="tratamientos" placeholder="Tratamientos Actuales" value={form.tratamientos} onChange={onChange}/>
          </div>
        </div>

        {/* Sección: Responsable */}
        <h4 className="section-title">Responsable</h4>
        <div className="form-grid">
          <div className="field">
            <label>Nombre</label>
            <input name="responsable" placeholder="Nombre del responsable" value={form.responsable} onChange={onChange}/>
          </div>
          <div className="field">
            <label>Teléfono</label>
            <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={onChange}/>
          </div>
          <div className="field col-2">
            <label>Correo</label>
            <input name="correo" type="email" placeholder="Correo electrónico" value={form.correo} onChange={onChange}/>
          </div>
        </div>

        {/* Sección: Documentos */}
        <h4 className="section-title">Documentos Adjuntos</h4>
        <div className="field col-2">
          <label>Subir Archivo</label>
          <input name="archivo" type="file" onChange={onChange}/>
        </div>

        {/* Footer acciones */}
        <div className="form-footer">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <button type="button" className="btn ghost" onClick={() => window.history.back()}>Cancelar</button>
          <button type="button" className="btn btn-primary outline">Acceso Rápido a Ficha Clínica</button>
        </div>
      </form>
    </div>
  );
}
