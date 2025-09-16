const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tipoEmpleadoController");

router.get("/listarTipo", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearTipo", ctrl.crear);
router.put("/actualizaTipo/:id", ctrl.actualizar);
router.delete("/EliminarTipo/:id", ctrl.eliminar);

module.exports = router;