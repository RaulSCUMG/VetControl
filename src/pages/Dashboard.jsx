import StatCard from "../components/StatCard";

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* métrica superior */}
      <section className="stats-grid">
        <StatCard title="Ingresos" value="Q12,340" />
        <StatCard title="Citas Hoy" value="5" />
        <StatCard title="Pacientes Activos" value="120" />
        <StatCard title="Alertas Stock" value="3" />
      </section>

      {/* paneles principales */}
      <section className="panels-grid">
        <div className="card panel">
          <h3>Calendario Semana</h3>

          {/* gráfico simple de barras con CSS */}
          <div className="bars">
            <div className="row"><span className="bar" style={{ width: "55%" }} /></div>
            <div className="row"><span className="bar" style={{ width: "80%" }} /></div>
            <div className="row"><span className="bar" style={{ width: "60%" }} /></div>
            <div className="row"><span className="bar" style={{ width: "95%" }} /></div>
            <div className="row"><span className="bar" style={{ width: "85%" }} /></div>
          </div>
        </div>

        <div className="card panel">
          <h3>Lista de Alertas</h3>
          <ul className="alerts">
            <li><b>Stock Bajo:</b> Aspirina</li>
            <li><b>Stock Bajo:</b> Paracetamol</li>
            <li><b>Vencimiento Próximo:</b> Ibuprofeno</li>
          </ul>
        </div>
      </section>

      {/* acciones */}
      <section className="actions">
        <button className="btn btn-primary">Nueva Cita</button>
        <button className="btn btn-primary ghost">Registrar Paciente</button>
      </section>
    </div>
  );
}
