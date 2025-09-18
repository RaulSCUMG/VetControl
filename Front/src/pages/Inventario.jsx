import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const cols = [
  { key: "codigo", label: "CÓDIGO" },
  { key: "nombre", label: "NOMBRE" },
  { key: "existencia", label: "EXISTENCIA", type: "number" },
  { key: "precio", label: "PRECIO", type: "number" },
  { key: "stockMinimo", label: "STOCK MÍNIMO", type: "number" },
  { key: "categoriaNombre", label: "CATEGORÍA" },
];

export default function Inventario() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // filtros por columna + búsqueda global
  const [filters, setFilters] = useState({ codigo: "", nombre: "", existencia: "", precio: "", stockMinimo: "", categoriaNombre: "" });
  const [q, setQ] = useState("");

  // modal crear
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ codigo: "", nombre: "", existencia: "", precio: "", stockMinimo: "", categoria_id: "" });

  // edición en línea
  const [editingId, setEditingId] = useState(null);
  const [rowDraft, setRowDraft] = useState(null);

  // ---- helpers de mapeo (API <-> UI)
  const fromApi = (p) => ({
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    existencia: Number(p.existencia ?? 0),
    precio: Number(p.precio ?? 0),
    stockMinimo: Number(p.stock_minimo ?? 0),
    categoria_id: p.categoria_id ?? "",
    categoriaNombre: p.categoria ?? "", // viene del JOIN como 'categoria'
  });

  const toApi = (ui) => ({
    codigo: ui.codigo?.trim(),
    nombre: ui.nombre?.trim(),
    categoria_id: ui.categoria_id || null,
    proveedor_id: null, // aún no existe proveedor
    existencia: Number(ui.existencia || 0),
    stock_minimo: Number(ui.stockMinimo || 0),
    precio: Number(ui.precio || 0),
    activo: 1,
  });

  // ---- carga inicial
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const [prRes, catRes] = await Promise.all([
          api.get("/api/productos/listarProductos"), // GET productos
          api.get("/api/categorias/listarCategorias"), // GET categorias
        ]);
        setItems((prRes.data || []).map(fromApi));
        setCategorias(catRes.data || []);
      } catch (e) {
        setErr(e?.response?.data?.error || "Error cargando inventario");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const byCols = items.filter((it) =>
      Object.entries(filters).every(([k, v]) =>
        String(v).trim() === "" ? true : String(it[k] ?? "").toLowerCase().includes(String(v).toLowerCase())
      )
    );
    if (!q.trim()) return byCols;
    const g = q.toLowerCase();
    return byCols.filter((it) =>
      [it.codigo, it.nombre, it.existencia, it.precio, it.stockMinimo, it.categoriaNombre]
        .map((s) => String(s ?? ""))
        .some((s) => s.toLowerCase().includes(g))
    );
  }, [items, filters, q]);

  // ---- crear
  const openCrear = () => {
    setForm({ codigo: "", nombre: "", existencia: "", precio: "", stockMinimo: "", categoria_id: "" });
    setOpen(true);
  };

  const guardarCrear = async (e) => {
    e.preventDefault();
    try {
      if (!form.codigo || !form.nombre) return alert("Código y Nombre son requeridos");
      const payload = toApi(form);
      const { data } = await api.post("/api/productos/crearProductos", payload);
      // el controller devuelve el objeto creado con id y campos base
      setItems((prev) => [...prev, fromApi({ ...data, categoria: categorias.find(c => c.id === data.categoria_id)?.nombre || "" })]);
      setOpen(false);
    } catch (e) {
      const msg = e?.response?.data?.error || "Error al crear producto";
      alert(msg);
    }
  };

  // ---- edición
  const startEdit = (it) => { setEditingId(it.id); setRowDraft({ ...it }); };
  const cancelEdit = () => { setEditingId(null); setRowDraft(null); };

  const saveEdit = async () => {
    try {
      const payload = toApi(rowDraft);
      await api.put(`/api/productos/actualizarProductos/${rowDraft.id}`, payload);
      // refrescar en memoria
      setItems((prev) =>
        prev.map((x) =>
          x.id === rowDraft.id
            ? {
                ...rowDraft,
                existencia: Number(rowDraft.existencia),
                precio: Number(rowDraft.precio),
                stockMinimo: Number(rowDraft.stockMinimo),
                categoriaNombre: categorias.find((c) => c.id === Number(rowDraft.categoria_id))?.nombre || "",
              }
            : x
        )
      );
      cancelEdit();
    } catch (e) {
      alert(e?.response?.data?.error || "Error al actualizar producto");
    }
  };

  // ---- (opcional) eliminar
  const remove = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await api.delete(`/api/productos/EliminarProductos/${id}`);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      alert(e?.response?.data?.error || "Error al eliminar producto");
    }
  };

  return (
    <div className="inv-wrap">
      <div className="inv-toolbar">
        <div className="filters">
          <label className="fcol">
            <span>Categoría:</span>
            <select
              value={filters.categoriaNombre}
              onChange={(e) => setFilters((f) => ({ ...f, categoriaNombre: e.target.value }))}
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
          </label>
          <input className="search big" placeholder="Buscar insumo" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={openCrear}>+ Crear Producto</button>
      </div>

      <h2 style={{ marginTop: "1rem" }}>Gestión de Inventario</h2>

      {err && <div className="alert error">{err}</div>}
      {loading ? (
        <div className="skeleton">Cargando…</div>
      ) : (
        <div className="table-card">
          <table className="table">
            <thead>
              <tr>
                {cols.map((c) => <th key={c.key}>{c.label}</th>)}
                <th>ACCIONES</th>
              </tr>
              {/* fila de filtros por columna */}
              <tr className="filters-row">
                {cols.map((c) => (
                  <th key={c.key}>
                    <input
                      className="mini"
                      placeholder={c.label}
                      value={filters[c.key]}
                      onChange={(e) => setFilters((f) => ({ ...f, [c.key]: e.target.value }))}
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
                      <td><input className="mini" type="number" step="0.01" value={rowDraft.precio} onChange={(e)=>setRowDraft(d=>({...d, precio:e.target.value}))} /></td>
                      <td><input className="mini" type="number" value={rowDraft.stockMinimo} onChange={(e)=>setRowDraft(d=>({...d, stockMinimo:e.target.value}))} /></td>
                      <td>
                        <select className="mini" value={rowDraft.categoria_id ?? ""} onChange={(e)=>setRowDraft(d=>({...d, categoria_id: e.target.value}))}>
                          <option value="">(sin categoría)</option>
                          {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                      </td>
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
                      <td>{it.categoriaNombre || "—"}</td>
                      <td className="actions">
                        <button className="link" onClick={()=>startEdit(it)}>Editar</button>
                        <button className="link muted" onClick={()=>remove(it.id)}>Eliminar</button>
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
      )}

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
              <label>Categoría
                <select value={form.categoria_id ?? ""} onChange={(e)=>setForm(f=>({...f, categoria_id: e.target.value}))}>
                  <option value="">(sin categoría)</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
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