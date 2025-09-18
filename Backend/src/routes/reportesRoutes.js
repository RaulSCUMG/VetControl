const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/reportesController");

router.get("/datosVentas", ctrl.ventas);

module.exports = router;