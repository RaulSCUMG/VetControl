const { pool } = require("../../db");


async function obtenerTodasLasCategorias(){
    const [rows] = await pool.query("SELECT * FROM categorias ORDER BY id ASC")
    return rows;
}

async function obtenerCategoriaPorID(id) {
  const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
  return rows[0];
}

async function crearCategoria(nombre) {
  const [result] = await pool.query(
    "INSERT INTO categorias (nombre) VALUES (?)",
    [nombre]
  );
  return { id: result.insertId, nombre };
}
async function ActualizarCategoria(id, nombre) {
  await pool.query("UPDATE categorias SET nombre = ? WHERE id = ?", [nombre, id]);
  return { id, nombre };
}

async function BorrarCategoria(id) {
  await pool.query("DELETE FROM categorias WHERE id = ?", [id]);
  return true;
}

module.exports = {
    obtenerTodasLasCategorias,
    obtenerCategoriaPorID,
    crearCategoria,
    ActualizarCategoria,
    BorrarCategoria
}