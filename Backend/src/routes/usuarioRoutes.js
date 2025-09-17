const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/usuarioController");

router.get("/listarUsuarios", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearUsuarios", ctrl.crear);
router.put("/actualizarUsuarios/:id", ctrl.actualizar);
router.delete("/EliminarUsuarios/:id", ctrl.eliminar);

module.exports = router;