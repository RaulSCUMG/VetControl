const Categoria = require("../models/categorias");

async function listar(req, res) {
  const categorias = await Categoria.obtenerTodasLasCategorias();
  res.json(categorias);
}

async function obtener(req, res) {
  const categoria = await Categoria.obtenerCategoriaPorID(req.params.id);
  if (!categoria) return res.status(404).json({ error: "No encontrada" });
  res.json(categoria);
}

async function crear(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

    const nueva = await Categoria.crearCategoria(nombre);
    res.status(201).json(nueva);
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "La categoría ya existe" });
    }
    console.error(e);
    res.status(500).json({ error: "Error interno" });
  }
}

async function actualizar(req, res) {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
  const actualizada = await Categoria.ActualizarCategoria(req.params.id, nombre);
  res.json(actualizada);
}

async function eliminar(req, res) {
  await Categoria.BorrarCategoria(req.params.id);
  res.json({ ok: true });
}

module.exports = { listar,obtener,crear,actualizar,eliminar };