import { useEffect, useState } from "react";

const LS_ROLES = "vc_roles";
const PANTALLAS = [
  "Dashboard",
  "Pacientes",
  "Citas",
  "Inventario",
  "Facturación",
  "Reportes",
  "Empleados",
  "Usuarios",
  "Roles"
];

function useRoles() {
  const [roles, setRoles] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_ROLES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(LS_ROLES, JSON.stringify(roles));
  }, [roles]);
  return { roles, setRoles };
}

export default function Roles() {
  const { roles, setRoles } = useRoles();

  // form crear
  const [name, setName] = useState("");
  const [selScreens, setSelScreens] = useState([]);

  const toggleScreen = (s) => {
    setSelScreens((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const crear = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Nombre requerido");
    if (roles.some(r => r.name.toLowerCase() === name.trim().toLowerCase())) {
      return alert("Ya existe un rol con ese nombre");
    }
    const nuevo = { id: crypto.randomUUID(), name: name.trim(), pantallas: selScreens };
    setRoles([nuevo, ...roles]);
    setName(""); setSelScreens([]);
  };

  const eliminar = (id) => {
    if (!confirm("¿Eliminar rol?")) return;
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="doc-wrap">
      <h2>Roles</h2>

      {/* Crear rol */}
      <div className="card" style={{marginBottom:".8rem"}}>
        <h3>Crear Rol</h3>
        <form className="form-grid-3" onSubmit={crear}>
          <label>Nombre
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Ej. Recepción" />
          </label>
          <div className="col-span-5">
            <b>Pantallas</b>
            <div className="pantallas-grid">
                {PANTALLAS.map(s=>(
                <label key={s} className="pantalla-item">
                    <input
                    type="checkbox"
                    checked={selScreens.includes(s)}
                    onChange={()=>toggleScreen(s)}
                    />
                    {s}
                </label>
                ))}
            </div>
          </div>
          <div className="actions end" style={{gridColumn:"1/-1"}}>
            <button className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>

      {/* Listado de roles */}
      <div className="table-card">
        <table className="table">
            <thead>
            <tr>
                <th>ROL</th>
                <th>PANTALLAS</th>
                <th>ACCIONES</th>
            </tr>
            </thead>
            <tbody>
            {roles.map(r=>(
                <tr key={r.id}>
                <td><b>{r.name}</b></td>
                <td>{r.pantallas.join(", ") || "—"}</td>
                <td className="actions">
                    <button className="link" onClick={()=>{ 
                    setName(r.name); 
                    setSelScreens(r.pantallas); 
                    // para edición sobreescribimos
                    setRoles(prev=>prev.filter(x=>x.id!==r.id)); 
                    }}>
                    Editar
                    </button>
                    <button className="link danger" onClick={()=>eliminar(r.id)}>Eliminar</button>
                </td>
                </tr>
            ))}
            {roles.length===0 && (
                <tr><td colSpan={3} style={{textAlign:"center",padding:"1rem"}}>Sin roles</td></tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
