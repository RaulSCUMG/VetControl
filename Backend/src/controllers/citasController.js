const Cita = require("../models/citas");

async function listar(req, res) {
  const citas = await Cita.obtenerTodasLasCitas();
  res.json(citas);
}

async function obtener(req, res) {
  const cita = await Cita.obtenerCitaPorID(req.params.id);
  if (!cita) return res.status(404).json({ error: "Cita no encontrada" });
  res.json(cita);
}

async function crear(req, res) {
  try {
    const { paciente_id, veterinario_id, especialidad_id, fecha_inicio, fecha_fin, notas } = req.body;

    if (!paciente_id || !fecha_inicio) {
      return res.status(400).json({ error: "Paciente y fecha_inicio son requeridos" });
    }

    const nueva = await Cita.crearCita(paciente_id, veterinario_id, especialidad_id, fecha_inicio, fecha_fin, notas);
    res.status(201).json(nueva);
  } catch (e) {
    if (e && e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Alguna llave foránea no existe" });
    }
    console.error(e);
    res.status(500).json({ error: "Error interno al crear cita" });
  }
}

async function actualizar(req, res) {
  try {
    const actualizada = await Cita.actualizarCita(req.params.id, req.body);
    res.json(actualizada);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al actualizar cita" });
  }
}

async function eliminar(req, res) {
  try {
    await Cita.borrarCita(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al eliminar cita" });
  }
}

module.exports = { listar,obtener,crear,actualizar,eliminar };
