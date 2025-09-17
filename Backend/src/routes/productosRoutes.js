const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productosController");

router.get("/listarProductos", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearProductos", ctrl.crear);
router.put("/actualizarProductos/:id", ctrl.actualizar);
router.delete("/EliminarProductos/:id", ctrl.eliminar);

module.exports = router;