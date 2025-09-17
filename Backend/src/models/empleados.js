const { pool } = require("../../db");

async function obtenerTodosLosEmpleados() {
    const [rows] = await pool.query(`
         SELECT 
     e.id,
    e.nombre,
    e.nombre2,
    e.apellido,
    e.apellido2,
    e.apellido_casada,
    e.dpi,
    e.telefono,
    te.nombre AS tipo_empleado,
    esp.nombre AS especialidad,
    e.activo,
    e.creado_en
    FROM empleados e
    INNER JOIN tipos_empleado te ON e.tipo_empleado_id = te.id
     LEFT JOIN especialidades esp ON e.especialidad_id = esp.id
    `)
    return rows;
}

async function obtenerEmpleadoPorId(id) {
  const [rows] = await pool.query(`
    SELECT 
      e.id,
      e.nombre,
      e.nombre2,
      e.apellido,
      e.apellido2,
      e.apellido_casada,
      e.dpi,
      e.telefono,
      te.nombre AS tipo_empleado,
      esp.nombre AS especialidad,
      e.activo,
      e.creado_en
    FROM empleados e
    INNER JOIN tipos_empleado te ON e.tipo_empleado_id = te.id
    LEFT JOIN especialidades esp ON e.especialidad_id = esp.id
    WHERE e.id = ?
  `, [id]);

  return rows[0];
}

async function crearEmpleado({
  nombre,
  nombre2,
  apellido,
  apellido2,
  apellido_casada,
  dpi,
  telefono,
  tipo_empleado_id,
  especialidad_id,
  activo
}) {
  const [result] = await pool.query(
    `INSERT INTO empleados 
      (nombre, nombre2, apellido, apellido2, apellido_casada, dpi, telefono, tipo_empleado_id, especialidad_id, activo) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      nombre2 || null,
      apellido,
      apellido2 || null,
      apellido_casada || null,
      dpi,
      telefono || null,
      tipo_empleado_id,
      especialidad_id || null,
      activo ?? 1
    ]
  );
  return { id: result.insertId, nombre, nombre2, apellido, apellido2, apellido_casada, dpi, telefono, tipo_empleado_id, especialidad_id, activo };
}

async function actualizarEmpleado(id, {
  nombre,
  nombre2,
  apellido,
  apellido2,
  apellido_casada,
  dpi,
  telefono,
  tipo_empleado_id,
  especialidad_id,
  activo
}) {
  await pool.query(
    `UPDATE empleados SET 
      nombre = ?, 
      nombre2 = ?, 
      apellido = ?, 
      apellido2 = ?, 
      apellido_casada = ?, 
      dpi = ?, 
      telefono = ?, 
      tipo_empleado_id = ?, 
      especialidad_id = ?, 
      activo = ?
     WHERE id = ?`,
    [
      nombre,
      nombre2 || null,
      apellido,
      apellido2 || null,
      apellido_casada || null,
      dpi,
      telefono || null,
      tipo_empleado_id,
      especialidad_id || null,
      activo ?? 1,
      id
    ]
  );
  return { id, nombre, nombre2, apellido, apellido2, apellido_casada, dpi, telefono, tipo_empleado_id, especialidad_id, activo };
}

async function borrarEmpleado(id) {
  const [result] = await pool.query("DELETE FROM empleados WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  obtenerTodosLosEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  borrarEmpleado,
};
