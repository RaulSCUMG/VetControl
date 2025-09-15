const Paciente = require("../models/pacientes");

async function listar(req, res) {
  const pacientes = await Paciente.obtenerTodosLosPacientes();
  res.json(pacientes);
}

async function obtener(req, res) {
  const paciente = await Paciente.obtenerPacientePorID(req.params.id);
  if (!paciente) return res.status(404).json({ error: "Paciente no encontrado" });
  res.json(paciente);
}

async function crear(req, res) {
  try {
    const { nombre, especie, responsable } = req.body;
    if (!nombre || !especie || !responsable) {
      return res.status(400).json({ error: "Nombre, especie y responsable son requeridos" });
    }

    const nuevo = await Paciente.crearPaciente(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    console.error("Error creando paciente:", e);
    res.status(500).json({ error: "Error interno" });
  }
}

async function actualizar(req, res) {
  const { nombre, especie, responsable } = req.body;
  if (!nombre || !especie || !responsable) {
    return res.status(400).json({ error: "Nombre, especie y responsable son requeridos" });
  }

  const existente = await Paciente.obtenerPacientePorID(req.params.id);
  if (!existente) return res.status(404).json({ error: "Paciente no encontrado" });

  const actualizado = await Paciente.actualizarPaciente(req.params.id, req.body);
  res.json(actualizado);
}

async function eliminar(req, res) {
  const eliminado = await Paciente.borrarPaciente(req.params.id);
  if (!eliminado) return res.status(404).json({ error: "Paciente no encontrado" });

  res.json({ ok: true });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
