const Reportes = require("../models/reportes");

async function ventas(req, res) {
    try {
        const datosVentas = await Reportes.obtenerReporteVentas();
        res.json(
            datosVentas
        );
    } catch (err) {
        console.error("ventas error:", err);
        res.status(500).json({ ok: false, message: "Error obteniendo ventas" });
    }
}

async function pacientesAcciones(req, res) {
    try {
        const datosPA = await Reportes.obtenerPacientesAcciones();
        res.json(
            datosPA
        );
    } catch (err) {
        console.error("Pacientes Acciones error:", err);
        res.status(500).json({ ok: false, message: "Error obteniendo Pacientes Acciones" });
    }
    
}

async function obtenerInventarios(req, res) {
    try {
        const datosInventarios = await Reportes.obtenerInventarios();
        res.json(
            datosInventarios
        );
    } catch (err) {
        console.error("Datos inventario error:", err);
        res.status(500).json({ ok: false, message: "Error obteniendo datos inventario" });
    }
    
}

async function obtenerDatosCrecimiento(req, res) {
    try {
        const datosCrecimiento = await Reportes.obtenerDatosCrecimiento();
        res.json(
            datosCrecimiento
        );
    } catch (err) {
        console.error("Datos crecimiento error:", err);
        res.status(500).json({ ok: false, message: "Error obteniendo datos crecimiento" });
    }
    
}

module.exports = { ventas, pacientesAcciones, obtenerInventarios, obtenerDatosCrecimiento };
