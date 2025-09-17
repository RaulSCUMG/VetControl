import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Pantallas() {
  const [pantallas, setPantallas] = useState([]);
  const [form, setForm] = useState({ id: null, codigo: "", nombre: "" });

  const cargar = async () => {
    const res = await api.get("/api/pantallas/listarPantallas");
    setPantallas(res.data);
  };
  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    const body = { codigo: form.codigo, nombre: form.nombre };
    if (form.id) await api.put(`/api/pantallas/actualizarPantallas/${form.id}`, body);
    else await api.post(`/api/pantallas/crearPantallas`, body);
    setForm({ id: null, codigo: "", nombre: "" });
    cargar();
  };

  const editar = (p) => setForm({ id: p.id, codigo: p.codigo, nombre: p.nombre });
  const eliminar = async (id) => { await api.delete(`/api/pantallas/EliminarPantallas/${id}`); cargar(); };

  return (
    <div className="main">
      <div className="card table-card">
        <h2 className="section-title">Gestión de Pantallas</h2>

        {/* Fila de filtros/inputs al estilo "filters-row" */}
        <form onSubmit={guardar}>
          <table className="table">
            <thead className="filters-row">
              <tr>
                <th style={{ width: 120 }}>
                  <input
                    className="table input mini"
                    placeholder="Código"
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                    required
                  />
                </th>
                <th style={{ width: 220 }}>
                  <input
                    className="table input mini"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </th>
                <th>
                  <button className="btn btn-primary" type="submit">
                    {form.id ? "Actualizar" : "Guardar"}
                  </button>
                  {form.id && (
                    <button
                      className="btn ghost mini"
                      type="button"
                      onClick={() => setForm({ id: null, codigo: "", nombre: "" })}
                      style={{ marginLeft: 8 }}
                    >
                      Cancelar
                    </button>
                  )}
                </th>
              </tr>
            </thead>
          </table>
        </form>

        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th style={{ width: 140 }}>Código</th>
              <th>Nombre</th>
              <th style={{ width: 180 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pantallas.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td className="actions">
                  <button className="link" onClick={() => editar(p)}>Editar</button>
                  <button className="link danger" onClick={() => eliminar(p.id)} style={{ marginLeft: 8 }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {pantallas.length === 0 && (
              <tr>
                <td colSpan={4} className="muted">No hay pantallas registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}