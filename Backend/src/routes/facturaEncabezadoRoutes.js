const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/facturaEncabezadoController");

router.get("/listarFacturas", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearFacturas", ctrl.crear);
router.put("/actualizarFacturas/:id", ctrl.actualizar);
router.delete("/EliminarFacturas/:id", ctrl.eliminar);

module.exports = router;