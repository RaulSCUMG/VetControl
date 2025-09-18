// controllers/reportesController.js
const Reportes = require("../models/reportes");

async function ventas(req, res) {
    try {
        const datosVentas = await Reportes.obtenerReporteVentas();
        res.json({
            ok: true,
            totalFilas: datosVentas.length,
            data: datosVentas,
        });
    } catch (err) {
        console.error("ventas error:", err);
        res.status(500).json({ ok: false, message: "Error obteniendo ventas" });
    }
}

module.exports = { ventas };

