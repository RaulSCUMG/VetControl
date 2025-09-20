import { useEffect, useMemo, useState, useCallback } from "react";
import StatCard from "../components/StatCard";
import api from "../lib/api";



const toCSV = (rows) => {
    if (!rows?.length) return "";
    const headers = Object.keys(rows[0]);
    const esc = (v) => `"${String(v ?? "").replaceAll('"', '""').replaceAll('\n', ' ')}"`;
    const body = rows.map(r => headers.map(h => esc(r[h])).join(",")).join("\n");
    return headers.join(",") + "\n" + body;
};

const download = (filename, csvText) => {

    const blob = new Blob(["\uFEFF", csvText], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};




const formatQ = (n) =>
    new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ", minimumFractionDigits: 2 }).format(n || 0);

const parseISO = (s) => (s ? new Date(s + (s.length === 10 ? "T00:00:00" : "")) : null);

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

    const first = rows[0];
    const columns = Object.keys(first).map(k => ({
        key: k,
        isNum:
            typeof first[k] === "number" ||
            /ingreso|total|prom|ticket|cliente?s?$|count|nuevos/i.test(k),
    }));

    const HEADER = {
        periodo: "Periodo",
        ingresoTotal: "Ingreso total",
        tickets: "Tickets",
        ticketsProm: "Ticket prom.",
        nuevosClientes: "Clientes",
    };
    const prettify = (k) =>
        HEADER[k] ||
        k.replace(/_/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="table-card">
            <table className="table table-hover table-zebra">
                <colgroup>
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "26%" }} />
                    <col style={{ width: "26%" }} />
                    <col style={{ width: "26%" }} />
                </colgroup>

                <thead className="sticky">
                    <tr>
                        {columns.map(c => (
                            <th key={c.key} style={{ textAlign: c.isNum ? "right" : "left" }}>
                                {prettify(c.key)}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            {columns.map(c => {
                                const v = r[c.key];
                                const isMoney = c.key.toLowerCase().includes("ingreso");
                                return (
                                    <td key={c.key} style={{ textAlign: c.isNum ? "right" : "left" }}>
                                        {isMoney ? formatQ(Number(v) || 0) : String(v)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
        .table-card table { width: 100%; table-layout: fixed; border-collapse: separate; }
        .table-card th, .table-card td { padding: 10px 12px; vertical-align: middle; }
    `}</style>
        </div>
    );
}


function VentasTable({ rows }) {
    if (!rows?.length) return <div className="muted">Sin ventas en el rango.</div>;

    return (
        <div className="ventas-table">
            <table>
                <colgroup>
                    <col style={{ width: "18%" }} /> {/* Fecha */}
                    <col style={{ width: "22%" }} /> {/* Cliente */}
                    <col style={{ width: "44%" }} /> {/* Servicio */}
                    <col style={{ width: "16%" }} /> {/* Total */}
                </colgroup>

                <thead>
                    <tr>
                        <th className="center">Fecha</th>
                        <th className="center">Cliente</th>
                        <th className="left">Servicio</th>
                        <th className="right">Total</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((v, i) => (
                        <tr key={i}>
                            <td className="center nowrap">{v.fecha}</td>
                            <td className="center nowrap">{v.cliente}</td>
                            <td className="left">{v.servicio}</td>
                            <td className="right tabnums">{formatQ(Number(v.total) || 0)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
        .ventas-table table{
            width:100%;
            table-layout:fixed;
            border-collapse:separate;
            border-spacing:0;
        }
        .ventas-table th, .ventas-table td{
            padding:12px 16px;
            vertical-align:middle;
            line-height:1.25;
        }
        .ventas-table thead th{
            font-weight:600;
            color:#4a5568;
            background:#f7f9ff;
        }
        .ventas-table .left{ text-align:left; }
        .ventas-table .center{ text-align:center; }
        .ventas-table .right{ text-align:right; }
        .ventas-table .nowrap{ white-space:nowrap; }
        .ventas-table .tabnums{ font-variant-numeric: tabular-nums; }
        .ventas-table tbody tr + tr td{ border-top:1px solid #edf2f7; }
        .ventas-table tbody tr:hover td{ background:#fafbff; }
    `}</style>
        </div>
    );
}



// ---------------- Secciones ----------------
function AdminReport({ startDate, endDate, search, ventas }) {
    const filtered = useMemo(() => {
        return ventas.filter((v) => {
            const okDate = (!startDate || v.fecha >= startDate) && (!endDate || v.fecha <= endDate);
            const q = (search || "").toLowerCase();
            const okText = !q || [v.cliente, v.servicio].some((x) => x.toLowerCase().includes(q));
            return okDate && okText;
        });
    }, [startDate, endDate, search, ventas]);

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
                    <VentasTable rows={filtered} />
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

function ClinicalReport({ startDate, endDate, search, pacientes, inventario }) {
    const filtered = useMemo(() => {
        return pacientes.filter((v) => {
            const okDate = (!startDate || v.fecha >= startDate) && (!endDate || v.fecha <= endDate);
            const q = (search || "").toLowerCase();
            const okText = !q || [v.mascota, v.especie, v.accion].some((x) => x.toLowerCase().includes(q));
            return okDate && okText;
        });
    }, [startDate, endDate, search, pacientes]);


    const inventarioBajo = inventario.filter((i) => i.stock <= i.minimo);
    const maxStock = Math.max(1, ...inventarioBajo.map((i) => i.minimo));

    return (
        <>
            <section className="stats-grid">
                <StatCard title="Eventos clínicos" value={filtered.length} />
                <StatCard title="Mascotas únicas" value={[...new Set(filtered.map((x) => x.mascota))].length} />
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
                <Table rows={inventario} />
            </div>
        </>
    );
}

function StrategyReport({ startDate, endDate, search, crecimiento }) {
    const base = useMemo(() => {
        return (crecimiento || []).map((v) => ({
            periodo: (v.periodo || (v.fecha || "").slice(0, 7)),
            responsable: v.responsable || "",
            ingreso: Number(v.ingresoTotal ?? v["ingreso total"] ?? v.total ?? 0),
        }));
    }, [crecimiento]);

    const filtered = useMemo(() => {
        const toYM = (d) => (d ? d.slice(0, 7) : "");
        const minYM = toYM(startDate);
        const maxYM = toYM(endDate);
        return base.filter(v =>
            (!startDate || v.periodo >= minYM) &&
            (!endDate || v.periodo <= maxYM)
        );
    }, [base, startDate, endDate]);


    const firstSeen = useMemo(() => {
        const m = new Map();
        base.forEach(v => { if (!m.has(v.responsable) || v.periodo < m.get(v.responsable)) m.set(v.responsable, v.periodo); });
        return m;
    }, [base]);

    const rows = useMemo(() => {
        const agg = new Map();
        filtered.forEach(v => {
            const cur = agg.get(v.periodo) || { periodo: v.periodo, ingresoTotal: 0, tickets: 0, nuevosClientes: 0 };
            cur.ingresoTotal += v.ingreso;
            cur.tickets += 1;
            if (firstSeen.get(v.responsable) === v.periodo) cur.nuevosClientes += 1;
            agg.set(v.periodo, cur);
        });
        return [...agg.values()]
            .map(x => ({ ...x, ticketsProm: x.tickets ? x.ingresoTotal / x.tickets : 0 }))
            .sort((a, b) => (a.periodo > b.periodo ? 1 : -1));
    }, [filtered, firstSeen]);

    const searched = useMemo(() => {
        const q = (search || "").toLowerCase();
        return !q ? rows : rows.filter(r => Object.values(r).some(x => String(x).toLowerCase().includes(q)));
    }, [rows, search]);

    const ingresoTotal = searched.reduce((s, x) => s + x.ingresoTotal, 0);
    const tickets = searched.reduce((s, x) => s + x.tickets, 0);
    const nuevos = searched.reduce((s, x) => s + x.nuevosClientes, 0);
    const ticketPromGlobal = tickets ? ingresoTotal / tickets : 0;

    return (
        <>
            <section className="stats-grid">
                <StatCard title="Ingreso total" value={formatQ(ingresoTotal)} />
                <StatCard title="Nuevos clientes" value={nuevos} />
                <StatCard title="Ticket prom. (global)" value={formatQ(ticketPromGlobal)} />
                <StatCard title="Periodos" value={searched.length} />
            </section>
            <div className="card">
                <h3>Crecimiento mensual</h3>
                <Table rows={searched.map(({ periodo, ingresoTotal, ticketsProm, nuevosClientes }) => ({ periodo, ingresoTotal, ticketsProm, nuevosClientes }))} />
            </div>
        </>
    );
}




// ---------------- Página principal ----------------
export default function Reportes() {
    const [tab, setTab] = useState("Reportes Administrativos");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [ventas, setVentas] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [inventario, setInventario] = useState([]);
    const [crecimiento, setCrecimiento] = useState([]);


    const inRange = useCallback(
        (d) => (!startDate || d >= startDate) && (!endDate || d <= endDate),
        [startDate, endDate]
    );

    const onExport = useCallback(() => {
        let rows = [];

        if (tab === "Reportes Administrativos") {
            const filtered = ventas.filter(v => {
                const okDate = inRange(v.fecha);
                const q = (search || "").toLowerCase();
                const okText = !q || [v.cliente ?? v.responsable, v.servicio ?? v.descripcion]
                    .some(x => String(x || "").toLowerCase().includes(q));
                return okDate && okText;
            });

            rows = filtered.map(v => ({
                "Fecha": v.fecha,
                "Cliente": v.cliente ?? v.responsable ?? "",
                "Servicio": v.servicio ?? v.descripcion ?? "",
                "Total": Number(v.total ?? 0).toFixed(2),
            }));
        }

        if (tab === "Reportes Clínicos") {
            const filtered = pacientes.filter(v => {
                const okDate = inRange(v.fecha);
                const q = (search || "").toLowerCase();
                const okText = !q || [v.mascota ?? v.nombre, v.especie, v.accion ?? v.descripcion]
                    .some(x => String(x || "").toLowerCase().includes(q));
                return okDate && okText;
            });

            rows = filtered.map(v => ({
                "Fecha": v.fecha,
                "Mascota": v.mascota ?? v.nombre ?? "",
                "Especie": v.especie ?? "",
                "Acción": v.accion ?? v.descripcion ?? "",
            }));
        }

        if (tab === "Reportes Estratégicos") {
            const base = (crecimiento || []).map(v => ({
                periodo: v.periodo || (v.fecha || "").slice(0, 7),
                responsable: v.responsable || "",
                ingreso: Number(v.ingresoTotal ?? v["ingreso total"] ?? v.total ?? 0),
            }));

            const toYM = (d) => (d ? d.slice(0, 7) : "");
            const minYM = toYM(startDate);
            const maxYM = toYM(endDate);

            const filtered = base.filter(v =>
                (!startDate || v.periodo >= minYM) &&
                (!endDate || v.periodo <= maxYM)
            );

            const firstSeen = new Map();
            base.forEach(v => {
                const prev = firstSeen.get(v.responsable);
                if (!prev || v.periodo < prev) firstSeen.set(v.responsable, v.periodo);
            });

            const agg = new Map();
            filtered.forEach(v => {
                const cur = agg.get(v.periodo) || { "Periodo": v.periodo, "Ingreso total": 0, "Tickets": 0, "Nuevos clientes": 0 };
                cur["Ingreso total"] += v.ingreso;
                cur["Tickets"] += 1;
                if (firstSeen.get(v.responsable) === v.periodo) cur["Nuevos clientes"] += 1;
                agg.set(v.periodo, cur);
            });

            rows = Array.from(agg.values())
                .map(x => ({ ...x, "Ticket prom.": x.Tickets ? (x["Ingreso total"] / x.Tickets).toFixed(2) : "0.00" }))
                .sort((a, b) => (a["Periodo"] > b["Periodo"] ? 1 : -1));
        }

        if (!rows.length) return;
        download(`reporte_${tab.toLowerCase().replace(/\s+/g, "_")}.csv`, toCSV(rows));
    }, [tab, ventas, pacientes, crecimiento, startDate, endDate, search, inRange]);


    const mapVenta = (r) => ({
        fecha: r.fecha,
        cliente: r.responsable ?? "",
        servicio: r.descripcion ?? "",
        total: Number(r.total ?? 0),
    });

    const mapPaciente = (r) => ({
        fecha: r.fecha ?? "",
        mascota: r.nombre ?? "",
        especie: r.especie ?? "",
        accion: r.descripcion ?? ""
    });

    const mapInventario = (r) => ({
        sku: r.SKU ?? r.sku ?? "",
        producto: r.producto ?? "",
        stock: Number(r.Existencia ?? r.existencia ?? 0),
        minimo: Number(r["Minimo disponible"] ?? r.minimo ?? 0),
    });

    const mapCrecimiento = (r) => ({
        periodo: (r.fecha || "").slice(0, 7),
        cliente: r.nombre ?? "",
        responsable: r.responsable ?? "",
        ingresoTotal: Number(r["ingreso total"] ?? 0),
    });



    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErr("");
                const [getVentas, getPacientes, getInventario, getCrecimiento] = await Promise.all([
                    api.get("/api/reportes/datosVentas"),
                    api.get("/api/reportes/datosPacientesAcciones"),
                    api.get("/api/reportes/datosInventario"),
                    api.get("/api/reportes/datosCrecimiento"),
                ]);
                // setVentas((getVentas.data || []));
                // setPacientes((getPacientes.data || []));
                // setInventario((getInventario.data || []));
                // setCrecimiento((getCrecimiento.data || []));
                setVentas((getVentas.data || []).map(mapVenta));
                setPacientes((getPacientes.data || []).map(mapPaciente));
                setInventario((getInventario.data || []).map(mapInventario));
                setCrecimiento((getCrecimiento.data || []).map(mapCrecimiento));
            } catch (e) {
                setErr(e?.response?.data?.error || "Error cargando data");
            } finally {
                setLoading(false);
            }
        })();
    }, [])


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

    const countAdmin = useMemo(() => ventas.length, []);
    const countClin = useMemo(() => pacientes.length, []);
    const countStrat = useMemo(() => crecimiento.length, []);

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
                        { k: "Reportes Administrativos" },
                        { k: "Reportes Clínicos" },
                        { k: "Reportes Estratégicos" },
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
                <AdminReport startDate={startDate} endDate={endDate} search={search} ventas={ventas} />
            )}
            {tab === "Reportes Clínicos" && (
                <ClinicalReport startDate={startDate} endDate={endDate} search={search} pacientes={pacientes} inventario={inventario} />
            )}
            {tab === "Reportes Estratégicos" && (
                <StrategyReport startDate={startDate} endDate={endDate} search={search} crecimiento={crecimiento} />
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
