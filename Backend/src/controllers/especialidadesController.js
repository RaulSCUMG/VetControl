const Especialidades = require("../models/especialidades");

async function listar(req, res) {
  const especialidades = await Especialidades.obtenerTodasLasEspecialidades();
  res.json(especialidades);
}

async function obtener(req, res) {
  const especialidades = await Especialidades.obtenerEspecialidadPorID(req.params.id);
  if (!especialidades) return res.status(404).json({ error: "No encontrada" });
  res.json(especialidades);
}

async function crear(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

    const nueva = await Especialidades.crearEspecialidad(nombre);
    res.status(201).json(nueva);
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "La especialidad ya existe" });
    }
    console.error(e);
    res.status(500).json({ error: "Error interno" });
  }
}

async function actualizar(req, res) {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
  const actualizada = await Especialidades.ActualizaEspecialidad(req.params.id, nombre);
  res.json(actualizada);
}

async function eliminar(req, res) {
  await Especialidades.BorrarEspecialidad(req.params.id);
  res.json({ ok: true });
}

module.exports = { listar,obtener,crear,actualizar,eliminar };