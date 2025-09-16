import { useState, useEffect } from "react";


export default function Patients() {
  const [form, setForm] = useState({
    nombre: "", especie: "", raza: "", sexo: "",
    nacimiento: "",
    vacunas: "", alergias: "", tratamientos: "",
    responsable: "", telefono: "", correo: "",
    archivo: null
  });

  // pestañas y almacenamiento local de pacientes ---
  const [tab, setTab] = useState("Registro"); // "Registro" | "Listado"
  const [pacientes, setPacientes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [q, setQ] = useState("");

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const guardar = (e) => {
    e.preventDefault();
    // aquí podrías enviar a tu API
    console.log("Datos a guardar:", form);

    //crear/actualizar en memoria y pasar a Listado ---
    setPacientes(prev => {
      if (editingIndex >= 0) {
        const copy = [...prev];
        copy[editingIndex] = { ...form };
        return copy;
      }
      return [{ ...form }, ...prev];
    });
    setEditingIndex(-1);
    setTab("Listado");

    alert("Paciente guardado");
  };

  // acciones de la tabla ---
  const editar = (idx) => {
    setEditingIndex(idx);
    setForm({ ...pacientes[idx] });
    setTab("Registro");
  };

  const eliminar = (idx) => {
    if (!window.confirm("¿Eliminar paciente?")) return;
    setPacientes(prev => prev.filter((_, i) => i !== idx));
    if (editingIndex === idx) setEditingIndex(-1);
  };

  const filtrados = pacientes.filter(p =>
    [p.nombre, p.especie, p.raza, p.sexo, p.responsable, p.telefono, p.correo]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      {/* barra de pestañas arriba */}
      <div className="card" style={{ paddingBottom: 8, marginBottom: 12 }}>
        <div className="tabs">
          {["Registro", "Pacientes Registrados"].map(t => (
            <button
              key={t}
              className={`pill ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* pestaña de LISTADO con tabla y acciones */}
      {tab === "Listado" && (
        <div className="card">
          <div className="actions" style={{ marginBottom: 25 }}>
            <input
              className="field"
              placeholder="Buscar Paciente, Raza..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="spacer" />
            <button className="btn" onClick={() => setTab("Registro")}>+ Nuevo</button>
          </div>

          <div className="table-card">
            <table className="table table-hover table-zebra">
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
                  <th style={{ width: 140 }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.nombre}</td>
                    <td>{p.especie}</td>
                    <td>{p.raza}</td>
                    <td>{p.sexo}</td>
                    <td>{p.nacimiento}</td>
                    <td>{p.responsable}</td>
                    <td>{p.telefono}</td>
                    <td>{p.correo}</td>
                    <td>
                      <div className="actions" style={{ gap: 8 }}>
                        <button className="btn" onClick={() => editar(idx)}>Editar</button>
                        <button className="btn" onClick={() => eliminar(idx)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtrados.length && (
                  <tr>
                    <td colSpan={9} className="muted">Sin registros</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*  Registro */}
      {tab === "Registro" && (
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
              <div className="field col-2">//visualizacion de dos columnas 
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

            {/* Footer acciones */}
            <div className="form-footer">
              <button type="submit" className="btn btn-primary">Guardar</button>
              <button type="button" className="btn ghost" onClick={() => window.history.back()}>Cancelar</button>
              <button type="button" className="btn btn-primary outline">Acceso Rápido a Ficha Clínica</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}