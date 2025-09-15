const { pool } = require("../../db");

async function obtenerTodosLosRoles(){
    const [rows] = await pool.query("SELECT * FROM roles ORDER BY id ASC")
    return rows;
}


async function obtenerRolPorID(id) {
  const [rows] = await pool.query("SELECT * FROM roles WHERE id = ?", [id]);
  return rows[0];
}

async function crearRol(nombre) {
    const [result] = await pool.query(
    "INSERT INTO roles (nombre) VALUES (?)",
    [nombre]
  );
  return { id: result.insertId, nombre };
}

async function ActualizaRol(id, nombre) {
  await pool.query("UPDATE roles SET nombre = ? WHERE id = ?", [nombre, id]);
  return { id, nombre };
}

async function BorrarRol(id) {
  await pool.query("DELETE FROM roles WHERE id = ?", [id]);
  return true;
}

module.exports ={
    obtenerTodosLosRoles,
    obtenerRolPorID,
    crearRol,
    ActualizaRol,
    BorrarRol
}