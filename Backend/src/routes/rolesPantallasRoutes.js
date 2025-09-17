const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/rolesPantallasController");

router.get("/listarPantallasRoles", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearPantallasRoles", ctrl.crear);
router.put("/actualizarPantallasRoles/:rol_id/:pantalla_id", ctrl.actualizar);
router.delete("/eliminarPantallasRoles/:rol_id/:pantalla_id", ctrl.eliminar);




module.exports = router;