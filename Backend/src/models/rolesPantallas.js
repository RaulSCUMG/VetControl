const { pool } = require("../../db");

async function obtenerTodas() {
  const [rows] = await pool.query(`
    SELECT rp.rol_id, r.nombre AS rol, rp.pantalla_id, p.nombre AS pantalla
    FROM roles_pantallas rp
    INNER JOIN roles r ON rp.rol_id = r.id
    INNER JOIN pantallas p ON rp.pantalla_id = p.id
    ORDER BY rp.rol_id, rp.pantalla_id
  `);
  return rows;
}

async function obtenerPantallasPorRol(rol_id) {
  const [rows] = await pool.query(`
    SELECT rp.pantalla_id, p.nombre
    FROM roles_pantallas rp
    INNER JOIN pantallas p ON rp.pantalla_id = p.id
    WHERE rp.rol_id = ?
  `, [rol_id]);
  return rows;
}

async function asignarPantalla(rol_id, pantalla_id) {
  await pool.query(
    "INSERT INTO roles_pantallas (rol_id, pantalla_id) VALUES (?, ?)",
    [rol_id, pantalla_id]
  );
  return { rol_id, pantalla_id };
}

async function actualizarAsignacion(rol_id, pantalla_id, nuevo_pantalla_id) {
  const [result] = await pool.query(
    "UPDATE roles_pantallas SET pantalla_id = ? WHERE rol_id = ? AND pantalla_id = ?",
    [nuevo_pantalla_id, rol_id, pantalla_id]
  );
  return result.affectedRows > 0;
}

async function eliminarAsignacion(rol_id, pantalla_id) {
  const [result] = await pool.query(
    "DELETE FROM roles_pantallas WHERE rol_id = ? AND pantalla_id = ?",
    [rol_id, pantalla_id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  obtenerTodas,
  obtenerPantallasPorRol,
  asignarPantalla,
  actualizarAsignacion,
  eliminarAsignacion,
};