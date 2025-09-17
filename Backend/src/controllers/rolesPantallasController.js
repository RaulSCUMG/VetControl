const RolesPantallas = require("../models/rolesPantallas");

async function listar(req, res) {
  const data = await RolesPantallas.obtenerTodas();
  res.json(data);
}

async function obtener(req, res) {
  const pantallas = await RolesPantallas.obtenerPantallasPorRol(req.params.id);
  res.json(pantallas);
}

async function crear(req, res) {
  try {
    const { rol_id, pantalla_id } = req.body;
    if (!rol_id || !pantalla_id) {
      return res.status(400).json({ error: "rol_id y pantalla_id son requeridos" });
    }
    const nueva = await RolesPantallas.asignarPantalla(rol_id, pantalla_id);
    res.status(201).json(nueva);
  } catch (e) {
    if (e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "El rol o la pantalla no existen" });
    }
    console.error(e);
    res.status(500).json({ error: "Error interno al asignar pantalla" });
  }
}

async function actualizar(req, res) {
  try {
    const { rol_id, pantalla_id } = req.params;
    const { nuevo_pantalla_id } = req.body;

    if (!nuevo_pantalla_id) {
      return res.status(400).json({ error: "nuevo_pantalla_id es requerido" });
    }

    const ok = await RolesPantallas.actualizarAsignacion(rol_id, pantalla_id, nuevo_pantalla_id);
    if (!ok) return res.status(404).json({ error: "Asignación no encontrada" });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
}

async function eliminar(req, res) {
  try {
    const { rol_id, pantalla_id } = req.params;

    const ok = await RolesPantallas.eliminarAsignacion(rol_id, pantalla_id);
    if (!ok) return res.status(404).json({ error: "Asignación no encontrada" });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
}

module.exports = { listar, obtener, crear, actualizar,eliminar };