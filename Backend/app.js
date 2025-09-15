const express = require("express");
const { pool } = require("./db");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const categoriasRoutes = require("./src/routes/categoriasRoutes");
const especialidadesRoutes = require("./src/routes/especialidadesRoutes");
const rolesRoutes = require("./src/routes/rolesRoutes");
const tipoEmpleado = require("./src/routes/tipoEmpleadoRoutes");
const pantallas = require("./src/routes/pantallasRoutes");
const paciente = require("./src/routes/pacientesRoutes");


app.use("/api/categorias", categoriasRoutes);
app.use("/api/especialidades", especialidadesRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/tipoEmpleado", tipoEmpleado);
app.use("/api/pantallas", pantallas);
app.use("/api/paciente", paciente);

module.exports = app;
