const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/citasController");

router.get("/listarCitas", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearCitas", ctrl.crear);
router.put("/actualizarCitas/:id", ctrl.actualizar);
router.delete("/EliminarCitas/:id", ctrl.eliminar);

module.exports = router;