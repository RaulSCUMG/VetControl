import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { getUser } from "../lib/auth";

const EMPTY_HDR = {
  serie: "",
  numero: "",
  fecha: new Date().toISOString().slice(0, 10),
  paciente_id: "",
  nit: "",
  direccion: "",
};

const round2 = (n) => Number((+n).toFixed(2));

/* --- Modal selector de productos (usa catálogo real) --- */
function PickerProductos({ open, onClose, onAdd, catalogo }) {
  const [query, setQuery] = useState("");
  const [seleccion, setSeleccion] = useState({});

  const lista = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return catalogo || [];
    return (catalogo || []).filter(
      (p) =>
        String(p.codigo || "").toLowerCase().includes(t) ||
        String(p.nombre || "").toLowerCase().includes(t)
    );
  }, [query, catalogo]);

  const toggle = (prod) => {
    setSeleccion((s) => {
      const copy = { ...s };
      if (copy[prod.id]) delete copy[prod.id];
      else copy[prod.id] = 1;
      return copy;
    });
  };
  const changeQty = (id, qty) =>
    setSeleccion((s) => ({ ...s, [id]: Math.max(1, Number(qty || 1)) }));

  const confirm = () => {
    const agregados = Object.entries(seleccion).map(([id, qty]) => {
      const p = (catalogo || []).find((x) => String(x.id) === String(id));
      return p
        ? {
            producto_id: p.id,
            codigo: p.codigo,
            nombre: p.nombre,
            precio: Number(p.precio || 0),
            qty,
          }
        : null;
    }).filter(Boolean);
    if (agregados.length === 0) return onClose();
    onAdd(agregados);
    onClose();
  };

  return open ? (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Seleccionar productos</h3>

        <div className="picker-search">
          <input
            autoFocus
            placeholder="Buscar por código o descripción…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          />
        </div>

        <div className="picker-list">
          {lista.map((p) => {
            const checked = seleccion[p.id] != null;
            return (
              <label key={p.id} className={`picker-row ${checked ? "on" : ""}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(p)}
                />
                <div className="pk-name">
                  <b>{p.codigo || p.id}</b> — {p.nombre}
                </div>
                <div className="pk-price">Q{Number(p.precio || 0).toFixed(2)}</div>
                {checked && (
                  <input
                    className="pk-qty"
                    type="number"
                    min={1}
                    value={seleccion[p.id]}
                    onChange={(e) => changeQty(p.id, e.target.value)}
                  />
                )}
              </label>
            );
          })}
          {lista.length === 0 && (
            <div className="muted" style={{ padding: ".5rem 0" }}>
              Sin coincidencias
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Cerrar</button>
          <button className="btn btn-primary" onClick={confirm}>Agregar seleccionados</button>
        </div>
      </div>
    </div>
  ) : null;
}

// --- Toast liviano ---
function Toast({ type = "ok", msg, onClose }) {
  const bg = type === "ok" ? "#10b981" : "#ef4444";
  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        top: 16,
        zIndex: 1000,
        background: bg,
        color: "white",
        padding: "10px 14px",
        borderRadius: 12,
        boxShadow: "0 10px 25px rgba(0,0,0,.18)",
        maxWidth: 360,
      }}
      onClick={onClose}
      role="alert"
      title="Cerrar"
    >
      {msg}
    </div>
  );
}

// --- Modal Historial de Facturas ---
function HistorialFacturasModal({ open, onClose }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [sel, setSel] = useState(null);
  const [detalle, setDetalle] = useState([]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setSel(null);
    setDetalle([]);
    (async () => {
      try {
        const { data } = await api.get("/api/facturaEncabezado/listarFacturas");
        setList(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!sel) return;
    (async () => {
      try {
        const { data } = await api.get(
          `/api/facturaDetalle/listarFacturaDetalle?factura_id=${sel.id}`
        );
        setDetalle(data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [sel]);

  const filtered = useMemo(() => {
    const d1 = desde ? new Date(desde) : null;
    const d2 = hasta ? new Date(`${hasta}T23:59:59`) : null;
    return (list || []).filter((f) => {
      const d = new Date(f.fecha_emision);
      if (d1 && d < d1) return false;
      if (d2 && d > d2) return false;
      return true;
    });
  }, [list, desde, hasta]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div 
        className="modal" 
        style={{ 
          width: "90vw",
          maxWidth: 1400,
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <h3>Historial de facturas</h3>

        <div className="grid-2" style={{ gridTemplateColumns: "180px 180px 1fr" }}>
          <label>
            Desde
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </label>
          <label>
            Hasta
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </label>
          <div style={{ alignSelf: "end", color: "#6b7280" }}>
            {loading ? "Cargando…" : `${filtered.length} resultado(s)`}
          </div>
        </div>

        <div className="card" style={{ marginTop: 10, maxHeight: 420, overflow: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 120 }}>Fecha</th>
                <th style={{ width: 120 }}>No.</th>
                <th>Paciente</th>
                <th>Usuario</th>
                <th style={{ width: 120, textAlign: "right" }}>Total</th>
                <th style={{ width: 120 }}>Estado</th>
                <th style={{ width: 120 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id}>
                  <td>{new Date(f.fecha_emision).toLocaleDateString()}</td>
                  <td>{[f.serie, f.numero].filter(Boolean).join("-")}</td>
                  <td>{f.paciente || "—"}</td>
                  <td>{f.usuario || "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    Q{Number(f.total ?? 0).toFixed(2)}
                  </td>
                  <td>{f.estado}</td>
                  <td>
                    <button className="btn mini" onClick={() => setSel(f)}>
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: "#6b7280", padding: "8px 0" }}>
                    Sin resultados para el rango seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {sel && (
          <div className="card" style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>
                Detalle factura #{[sel.serie, sel.numero].filter(Boolean).join("-")}
              </b>
              <button className="btn mini" onClick={() => setSel(null)}>
                Cerrar detalle
              </button>
            </div>
            <div style={{ overflowX: "auto", marginTop: 6 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th style={{ width: 120, textAlign: "right" }}>Cantidad</th>
                    <th style={{ width: 120, textAlign: "right" }}>Precio</th>
                    <th style={{ width: 120, textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.map((d) => (
                    <tr key={d.id}>
                      <td>{d.codigo || d.producto_id}</td>
                      <td>{d.descripcion}</td>
                      <td style={{ textAlign: "right" }}>{Number(d.cantidad).toFixed(0)}</td>
                      <td style={{ textAlign: "right" }}>Q{Number(d.precio_unit).toFixed(2)}</td>
                      <td style={{ textAlign: "right" }}>Q{Number(d.total_linea).toFixed(2)}</td>
                    </tr>
                  ))}
                  {detalle.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ color: "#6b7280", padding: "8px 0" }}>
                        Sin líneas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

/* --- Pantalla principal --- */
export default function Facturacion() {
  const [hdr, setHdr] = useState(EMPTY_HDR);
  const [pacientes, setPacientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [histOpen, setHistOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [carrito, setCarrito] = useState({});

  // cargar catálogos
  useEffect(() => {
    (async () => {
      try {
        const [pacs, prods] = await Promise.all([
          api.get("/api/paciente/listarPaciente"),
          api.get("/api/productos/listarProductos"),
        ]);
        setPacientes(pacs.data || []);
        setProductos(prods.data || []);
      } catch (e) {
        alert(e?.response?.data?.error || "No fue posible cargar catálogos");
      }
    })();
  }, []);

  const agregarVarios = (arr) => {
    setCarrito((c) => {
      const copy = { ...c };
      arr.forEach((it) => {
        const id = it.producto_id;
        const prev = copy[id];
        copy[id] = {
          ...it,
          qty: (prev?.qty || 0) + Number(it.qty || 1),
        };
      });
      return copy;
    });
  };

  const cambiarQty = (id, qty) => {
    setCarrito((c) => {
      const n = Math.max(0, Number(qty || 0));
      if (n === 0) {
        const cp = { ...c };
        delete cp[id];
        return cp;
      }
      return { ...c, [id]: { ...c[id], qty: n } };
    });
  };

  const { subtotal, impuestos, total } = useMemo(() => {
    const sub = Object.values(carrito).reduce(
      (acc, it) => acc + Number(it.precio || 0) * Number(it.qty || 0),
      0
    );
    const imp = +(sub * 0.12).toFixed(2);
    const tot = +(sub + imp).toFixed(2);
    return {
      subtotal: +sub.toFixed(2),
      impuestos: imp,
      total: tot,
    };
  }, [carrito]);

  const [saving, setSaving] = useState(false);

  const emitirFactura = async () => {
    try {
      if (!hdr.numero) return alert("Ingresa el número de factura");
      if (Object.values(carrito).length === 0) return alert("Agrega al menos un producto");

      setSaving(true);
      const user = getUser();

      // 1) Crear encabezado
      const payloadHdr = {
        serie: hdr.serie || null,
        numero: String(hdr.numero).trim(),
        fecha_emision: hdr.fecha || null,
        paciente_id: hdr.paciente_id ? Number(hdr.paciente_id) : null,
        nit: hdr.nit || null,
        direccion: hdr.direccion || null,
        subtotal,
        impuestos,
        total,
        usuario_id: user?.id ?? null,
      };

      const { data: enc } = await api.post(
        "/api/facturaEncabezado/crearFacturas",
        payloadHdr
      );

      const items = Object.values(carrito);
      await Promise.all(
        items.map((it) =>
          api.post("/api/facturaDetalle/crearFacturaDetalle", {
            factura_id: enc.id,
            producto_id: it.producto_id,
            codigo: it.codigo || null,
            descripcion: it.nombre,
            cantidad: Number(it.qty || 1),
            precio_unit: Number(it.precio || 0),
            total_linea: round2(Number(it.precio || 0) * Number(it.qty || 1)),
          })
        )
      );

      // alert(`✔️ Factura emitida #${enc.numero} por Q${total.toFixed(2)}`);
      setToast({ type: "ok", msg: `✔️ Factura emitida #${enc.numero} por Q${total.toFixed(2)}` });
      // limpiar
      setHdr({ ...EMPTY_HDR, fecha: new Date().toISOString().slice(0, 10) });
      setCarrito({});
    } catch (e) {
      const msg =
        e?.response?.status === 409
          ? "El número de factura ya existe"
          : e?.response?.data?.error || "Error al emitir factura";
      // alert(msg);
      setToast({ type: "error", msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bill-wrap">
      <header className="bill-header">
        <h2>VetControl Facturación</h2>
        <div className="empresa">&nbsp;</div>
        <button className="btn btn-primary" onClick={() => setHistOpen(true)}>Historial</button>
      </header>

      {/* Datos del encabezado */}
      <section className="bill-row card">
        <div className="grid-2">
          <label>
            Serie
            <input
              value={hdr.serie}
              onChange={(e) => setHdr((h) => ({ ...h, serie: e.target.value }))}
              placeholder="Ej. A"
            />
          </label>
          <label>
            Número *
            <input
              value={hdr.numero}
              onChange={(e) => setHdr((h) => ({ ...h, numero: e.target.value }))}
              placeholder="Consecutivo"
            />
          </label>
          <label>
            Fecha
            <input
              type="date"
              value={hdr.fecha}
              onChange={(e) => setHdr((h) => ({ ...h, fecha: e.target.value }))}
            />
          </label>

          <label className="selectIndividual">
            Paciente
            <select
              value={hdr.paciente_id}
              onChange={(e) => setHdr((h) => ({ ...h, paciente_id: e.target.value }))}
            >
              <option value="">(opcional)</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            NIT
            <input
              value={hdr.nit}
              onChange={(e) => setHdr((h) => ({ ...h, nit: e.target.value }))}
              placeholder="NIT / DPI"
            />
          </label>
          <label>
            Dirección
            <input
              value={hdr.direccion}
              onChange={(e) => setHdr((h) => ({ ...h, direccion: e.target.value }))}
              placeholder="Dirección fiscal"
            />
          </label>
        </div>
      </section>

      <div className="bill-grid">
        {/* izquierda: buscador + detalle */}
        <section className="left">
          <div className="card">
            <h3>Productos</h3>
            <div className="picker-trigger">
              <input
                className="search big"
                placeholder="Descripción o código… (Enter para buscar)"
                onKeyDown={(e) => e.key === "Enter" && setPickerOpen(true)}
                onFocus={() => setPickerOpen(false)}
              />
              <button className="btn mini" onClick={() => setPickerOpen(true)}>
                Buscar
              </button>
            </div>
          </div>

          <div className="card" style={{ marginTop: ".75rem" }}>
            <h3>Detalle</h3>
            {Object.values(carrito).length === 0 && (
              <div className="muted">No hay productos agregados.</div>
            )}
            {Object.values(carrito).map((it) => (
              <div key={it.producto_id} className="cart-row">
                <div className="c-name">
                  <b>{it.codigo || it.producto_id}</b> — {it.nombre}
                </div>
                <div className="c-qty">
                  <input
                    type="number"
                    min={0}
                    value={it.qty}
                    onChange={(e) => cambiarQty(it.producto_id, Number(e.target.value))}
                  />
                  <span className="x">@ Q{Number(it.precio).toFixed(2)}</span>
                </div>
                <div className="c-sub">
                  Q{(Number(it.precio) * Number(it.qty)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* derecha: resumen */}
        <aside className="resume card">
          <h3>Resumen de Factura</h3>
          <div className="r-line">
            <span>Subtotal:</span>
            <b>Q{subtotal.toFixed(2)}</b>
          </div>
          <div className="r-line">
            <span>Impuestos (12%):</span>
            <b>Q{impuestos.toFixed(2)}</b>
          </div>
          <div className="r-total">
            <span>Total:</span>
            <b>Q{total.toFixed(2)}</b>
          </div>

          <button className="btn btn-primary wide" disabled={saving} onClick={emitirFactura}>
            {saving ? "Guardando..." : "Emitir Factura"}
          </button>
        </aside>
      </div>

      {/* Modal selección de productos */}
      {toast && <Toast type={toast.type} msg={toast.msg} onClose={() => setToast(null)} />}
      <HistorialFacturasModal open={histOpen} onClose={() => setHistOpen(false)} />
      <PickerProductos
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onAdd={agregarVarios}
        catalogo={productos}
      />
    </div>
  );
}