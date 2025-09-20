const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/reportesController");

router.get("/datosVentas", ctrl.ventas);
router.get("/datosPacientesAcciones", ctrl.pacientesAcciones);
router.get("/datosInventario", ctrl.obtenerInventarios);
router.get("/datosCrecimiento", ctrl.obtenerDatosCrecimiento);

module.exports = router;