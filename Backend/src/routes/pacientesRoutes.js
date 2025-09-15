const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/pacientesController");

router.get("/listarPaciente", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearPaciente", ctrl.crear);
router.put("/actualizarPaciente/:id", ctrl.actualizar);
router.delete("/EliminarPaciente/:id", ctrl.eliminar);

module.exports = router;