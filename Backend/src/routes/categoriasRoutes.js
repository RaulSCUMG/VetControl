const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/categoriasController");

router.get("/listarCategorias", ctrl.listar);
router.get("/obtener/:id", ctrl.obtener);
router.post("/crearCategoria", ctrl.crear);
router.put("/actualizarCategoria/:id", ctrl.actualizar);
router.delete("/EliminarCategroria/:id", ctrl.eliminar);



module.exports = router;