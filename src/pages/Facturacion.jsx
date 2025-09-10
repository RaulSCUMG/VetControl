import { useMemo, useState } from "react";

const CATALOGO = [
  { id: "P001", nombre: "Consulta General", precio: 50 },
  { id: "P002", nombre: "Vacunación", precio: 30.99 },
  { id: "P101", nombre: "Antipulgas", precio: 45 },
  { id: "P102", nombre: "Antibiótico", precio: 85.5 },
];

/* --- Modal selector de productos --- */
function PickerProductos({ open, onClose, onAdd }) {
  // Hooks SIEMPRE arriba y sin returns antes
  const [query, setQuery] = useState("");
  const [seleccion, setSeleccion] = useState({}); // id -> qty

  const lista = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return CATALOGO;
    return CATALOGO.filter(
      (p) => p.id.toLowerCase().includes(t) || p.nombre.toLowerCase().includes(t)
    );
  }, [query]);

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
    const agregados = Object.entries(seleccion)
      .map(([id, qty]) => {
        const p = CATALOGO.find((x) => x.id === id);
        return p ? { ...p, qty } : null;   // sin '!' (TS)
      })
      .filter(Boolean); // quita nulls
    if (agregados.length === 0) return onClose();
    onAdd(agregados);
    onClose();
  };

  // Render condicional al final (hooks ya se llamaron)
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
                  <b>{p.id}</b> — {p.nombre}
                </div>
                <div className="pk-price">Q{p.precio.toFixed(2)}</div>
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


/* --- Pantalla principal --- */
export default function Facturacion() {
  const [paciente, setPaciente] = useState("");
  const [nit, setNit] = useState("");
  const [direccion, setDireccion] = useState("");

  const [carrito, setCarrito] = useState({}); // id -> {id, nombre, precio, qty}
  const [pickerOpen, setPickerOpen] = useState(false);
  const [inputProductos, setInputProductos] = useState(""); // solo visual

  const agregarVarios = (arr) => {
    // fusiona cantidades si ya existían
    setCarrito((c) => {
      const copy = { ...c };
      arr.forEach(({ id, nombre, precio, qty }) => {
        const prev = copy[id];
        copy[id] = {
          id,
          nombre,
          precio,
          qty: (prev?.qty || 0) + qty,
        };
      });
      return copy;
    });
    setInputProductos(""); // limpiar input
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

  // totales (IVA 12% demo)
  const { subtotal, impuestos, descuentos, total } = useMemo(() => {
    const sub = Object.values(carrito).reduce(
      (acc, it) => acc + it.precio * it.qty,
      0
    );
    const imp = +(sub * 0.12).toFixed(2);
    const desc = 0;
    const tot = +(sub + imp - desc).toFixed(2);
    return {
      subtotal: +sub.toFixed(2),
      impuestos: imp,
      descuentos: desc,
      total: tot,
    };
  }, [carrito]);

  const emitirFactura = () => {
    const payload = {
      paciente,
      nit,
      direccion,
      items: Object.values(carrito),
      totales: { subtotal, impuestos, descuentos, total },
      fecha: new Date().toISOString(),
    };
    console.log("FACTURA", payload);
    alert("Factura emitida (demo). Revisa la consola para ver el JSON.");
  };

  return (
    <div className="bill-wrap">
      <header className="bill-header">
        <h2>VetControl Facturación</h2>
      </header>

      {/* Datos del cliente */}
      <section className="bill-row card">
        <div className="grid-2">
          <label>
            Paciente
            <input
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
              placeholder="Nombre del paciente"
            />
          </label>
          <label>
            NIT
            <input
              value={nit}
              onChange={(e) => setNit(e.target.value)}
              placeholder="NIT / DPI"
            />
          </label>
          <label>
            Dirección
            <input
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección fiscal"
            />
            </label>
        </div>
      </section>

      <div className="bill-grid">
        {/* izquierda: input que abre modal + detalle */}
        <section className="left">
          <div className="card">
            <h3>Productos</h3>
            <div className="picker-trigger">
              <input
                className="search big"
                placeholder="Descripción o código… (Enter para buscar)"
                value={inputProductos}
                onChange={(e) => setInputProductos(e.target.value)}
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
              <div key={it.id} className="cart-row">
                <div className="c-name">
                  <b>{it.id}</b> — {it.nombre}
                </div>
                <div className="c-qty">
                  <input
                    type="number"
                    min={0}
                    value={it.qty}
                    onChange={(e) => cambiarQty(it.id, Number(e.target.value))}
                  />
                  <span className="x">@ Q{it.precio.toFixed(2)}</span>
                </div>
                <div className="c-sub">Q{(it.precio * it.qty).toFixed(2)}</div>
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
            <span>Impuestos:</span>
            <b>Q{impuestos.toFixed(2)}</b>
          </div>
          <div className="r-line">
            <span>Descuentos:</span>
            <b>Q{descuentos.toFixed(2)}</b>
          </div>
          <div className="r-total">
            <span>Total:</span>
            <b>Q{total.toFixed(2)}</b>
          </div>

          <button className="btn btn-primary wide" onClick={emitirFactura}>
            Emitir Factura
          </button>
        </aside>
      </div>

      {/* Modal de selección */}
      <PickerProductos
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onAdd={agregarVarios}
      />
    </div>
  );
}
