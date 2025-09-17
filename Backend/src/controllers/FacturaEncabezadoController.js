const Factura = require("../models/facturaEncabezado");

async function listar(req, res) {
  try {
    const facturas = await Factura.obtenerTodasLasFacturas();
    res.json(facturas);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al listar facturas" });
  }
}

async function obtener(req, res) {
  try {
    const factura = await Factura.obtenerFacturaPorID(req.params.id);
    if (!factura) return res.status(404).json({ error: "Factura no encontrada" });
    res.json(factura);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener factura" });
  }
}

async function crear(req, res) {
  try {
    const nueva = await Factura.crearFactura(req.body);
    res.status(201).json(nueva);
  } catch (e) {
    if (e && e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Paciente o Usuario no existe" });
    }
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El número de factura ya existe" });
    }
    console.error(e);
    res.status(500).json({ error: "Error al crear factura" });
  }
}

async function actualizar(req, res) {
  try {
    const actualizada = await Factura.actualizarFactura(req.params.id, req.body);
    res.json(actualizada);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al actualizar factura" });
  }
}

async function eliminar(req, res) {
  try {
    await Factura.borrarFactura(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al eliminar factura" });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };

