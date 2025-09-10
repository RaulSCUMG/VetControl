import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaBoxes, FaFileInvoice, FaChartLine, FaPaw, FaUserMd } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="brand">
        <FaPaw />
        <span>VetControl</span>
      </div>

      <nav className="nav">
        <NavLink className="nav-item" to="/">
          <FaTachometerAlt /> Dashboard
        </NavLink>
        <NavLink className="nav-item" to="/pacientes">
          <FaUsers /> Pacientes
        </NavLink>
        <NavLink className="nav-item" to="/citas">
          <FaCalendarAlt /> Citas
        </NavLink>
        <NavLink className="nav-item" to="/inventario">
          <FaBoxes /> Inventario
        </NavLink>
        <NavLink className="nav-item" to="/facturacion">
          <FaFileInvoice /> Facturación
        </NavLink>
        <NavLink className="nav-item" to="/veterinario">
          <FaUserMd /> Veterinario
        </NavLink>
        <NavLink className="nav-item" to="/reportes">
          <FaChartLine /> Reportes
        </NavLink>
      </nav>
    </div>
  );
}