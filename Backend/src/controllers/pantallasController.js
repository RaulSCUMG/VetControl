const Pantallas = require("../models/pantallas");

async function listar(req, res) {
  const roles = await Pantallas.obtenerTodasLaspantallas();
  res.json(roles);
}

async function obtener(req, res) {
  const roles = await Pantallas.obtenerPantallasPorID(req.params.id);
  if (!roles) return res.status(404).json({ error: "No encontrada" });
  res.json(roles);
}

async function crear(req, res) {
  try {
    const { nombre } = req.body;
    const { codigo } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
    if (!codigo) return res.status(400).json({ error: "codigo requerido" });

    const nueva = await Pantallas.crearPantallas(nombre,codigo);
    res.status(201).json(nueva);
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Esta pantalla ya existe" });
    }
    console.error(e);
    res.status(500).json({ error: "Error interno" });
  }
}

async function actualizar(req, res) {
  const { nombre } = req.body;
  const { codigo } = req.body;
  if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
  if (!codigo) return res.status(400).json({ error: "codigo requerido" });
  const actualizada = await Pantallas.ActualizaPantallas(req.params.id,codigo, nombre);
  res.json(actualizada);
}

async function eliminar(req, res) {
  await Pantallas.BorrarPantallas(req.params.id);
  res.json({ ok: true });
}

module.exports = { listar,obtener,crear,actualizar,eliminar };