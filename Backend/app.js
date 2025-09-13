const express = require("express");
const { pool } = require("./db");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const categoriasRoutes = require("./src/routes/categoriasRoutes");
app.use("/api/categorias", categoriasRoutes);

module.exports = app;
