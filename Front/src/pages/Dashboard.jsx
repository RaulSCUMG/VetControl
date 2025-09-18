import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import StatCard from "../components/StatCard";

const DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const monIndex = (d) => (d.getDay() + 6) % 7; // Lunes=0..Domingo=6
const startOfWeek = (d) => {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  x.setDate(x.getDate() - monIndex(x));
  return x;
};
const endOfWeek = (d) => {
  const x = startOfWeek(d);
  x.setDate(x.getDate() + 6);
  x.setHours(23,59,59,999);
  return x;
};

export default function Dashboard() {
  const nav = useNavigate();
  const [ingresos, setIngresos] = useState(0);
  const [citasHoy, setCitasHoy] = useState(0);
  const [pacientesActivos, setPacientesActivos] = useState(0);
  const [alertasStock, setAlertasStock] = useState([]);
  const [citasSemana, setCitasSemana] = useState([0,0,0,0,0,0,0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [factRes, citasRes, pacRes, prodRes] = await Promise.all([
          api.get("/api/facturaEncabezado/listarFacturas"),
          api.get("/api/citas/listarCitas"),
          api.get("/api/paciente/listarPaciente"),
          api.get("/api/productos/listarProductos"),
        ]);

        // rangos de fecha
        const now = new Date();
        const hoy0 = new Date(now); hoy0.setHours(0,0,0,0);
        const hoy1 = new Date(now); hoy1.setHours(23,59,59,999);
        const sem0 = startOfWeek(now);
        const sem1 = endOfWeek(now);

        // Ingresos de hoy
        const ingresosHoy = (factRes.data || []).reduce((acc, f) => {
          const d = new Date(f.fecha_emision);
          return d >= hoy0 && d <= hoy1 ? acc + Number(f.total || 0) : acc;
        }, 0);
        setIngresos(ingresosHoy);

        // Citas hoy + por día semana actual
        const counts = [0,0,0,0,0,0,0];
        let hoyCount = 0;
        (citasRes.data || []).forEach((c) => {
          const d = new Date(c.fecha_inicio);
          if (d >= sem0 && d <= sem1) counts[monIndex(d)]++;
          if (d >= hoy0 && d <= hoy1) hoyCount++;
        });
        setCitasSemana(counts);
        setCitasHoy(hoyCount);

        // Pacientes activos (todos)
        setPacientesActivos((pacRes.data || []).length);

        // Alertas stock (existencia <= stock_minimo)
        setAlertasStock((prodRes.data || []).filter(
          (p) => Number(p.existencia) <= Number(p.stock_minimo)
        ));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const maxCitas = useMemo(() => Math.max(1, ...citasSemana), [citasSemana]);
  const barWidth = (n) => `${(n / maxCitas) * 100}%`;

  return (
    <div className="dashboard">
      {/* Métricas superiores */}
      <section className="stats-grid">
        <StatCard title="Ingresos" value={`Q${ingresos.toFixed(2)}`} />
        <StatCard title="Citas Hoy" value={citasHoy} />
        <StatCard title="Pacientes Activos" value={pacientesActivos} />
        <StatCard title="Alertas Stock" value={alertasStock.length} />
      </section>

      {/* Paneles principales */}
      <section className="panels-grid">
        <div className="card panel">
          <h3>Calendario Semana</h3>
          <div className="week-line">
            {DIAS.map((d, i) => (
              <div className="daybox" key={d}>
                <div className="dn">{d}</div>
                <div className="dc">{citasSemana[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card panel">
          <h3>Alertas de Stock Bajo</h3>
          <ul className="alerts">
            {alertasStock.length === 0 ? (
              <li className="muted">Sin alertas</li>
            ) : (
              alertasStock.map((p) => (
                <li key={p.id}>
                  <b>{p.codigo || p.id}:</b> {p.nombre} — <b>{p.existencia}</b> / min {p.stock_minimo}
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* Acciones */}
      <section className="actions">
        <button className="btn btn-primary" onClick={() => nav("/citas")}>Nueva Cita</button>
        <button className="btn btn-primary" onClick={() => nav("/pacientes")}>Registrar Paciente</button>
      </section>
    </div>
  );
}