const express = require("express");
const cors = require("cors");
const { pool } = require("./db");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const categoriasRoutes = require("./src/routes/categoriasRoutes");
const especialidadesRoutes = require("./src/routes/especialidadesRoutes");
const rolesRoutes = require("./src/routes/rolesRoutes");
const tipoEmpleado = require("./src/routes/tipoEmpleadoRoutes");
const pantallas = require("./src/routes/pantallasRoutes");
const paciente = require("./src/routes/pacientesRoutes");
const citasRoutes = require("./src/routes/citasRoutes");
const empleadosRoutes = require("./src/routes/empleadosRoutes");
const facturaEncabezado = require("./src/routes/facturaEncabezadoRoutes");
const usuarios = require("./src/routes/usuarioRoutes");
const facturaDetalle = require("./src/routes/facturaRoutes");
const rolesPantallas = require("./src/routes/rolesPantallasRoutes");
const productos = require("./src/routes/productosRoutes");
const movimientos = require("./src/routes/movimientosInventarioRoutes");
const auth = require("./src/routes/authRoutes");
const reportes = require("./src/routes/reportesRoutes");

app.use("/api/categorias", categoriasRoutes);
app.use("/api/especialidades", especialidadesRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/tipoEmpleado", tipoEmpleado);
app.use("/api/pantallas", pantallas);
app.use("/api/paciente", paciente);
app.use("/api/citas", citasRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/facturaEncabezado", facturaEncabezado);
app.use("/api/usuarios", usuarios);
app.use("/api/facturaDetalle", facturaDetalle);
app.use("/api/rolesPantallas", rolesPantallas);
app.use("/api/productos", productos);
app.use("/api/movimientos", movimientos);
app.use("/api/auth", auth);
app.use("/api/reportes", reportes);

module.exports = app;