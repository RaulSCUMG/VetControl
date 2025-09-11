import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Pacientes";
import Citas from "./pages/Citas";
import Inventario from "./pages/Inventario";
import Facturacion from "./pages/Facturacion";
import Login from "./pages/Login";
<<<<<<< HEAD
import Veterinario from "./pages/Veterinario";

=======
import Empleados from "./pages/Empleados";
import Usuarios from "./pages/Usuarios";
import Roles from "./pages/Roles";
>>>>>>> 72d3924 (pantallas pendientes)
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

function Shell() {
  return (
    <div className="app-shell">
      <aside className="side"><Sidebar /></aside>
      <section className="content">
        <Topbar />
        <main className="main">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

// export default function App() {
//   return (
//     <div className="app-shell">
//       <aside className="side">
//         <Sidebar />
//       </aside>

//       <section className="content">
//         <Topbar />
//         <main className="main">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/pacientes" element={<Patients />} />
//             <Route path="/citas" element={<Citas />} />
//             <Route path="/inventario" element={<Inventario />} />
//             <Route path="/facturacion" element={<Facturacion />} />
//             <Route path="/reportes" element={<div className="card" style={{padding:24}}>Reportes (WIP)</div>} />
//           </Routes>
//         </main>
//       </section>
//     </div>
//   );
// }
export default function App() {
  return (
    <Routes>
      {/* pública */}
      <Route path="/login" element={<Login />} />

      {/* protegidas (dentro del shell) */}
      <Route element={<ProtectedRoute><Shell /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pacientes" element={<Patients />} />
        <Route path="/citas" element={<Citas />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/facturacion" element={<Facturacion />} />
<<<<<<< HEAD
        <Route path="/veterinario" element={<Veterinario />} />
=======
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/roles" element={<Roles />} />
>>>>>>> 72d3924 (pantallas pendientes)
        <Route
          path="/reportes"
          element={<div className="card" style={{ padding: 24 }}>Reportes (WIP)</div>}
        />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}