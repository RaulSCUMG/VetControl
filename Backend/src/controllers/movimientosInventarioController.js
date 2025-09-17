const Movimientos = require("../models/movimientosInventario");

async function listar(req, res) {
  const movimientos = await Movimientos.obtenerTodosLosMovimientos();
  res.json(movimientos);
}

async function obtener(req, res) {
  const movimiento = await Movimientos.obtenerMovimientoPorID(req.params.id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
}

async function crear(req, res) {
  try {
    const { producto_id, tipo, cantidad, precio_unit, referencia, ref_id, notas, usuario_id } = req.body;

    if (!producto_id || !tipo || !cantidad) {
      return res.status(400).json({ error: "producto_id, tipo y cantidad son requeridos" });
    }

    const nuevo = await Movimientos.crearMovimiento({ producto_id, tipo, cantidad, precio_unit, referencia, ref_id, notas, usuario_id });
    res.status(201).json(nuevo);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al crear movimiento" });
  }
}

async function actualizar(req, res) {
  try {
    const actualizado = await Movimientos.actualizarMovimiento(req.params.id, req.body);
    res.json(actualizado);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al actualizar movimiento" });
  }
}

async function eliminar(req, res) {
  try {
    const ok = await Movimientos.borrarMovimiento(req.params.id);
    if (!ok) return res.status(404).json({ error: "Movimiento no encontrado" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al eliminar movimiento" });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
