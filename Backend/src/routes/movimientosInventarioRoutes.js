const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/movimientosInventarioController");

router.get("/listarMovimientos", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearMovimientos", ctrl.crear);
router.put("/actualizarMovimientos/:id", ctrl.actualizar);
router.delete("/EliminarMovimientos/:id", ctrl.eliminar);


module.exports = router;