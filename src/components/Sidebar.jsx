import { NavLink } from "react-router-dom";
<<<<<<< HEAD
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaBoxes, FaFileInvoice, FaChartLine, FaPaw, FaUserMd } from "react-icons/fa";
=======
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaBoxes, FaFileInvoice, FaChartLine, FaPaw, FaUserMd, FaUserShield } from "react-icons/fa";
>>>>>>> 72d3924 (pantallas pendientes)

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
<<<<<<< HEAD
        <NavLink className="nav-item" to="/veterinario">
          <FaUserMd /> Veterinario
=======
        <NavLink className="nav-item" to="/empleados">
          <FaUserMd /> Empleados
        </NavLink>
        <NavLink className="nav-item" to="/usuarios">
          <FaUsers /> Usuarios
        </NavLink>
        <NavLink className="nav-item" to="/roles">
          <FaUserShield /> Roles
>>>>>>> 72d3924 (pantallas pendientes)
        </NavLink>
        <NavLink className="nav-item" to="/reportes">
          <FaChartLine /> Reportes
        </NavLink>
      </nav>
    </div>
  );
}