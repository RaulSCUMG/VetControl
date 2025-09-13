export default function StatCard({ title, value }) {
  return (
    <div className="card stat">
      <h3>{title}</h3>
      <p className="value">{value}</p>
    </div>
  );
}
