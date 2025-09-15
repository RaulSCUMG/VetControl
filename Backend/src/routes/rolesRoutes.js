const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/rolesController");

router.get("/listarRoles", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearRol", ctrl.crear);
router.put("/actualizarRol/:id", ctrl.actualizar);
router.delete("/EliminarRol/:id", ctrl.eliminar);

module.exports = router;