const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/empleadosController");

router.get("/listarEmpleados", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearEmpleados", ctrl.crear);
router.put("/actualizarEmpleados/:id", ctrl.actualizar);
router.delete("/EliminarEmpleados/:id", ctrl.eliminar);

module.exports = router;