const Empleados = require("../models/tipoEmpleado");

async function listar(req, res) {
  const roles = await Empleados.obtenerTodosLosTiposUsuario();
  res.json(roles);
}

async function obtener(req, res) {
  const roles = await Empleados.obtenerTiposUsuarioPorID(req.params.id);
  if (!roles) return res.status(404).json({ error: "No encontrada" });
  res.json(roles);
}

async function crear(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

    const nueva = await Empleados.crearTiposUsuario(nombre);
    res.status(201).json(nueva);
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Este tipo ya existe" });
    }
    console.error(e);
    res.status(500).json({ error: "Error interno" });
  }
}

async function actualizar(req, res) {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
  const actualizada = await Empleados.ActualizaTiposUsuario(req.params.id, nombre);
  res.json(actualizada);
}

async function eliminar(req, res) {
  await Empleados.BorrarTiposUsuario(req.params.id);
  res.json({ ok: true });
}

module.exports = { listar,obtener,crear,actualizar,eliminar };