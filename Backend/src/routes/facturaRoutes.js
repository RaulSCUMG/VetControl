const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/facturaDetalleController");

router.get("/listarFacturaDetalle", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearFacturaDetalle", ctrl.crear);
router.put("/actualizarFacturaDetalle/:id", ctrl.actualizar);
router.delete("/EliminarFacturaDetalle/:id", ctrl.eliminar);

module.exports = router;