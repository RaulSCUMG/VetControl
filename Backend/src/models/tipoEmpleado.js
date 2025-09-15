const { pool } = require("../../db");

async function obtenerTodosLosTiposUsuario(){
    const [rows] = await pool.query("SELECT * FROM tipos_empleado ORDER BY id ASC")
    return rows;
}


async function obtenerTiposUsuarioPorID(id) {
  const [rows] = await pool.query("SELECT * FROM tipos_empleado WHERE id = ?", [id]);
  return rows[0];
}

async function crearTiposUsuario(nombre) {
    const [result] = await pool.query(
    "INSERT INTO tipos_empleado (nombre) VALUES (?)",
    [nombre]
  );
  return { id: result.insertId, nombre };
}

async function ActualizaTiposUsuario(id, nombre) {
  await pool.query("UPDATE tipos_empleado SET nombre = ? WHERE id = ?", [nombre, id]);
  return { id, nombre };
}

async function BorrarTiposUsuario(id) {
  await pool.query("DELETE FROM tipos_empleado WHERE id = ?", [id]);
  return true;
}


module.exports ={
    obtenerTodosLosTiposUsuario,
    obtenerTiposUsuarioPorID,
    crearTiposUsuario,
    ActualizaTiposUsuario,
    BorrarTiposUsuario
}