const Detalle = require("../models/facturaDetalle");

async function listar(req, res) {
  try {
    const { factura_id } = req.query;
    const data = factura_id
      ? await Detalle.obtenerDetallePorFacturaId(factura_id)
      : await Detalle.obtenerTodosLosDetalles();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al listar detalle de factura" });
  }
}

async function obtener(req, res) {
  try {
    const fila = await Detalle.obtenerDetallePorId(req.params.id);
    if (!fila) return res.status(404).json({ error: "Detalle no encontrado" });
    res.json(fila);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener detalle" });
  }
}

async function crear(req, res) {
  try {
    const id = await Detalle.crearDetalle(req.body);
    const nuevo = await Detalle.obtenerDetallePorId(id);
    res.status(201).json(nuevo);
  } catch (e) {
    if (e && e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Factura o Producto no existe" });
    }
    if (e && e.code === "ER_TRUNCATED_WRONG_VALUE") {
      return res.status(400).json({ error: "Datos numéricos inválidos" });
    }
    console.error(e);
    res.status(500).json({ error: "Error al crear detalle" });
  }
}

async function actualizar(req, res) {
  try {
    const ok = await Detalle.actualizarDetalle(req.params.id, req.body);
    if (!ok) return res.status(404).json({ error: "Detalle no encontrado" });
    const actualizado = await Detalle.obtenerDetallePorId(req.params.id);
    res.json(actualizado);
  } catch (e) {
    if (e && e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Factura o Producto no existe" });
    }
    if (e && e.code === "ER_TRUNCATED_WRONG_VALUE") {
      return res.status(400).json({ error: "Datos numéricos inválidos" });
    }
    console.error(e);
    res.status(500).json({ error: "Error al actualizar detalle" });
  }
}

async function eliminar(req, res) {
  try {
    const ok = await Detalle.eliminarDetalle(req.params.id);
    if (!ok) return res.status(404).json({ error: "Detalle no encontrado" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al eliminar detalle" });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };