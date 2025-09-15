const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/pantallasController");

router.get("/listarPantallas", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearPantallas", ctrl.crear);
router.put("/actualizarPantallas/:id", ctrl.actualizar);
router.delete("/EliminarPantallas/:id", ctrl.eliminar);



module.exports = router;