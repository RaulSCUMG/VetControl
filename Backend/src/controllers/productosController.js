const Productos = require("../models/productos");

async function listar(req, res) {
  const productos = await Productos.obtenerTodosLosProductos();
  res.json(productos);
}

async function obtener(req, res) {
  const producto = await Productos.obtenerProductoPorID(req.params.id);
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(producto);
}

async function crear(req, res) {
  try {
    const { codigo, nombre, categoria_id, proveedor_id, existencia, stock_minimo, precio, activo } = req.body;

    if (!codigo || !nombre) {
      return res.status(400).json({ error: "Código y nombre son requeridos" });
    }

    const nuevo = await Productos.crearProducto({ codigo, nombre, categoria_id, proveedor_id, existencia, stock_minimo, precio, activo });
    res.status(201).json(nuevo);
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El código ya existe" });
    }
    console.error(e);
    res.status(500).json({ error: "Error interno al crear producto" });
  }
}

async function actualizar(req, res) {
  try {
    const actualizado = await Productos.actualizarProducto(req.params.id, req.body);
    res.json(actualizado);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al actualizar producto" });
  }
}

async function eliminar(req, res) {
  try {
    const ok = await Productos.borrarProducto(req.params.id);
    if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al eliminar producto" });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
