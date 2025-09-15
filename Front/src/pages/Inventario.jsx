import { useEffect, useMemo, useState } from "react";

const LS_KEY = "vetcontrol_inventario";

const cols = [
  { key: "codigo", label: "CÓDIGO" },
  { key: "nombre", label: "NOMBRE" },
  { key: "existencia", label: "EXISTENCIA", type: "number" },
  { key: "precio", label: "PRECIO", type: "number" },
  { key: "stockMinimo", label: "STOCK MÍNIMO", type: "number" },
];

function useInventario() {
  const [items, setItems] = useState(() => {
    const fromLS = localStorage.getItem(LS_KEY);
    return fromLS
      ? JSON.parse(fromLS)
      : [
          { id: crypto.randomUUID(), codigo: "001", nombre: "Vacuna Canina", existencia: 50, precio: 120, stockMinimo: 20 },
          { id: crypto.randomUUID(), codigo: "002", nombre: "Collar Antipulgas", existencia: 30, precio: 45, stockMinimo: 10 },
          { id: crypto.randomUUID(), codigo: "003", nombre: "Antibiótico Felino", existencia: 15, precio: 85, stockMinimo: 5 },
        ];
  });

  useEffect(() => localStorage.setItem(LS_KEY, JSON.stringify(items)), [items]);
  return { items, setItems };
}

export default function Inventario() {
  const { items, setItems } = useInventario();

  // filtros por columna + búsqueda global
  const [filters, setFilters] = useState({ codigo: "", nombre: "", existencia: "", precio: "", stockMinimo: "" });
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const byCols = items.filter((it) =>
      Object.entries(filters).every(([k, v]) =>
        String(v).trim() === "" ? true : String(it[k]).toLowerCase().includes(String(v).toLowerCase())
      )
    );
    if (!q.trim()) return byCols;
    const g = q.toLowerCase();
    return byCols.filter((it) =>
      [it.codigo, it.nombre, it.existencia, it.precio, it.stockMinimo]
        .map(String)
        .some((s) => s.toLowerCase().includes(g))
    );
  }, [items, filters, q]);

  // modal crear
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ codigo: "", nombre: "", existencia: "", precio: "", stockMinimo: "" });

  const openCrear = () => {
    setForm({ codigo: "", nombre: "", existencia: "", precio: "", stockMinimo: "" });
    setOpen(true);
  };
  const guardarCrear = (e) => {
    e.preventDefault();
    if (!form.codigo || !form.nombre) return alert("Código y Nombre son requeridos");
    const nuevo = {
      id: crypto.randomUUID(),
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      existencia: Number(form.existencia || 0),
      precio: Number(form.precio || 0),
      stockMinimo: Number(form.stockMinimo || 0),
    };
    setItems((prev) => [...prev, nuevo]);
    setOpen(false);
  };

  // edición en línea
  const [editingId, setEditingId] = useState(null);
  const [rowDraft, setRowDraft] = useState(null);

  const startEdit = (it) => {
    setEditingId(it.id);
    setRowDraft({ ...it });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setRowDraft(null);
  };
  const saveEdit = () => {
    setItems((prev) => prev.map((x) => (x.id === editingId ? { ...rowDraft, existencia: Number(rowDraft.existencia), precio: Number(rowDraft.precio), stockMinimo: Number(rowDraft.stockMinimo) } : x)));
    cancelEdit();
  };

  return (
    <div className="inv-wrap">
      {/* filtros superiores */}
      <div className="inv-toolbar">
        <div className="filters">
          <label className="fcol">
            <span>Categoría:</span>
            <select disabled>
              <option>Todas</option>
            </select>
          </label>
          <input className="search big" placeholder="Buscar insumo" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={openCrear}>+ Crear Producto</button>
      </div>

      <h2 style={{marginTop: '1rem'}}>Gestión de Inventario</h2>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              {cols.map(c => <th key={c.key}>{c.label}</th>)}
              <th>ACCIONES</th>
            </tr>
            {/* fila de filtros por columna */}
            <tr className="filters-row">
              {cols.map(c => (
                <th key={c.key}>
                  <input
                    className="mini"
                    placeholder={c.label}
                    value={filters[c.key]}
                    onChange={(e)=>setFilters(f=>({...f, [c.key]: e.target.value}))}
                  />
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => (
              <tr key={it.id}>
                {editingId === it.id ? (
                  <>
                    <td><input className="mini" value={rowDraft.codigo} onChange={(e)=>setRowDraft(d=>({...d, codigo:e.target.value}))} /></td>
                    <td><input className="mini" value={rowDraft.nombre} onChange={(e)=>setRowDraft(d=>({...d, nombre:e.target.value}))} /></td>
                    <td><input className="mini" type="number" value={rowDraft.existencia} onChange={(e)=>setRowDraft(d=>({...d, existencia:e.target.value}))} /></td>
                    <td><input className="mini" type="number" value={rowDraft.precio} onChange={(e)=>setRowDraft(d=>({...d, precio:e.target.value}))} /></td>
                    <td><input className="mini" type="number" value={rowDraft.stockMinimo} onChange={(e)=>setRowDraft(d=>({...d, stockMinimo:e.target.value}))} /></td>
                    <td className="actions">
                      <button className="link" onClick={saveEdit}>Guardar</button>
                      <button className="link muted" onClick={cancelEdit}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><b>{it.codigo}</b></td>
                    <td>{it.nombre}</td>
                    <td>{it.existencia}</td>
                    <td>Q{Number(it.precio).toFixed(2)}</td>
                    <td>{it.stockMinimo}</td>
                    <td className="actions">
                      <button className="link" onClick={()=>startEdit(it)}>Editar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={cols.length+1} style={{textAlign:'center', padding:'1rem'}}>Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear */}
      {open && (
        <div className="modal-backdrop" onClick={()=>setOpen(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3>Crear Producto</h3>
            <form className="modal-form" onSubmit={guardarCrear}>
              <label>Código
                <input value={form.codigo} onChange={(e)=>setForm(f=>({...f, codigo:e.target.value}))} required/>
              </label>
              <label>Nombre
                <input value={form.nombre} onChange={(e)=>setForm(f=>({...f, nombre:e.target.value}))} required/>
              </label>
              <label>Existencia
                <input type="number" value={form.existencia} onChange={(e)=>setForm(f=>({...f, existencia:e.target.value}))}/>
              </label>
              <label>Precio
                <input type="number" step="0.01" value={form.precio} onChange={(e)=>setForm(f=>({...f, precio:e.target.value}))}/>
              </label>
              <label>Stock Mínimo
                <input type="number" value={form.stockMinimo} onChange={(e)=>setForm(f=>({...f, stockMinimo:e.target.value}))}/>
              </label>

              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={()=>setOpen(false)}>Cancelar</button>
                <button className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
