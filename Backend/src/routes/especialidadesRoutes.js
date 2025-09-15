const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/especialidadesController");

router.get("/listarEspecialidades", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearEspecialidad", ctrl.crear);
router.put("/actualizarEspecialidad/:id", ctrl.actualizar);
router.delete("/EliminarEspecialidad/:id", ctrl.eliminar);



module.exports = router;