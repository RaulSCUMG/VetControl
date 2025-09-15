const { pool } = require("../../db");

async function obtenerTodasLasEspecialidades(){
    const [rows] = await pool.query("SELECT * FROM especialidades ORDER BY id ASC")
    return rows;
}

async function obtenerEspecialidadPorID(id) {
  const [rows] = await pool.query("SELECT * FROM especialidades WHERE id = ?", [id]);
  return rows[0];
}

async function crearEspecialidad(nombre) {
    const [result] = await pool.query(
    "INSERT INTO especialidades (nombre) VALUES (?)",
    [nombre]
  );
  return { id: result.insertId, nombre };
}

async function ActualizaEspecialidad(id, nombre) {
  await pool.query("UPDATE especialidades SET nombre = ? WHERE id = ?", [nombre, id]);
  return { id, nombre };
}

async function BorrarEspecialidad(id) {
  await pool.query("DELETE FROM especialidades WHERE id = ?", [id]);
  return true;
}

module.exports ={
    obtenerTodasLasEspecialidades,
    crearEspecialidad,
    obtenerEspecialidadPorID,
    ActualizaEspecialidad,
    BorrarEspecialidad
}