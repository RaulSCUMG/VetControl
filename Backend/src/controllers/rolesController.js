const Roles = require("../models/roles");

async function listar(req, res) {
  const roles = await Roles.obtenerTodosLosRoles();
  res.json(roles);
}

async function obtener(req, res) {
  const roles = await Roles.obtenerRolPorID(req.params.id);
  if (!roles) return res.status(404).json({ error: "No encontrada" });
  res.json(roles);
}

async function crear(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

    const nueva = await Roles.crearRol(nombre);
    res.status(201).json(nueva);
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El Rol ya existe" });
    }
    console.error(e);
    res.status(500).json({ error: "Error interno" });
  }
}

async function actualizar(req, res) {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
  const actualizada = await Roles.ActualizaRol(req.params.id, nombre);
  res.json(actualizada);
}

async function eliminar(req, res) {
  await Roles.BorrarRol(req.params.id);
  res.json({ ok: true });
}

module.exports = { listar,obtener,crear,actualizar,eliminar };