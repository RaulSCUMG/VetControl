import React, { useMemo, useState } from "react";
import StatCard from "../components/StatCard";


const toCSV = (rows) => {
    if (!rows?.length) return "";
    const headers = Object.keys(rows[0]);
    const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
    const body = rows
        .map((r) => headers.map((h) => esc(r[h])).join(","))
        .join("\n");            // <-- antes quedó como una comilla+salto real
    return headers.join(",") + "\n" + body;   // <-- aquí también
};
;

const download = (filename, text) => {
    const el = document.createElement("a");
    el.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(text));
    el.setAttribute("download", filename);
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
};

const formatQ = (n) =>
    new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ", minimumFractionDigits: 2 }).format(n || 0);

const parseISO = (s) => (s ? new Date(s + (s.length === 10 ? "T00:00:00" : "")) : null);

// ---------------- Datos demo (quítalos al conectar API) ----------------
const demoVentas = [
    { fecha: "2025-09-01", cliente: "María López", servicio: "Consulta", total: 150 },
    { fecha: "2025-09-02", cliente: "Carlos Pérez", servicio: "Vacuna Rabia", total: 220 },
    { fecha: "2025-09-02", cliente: "Ana Gómez", servicio: "Esterilización", total: 1200 },
    { fecha: "2025-09-03", cliente: "Pedro Méndez", servicio: "Baño y estética", total: 180 },
];

const demoInventario = [
    { sku: "MED-001", producto: "Ivermectina 10ml", stock: 12, minimo: 10, vence: "2026-01-30" },
    { sku: "VAC-002", producto: "Vacuna Triple Felina", stock: 3, minimo: 8, vence: "2025-11-10" },
    { sku: "ALI-015", producto: "Alimento Puppy 7kg", stock: 21, minimo: 6, vence: "2026-05-05" },
];

const demoPacientes = [
    { fecha: "2025-09-02", mascota: "Firulais", especie: "Canino", accion: "Vacunación", proxima: "2026-09-02" },
    { fecha: "2025-09-03", mascota: "Michi", especie: "Felino", accion: "Desparasitación", proxima: "2025-12-03" },
    { fecha: "2025-09-03", mascota: "Kira", especie: "Canino", accion: "Control post-op", proxima: "2025-09-10" },
];

const demoEstrategia = [
    { periodo: "2025-08", nuevosClientes: 23, ticketsProm: 2.1, ingresoTotal: 18250 },
    { periodo: "2025-09", nuevosClientes: 18, ticketsProm: 2.4, ingresoTotal: 20580 },
];

// ---------------- Microcomponentes UI ----------------
const Badge = ({ children }) => (
    <span className="badge" style={{ marginLeft: 8 }}>{children}</span>
);

const Sparkbar = ({ data = [], max, height = 28 }) => {
    const m = max ?? Math.max(1, ...data);
    return (
        <div className="sparkbar" style={{ display: "flex", gap: 3, alignItems: "flex-end", height }}>
            {data.map((v, i) => (
                <div key={i} style={{ width: 6, height: Math.max(2, (v / m) * height), borderRadius: 3 }} className="sparkbar-bar" />
            ))}
        </div>
    );
};

const BarRow = ({ label, value, max }) => (
    <div className="barrow">
        <div className="barrow-label">{label}</div>
        <div className="barrow-track">
            <div className="barrow-fill" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
        </div>
        <div className="barrow-value">{value}</div>
    </div>
);

function Filters({ startDate, endDate, setStartDate, setEndDate, search, setSearch, onExport, onQuick }) {
    return (
        <div className="card sticky-filters">
            <div className="filters-grid">
                <label>
                    <div className="label">Desde</div>
                    <input className="date-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label>
                    <div className="label">Hasta</div>
                    <input className="date-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </label>
                <label className="col-2">
                    <div className="label">Buscar</div>
                    <input className="field" type="text" placeholder="Cliente, servicio, mascota…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </label>
                <div className="actions">
                    <div className="quick">
                        <button className="chip" onClick={() => onQuick("today")}>Hoy</button>
                        <button className="chip" onClick={() => onQuick("7d")}>7d</button>
                        <button className="chip" onClick={() => onQuick("30d")}>30d</button>
                        <button className="chip" onClick={() => onQuick("all")}>Todo</button>
                    </div>
                    <div className="spacer" />
                    <button className="btn" onClick={onExport}>Exportar CSV</button>
                </div>
            </div>
        </div>
    );
}

function Table({ rows }) {
    if (!rows?.length) return <div className="muted">Sin datos en el rango/criterio.</div>;
    const columns = Object.keys(rows[0]);
    return (
        <div className="table-card">
            <table className="table table-hover table-zebra">
                <thead className="sticky">
                    <tr>
                        {columns.map((c) => (
                            <th key={c}>{c.toUpperCase()}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            {columns.map((c) => {
                                const v = r[c];
                                const isNum = typeof v === "number";
                                const isMoney = c.toLowerCase().includes("total") || c.toLowerCase().includes("ingreso");
                                return (
                                    <td key={c} style={{ textAlign: isNum ? "right" : undefined, whiteSpace: c === "fecha" ? "nowrap" : undefined }}>
                                        {isMoney ? formatQ(v) : String(v)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ---------------- Secciones ----------------
function AdminReport({ startDate, endDate, search }) {
    const filtered = useMemo(() => {
        return demoVentas.filter((v) => {
            const okDate = (!startDate || v.fecha >= startDate) && (!endDate || v.fecha <= endDate);
            const q = (search || "").toLowerCase();
            const okText = !q || [v.cliente, v.servicio].some((x) => x.toLowerCase().includes(q));
            return okDate && okText;
        });
    }, [startDate, endDate, search]);

    const total = filtered.reduce((s, x) => s + x.total, 0);
    const tickets = filtered.length;
    const prom = tickets ? total / tickets : 0;

    const byFechaSeries = useMemo(() => {
        const map = new Map();
        filtered.forEach((v) => map.set(v.fecha, (map.get(v.fecha) || 0) + v.total));
        return Array.from(map.entries()).sort(([a], [b]) => (a > b ? 1 : -1)).map(([, v]) => v);
    }, [filtered]);

    const byServicio = useMemo(() => {
        const map = new Map();
        filtered.forEach((v) => map.set(v.servicio, (map.get(v.servicio) || 0) + 1));
        const arr = Array.from(map.entries()).map(([k, v]) => ({ servicio: k, conteo: v }));
        arr.sort((a, b) => b.conteo - a.conteo);
        return arr.slice(0, 4);
    }, [filtered]);

    const maxSvc = Math.max(1, ...byServicio.map((x) => x.conteo));

    return (
        <>
            <section className="stats-grid">
                <div className="card kpi">
                    <div className="kpi-row">
                        <StatCard title="Ingresos" value={formatQ(total)} />
                        <Sparkbar data={byFechaSeries} />
                    </div>
                </div>
                <StatCard title="Tickets" value={tickets} />
                <StatCard title="Ticket prom." value={formatQ(prom)} />
                <StatCard title="Servicios" value={[...new Set(filtered.map((x) => x.servicio))].length} />
            </section>

            <div className="grid-2">
                <div className="card">
                    <h3>Ventas</h3>
                    <Table rows={filtered} />
                </div>
                <div className="card">
                    <h3>Top servicios</h3>
                    {byServicio.length ? (
                        <div className="barrow-list">
                            {byServicio.map((x) => (
                                <BarRow key={x.servicio} label={x.servicio} value={x.conteo} max={maxSvc} />
                            ))}
                        </div>
                    ) : (
                        <div className="muted">Sin datos</div>
                    )}
                </div>
            </div>
        </>
    );
}

function ClinicalReport({ startDate, endDate, search }) {
    const filtered = useMemo(() => {
        return demoPacientes.filter((v) => {
            const okDate = (!startDate || v.fecha >= startDate) && (!endDate || v.fecha <= endDate);
            const q = (search || "").toLowerCase();
            const okText = !q || [v.mascota, v.especie, v.accion].some((x) => x.toLowerCase().includes(q));
            return okDate && okText;
        });
    }, [startDate, endDate, search]);

    const proximas = filtered.filter((x) => x.proxima && x.proxima <= new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10)).length;

    const inventarioBajo = demoInventario.filter((i) => i.stock <= i.minimo);
    const maxStock = Math.max(1, ...inventarioBajo.map((i) => i.minimo));

    return (
        <>
            <section className="stats-grid">
                <StatCard title="Eventos clínicos" value={filtered.length} />
                <StatCard title="Mascotas únicas" value={[...new Set(filtered.map((x) => x.mascota))].length} />
                <StatCard title="Próximas (≤30d)" value={proximas} />
                <StatCard title="Inventario bajo" value={inventarioBajo.length} />
            </section>

            <div className="grid-2">
                <div className="card">
                    <h3>Pacientes / Acciones</h3>
                    <Table rows={filtered} />
                </div>
                <div className="card">
                    <h3>Inventario en alerta</h3>
                    {inventarioBajo.length ? (
                        <div className="barrow-list">
                            {inventarioBajo.map((i) => (
                                <BarRow key={i.sku} label={`${i.producto} (${i.stock}/${i.minimo})`} value={i.minimo - i.stock} max={maxStock} />
                            ))}
                        </div>
                    ) : (
                        <div className="muted">Sin alertas</div>
                    )}
                </div>
            </div>

            <div className="card">
                <h3>Inventario completo</h3>
                <Table rows={demoInventario} />
            </div>
        </>
    );
}

function StrategyReport({ startDate, endDate, search }) {
    const filtered = useMemo(() => {
        return demoEstrategia.filter((v) => {
            const p = v.periodo + "-01"; // YYYY-MM-01
            const okDate = (!startDate || p >= startDate) && (!endDate || p <= endDate);
            return okDate;
        });
    }, [startDate, endDate]);

    const searched = useMemo(() => {
        const q = (search || "").toLowerCase();
        return !q ? filtered : filtered.filter((v) => Object.values(v).some((x) => String(x).toLowerCase().includes(q)));
    }, [filtered, search]);

    const ingresoTotal = searched.reduce((s, x) => s + x.ingresoTotal, 0);
    const nuevos = searched.reduce((s, x) => s + x.nuevosClientes, 0);
    const ticketPromGlobal = (searched.reduce((s, x) => s + x.ticketsProm, 0) / (searched.length || 1)).toFixed(2);

    return (
        <>
            <section className="stats-grid">
                <StatCard title="Ingreso total" value={formatQ(ingresoTotal)} />
                <StatCard title="Nuevos clientes" value={nuevos} />
                <StatCard title="Ticket prom. (global)" value={ticketPromGlobal} />
                <StatCard title="Periodos" value={searched.length} />
            </section>
            <div className="card">
                <h3>Crecimiento / Mix</h3>
                <Table rows={searched} />
            </div>
        </>
    );
}

// ---------------- Página principal ----------------
export default function Reportes() {
    const [tab, setTab] = useState("Administrativos");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [search, setSearch] = useState("");

    const onExport = () => {
        let rows = [];
        if (tab === "Administrativos") rows = demoVentas;
        if (tab === "Clínicos") rows = demoPacientes;
        if (tab === "Estratégicos") rows = demoEstrategia;
        download(`reporte_${tab.toLowerCase()}.csv`, toCSV(rows));
    };

    const applyQuick = (kind) => {
        const today = new Date();
        if (kind === "today") {
            const y = today.toISOString().slice(0, 10);
            setStartDate(y); setEndDate(y);
        }
        if (kind === "7d") {
            const d = new Date(today); d.setDate(d.getDate() - 6);
            setStartDate(d.toISOString().slice(0, 10));
            setEndDate(today.toISOString().slice(0, 10));
        }
        if (kind === "30d") {
            const d = new Date(today); d.setDate(d.getDate() - 29);
            setStartDate(d.toISOString().slice(0, 10));
            setEndDate(today.toISOString().slice(0, 10));
        }
        if (kind === "all") {
            setStartDate(""); setEndDate("");
        }
    };

    const countAdmin = useMemo(() => demoVentas.length, []);
    const countClin = useMemo(() => demoPacientes.length, []);
    const countStrat = useMemo(() => demoEstrategia.length, []);

    return (
        <div className="dashboard">
            <section className="stats-grid" style={{ marginBottom: 0 }}>
                <StatCard title="Módulo" value={tab} />
                <StatCard title="Rango" value={`${startDate || '—'} → ${endDate || '—'}`} />
                <StatCard title="Filtro" value={search || "(sin filtro)"} />
            </section>

            <div className="card" style={{ paddingBottom: 8 }}>
                <div className="tabs">
                    {[
                        { k: "Reportes Administrativos"},
                        { k: "Reportes Clínicos"},
                        { k: "Reportes Estratégicos"},
                    ].map(({ k, n }) => (
                        <button
                            key={k}
                            className={`pill ${k === tab ? 'active' : ''}`}
                            aria-current={k === tab ? 'page' : undefined}
                            onClick={() => setTab(k)}
                        >
                            {k}
                        </button>
                    ))}
                </div>
            </div>

            <Filters
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                search={search}
                setSearch={setSearch}
                onExport={onExport}
                onQuick={applyQuick}
            />

            {tab === "Reportes Administrativos" && (
                <AdminReport startDate={startDate} endDate={endDate} search={search} />
            )}
            {tab === "Reportes Clínicos" && (
                <ClinicalReport startDate={startDate} endDate={endDate} search={search} />
            )}
            {tab === "Reportes Estratégicos" && (
                <StrategyReport startDate={startDate} endDate={endDate} search={search} />
            )}

            <style>{`
        .sticky-filters { position: sticky; top: 12px; z-index: 5; backdrop-filter: saturate(1.2) blur(2px); }
        .filters-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; align-items: end; }
        .filters-grid .col-2 { grid-column: span 2 / span 2; }
        .actions { display:flex; align-items:center; gap:12px; }
        .quick { display:flex; gap:8px; }
        .chip { padding:6px 10px; border-radius: 999px; border: 1px solid var(--line,#e6e6e6); background: var(--bg, #fff); box-shadow: var(--shadow-sm); }
        .badge { font-size: 12px; padding: 2px 8px; border-radius: 999px; background: #eef2ff; border: 1px solid #dbeafe; }
        .table .sticky { position: sticky; top: 0; background: var(--surface,#fff); }
        .table-zebra tbody tr:nth-child(odd) { background: rgba(0,0,0,0.015); }
        .table-hover tbody tr:hover { background: rgba(0,0,0,0.04); transition: background .15s ease; }
        .grid-2 { display:grid; grid-template-columns: 1.2fr 1fr; gap: 12px; }
        .kpi .kpi-row { display:flex; gap:12px; align-items:center; }
        .sparkbar-bar { background: linear-gradient(180deg,#a5b4fc,#6366f1); }
        .barrow { display:grid; grid-template-columns: 1fr 1fr auto; gap:10px; align-items:center; margin-bottom:8px; }
        .barrow-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .barrow-track { height:8px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
        .barrow-fill { height:100%; background: #34d399; }
        .barrow-value { font-variant-numeric: tabular-nums; }
        @media (max-width: 900px){ .filters-grid { grid-template-columns: 1fr 1fr; } .filters-grid .col-2 { grid-column: span 2 / span 2; } .grid-2 { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    );
}
