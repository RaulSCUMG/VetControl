const { pool } = require("../../db");

async function obtenerTodosLosUsuarios() {
  const [rows] = await pool.query(`
    SELECT 
      u.id,
      u.usuario,
      u.clave_hash,
      u.activo,
      u.ultimo_login,
      u.creado_en,
      u.empleado_id,
      u.rol_id,
      e.nombre AS empleado_nombre,
      e.apellido AS empleado_apellido,
      r.nombre AS rol
    FROM usuarios u
    INNER JOIN empleados e ON u.empleado_id = e.id
    INNER JOIN roles r ON u.rol_id = r.id
  `);
  return rows;
}

async function obtenerUsuarioPorId(id) {
  const [rows] = await pool.query(`
    SELECT 
      u.id,
      u.usuario,
      u.clave_hash,
      u.activo,
      u.ultimo_login,
      u.creado_en,
      u.empleado_id,
      u.rol_id,
      e.nombre AS empleado_nombre,
      e.apellido AS empleado_apellido,
      r.nombre AS rol
    FROM usuarios u
    INNER JOIN empleados e ON u.empleado_id = e.id
    INNER JOIN roles r ON u.rol_id = r.id
    WHERE u.id = ?
  `, [id]);
  return rows[0];
}

async function crearUsuario({ empleado_id, usuario, clave_hash, rol_id }) {
  const [result] = await pool.query(`
    INSERT INTO usuarios (empleado_id, usuario, clave_hash, rol_id)
    VALUES (?, ?, ?, ?)
  `, [empleado_id, usuario, clave_hash, rol_id]);
  return result.insertId;
}

async function actualizarUsuario(id, { empleado_id, usuario, clave_hash, rol_id, activo }) {
  const [result] = await pool.query(`
    UPDATE usuarios
    SET empleado_id = ?, usuario = ?, clave_hash = ?, rol_id = ?, activo = ?
    WHERE id = ?
  `, [empleado_id, usuario, clave_hash, rol_id, activo, id]);
  return result.affectedRows > 0;
}

async function eliminarUsuario(id) {
  const [result] = await pool.query(`
    DELETE FROM usuarios WHERE id = ?
  `, [id]);
  return result.affectedRows > 0;
}

async function obtenerUsuarioPorUsuario(username) {
  const [rows] = await pool.query(`
    SELECT 
      u.id, u.usuario, u.clave_hash, u.activo, u.ultimo_login, u.creado_en,
      u.empleado_id, u.rol_id,
      e.nombre  AS empleado_nombre, e.apellido AS empleado_apellido,
      r.nombre  AS rol
    FROM usuarios u
    INNER JOIN empleados e ON u.empleado_id = e.id
    INNER JOIN roles r ON u.rol_id = r.id
    WHERE u.usuario = ?
    LIMIT 1
  `, [username]);
  return rows[0];
}

async function actualizarUltimoLogin(id) {
  await pool.query(`UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?`, [id]);
  return true;
}

module.exports = {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorUsuario,
  actualizarUltimoLogin
};
