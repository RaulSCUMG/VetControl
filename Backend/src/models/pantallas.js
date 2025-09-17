const { pool } = require("../../db");

async function obtenerTodasLaspantallas(){
    const [rows] = await pool.query("SELECT * FROM pantallas ORDER BY id ASC")
    return rows;
}


async function obtenerPantallasPorID(id) {
  const [rows] = await pool.query("SELECT * FROM pantallas WHERE id = ?", [id]);
  return rows[0];
}

async function crearPantallas(codigo, nombre) {
    const [result] = await pool.query(
    "INSERT INTO pantallas (codigo, nombre) VALUES (?, ?)",
    [codigo,nombre]
  );
  return { id: result.insertId, codigo,nombre };
}

async function ActualizaPantallas(id, codigo, nombre) {
  await pool.query(
    "UPDATE pantallas SET codigo = ?, nombre = ? WHERE id = ?",
    [codigo, nombre, id]
  );
  return { id, codigo, nombre };
}

async function BorrarPantallas(id) {
  await pool.query("DELETE FROM pantallas WHERE id = ?", [id]);
  return true;
}


module.exports ={
    obtenerTodasLaspantallas,
    obtenerPantallasPorID,
    crearPantallas,
    ActualizaPantallas,
    BorrarPantallas
}