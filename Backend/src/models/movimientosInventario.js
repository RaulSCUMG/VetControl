const { pool } = require("../../db");

async function obtenerTodosLosMovimientos() {
  const [rows] = await pool.query(`
    SELECT mi.*, p.nombre AS producto, u.usuario AS usuario
    FROM movimientos_inventario mi
    INNER JOIN productos p ON mi.producto_id = p.id
    LEFT JOIN usuarios u ON mi.usuario_id = u.id
    ORDER BY mi.id DESC
  `);
  return rows;
}

async function obtenerMovimientoPorID(id) {
  const [rows] = await pool.query(`
    SELECT mi.*, p.nombre AS producto, u.usuario AS usuario
    FROM movimientos_inventario mi
    INNER JOIN productos p ON mi.producto_id = p.id
    LEFT JOIN usuarios u ON mi.usuario_id = u.id
    WHERE mi.id = ?
  `, [id]);
  return rows[0];
}

async function crearMovimiento({ producto_id, tipo, cantidad, precio_unit, referencia, ref_id, notas, usuario_id }) {
  const [result] = await pool.query(
    `INSERT INTO movimientos_inventario 
      (producto_id, tipo, cantidad, precio_unit, referencia, ref_id, notas, usuario_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      producto_id,
      tipo,
      cantidad,
      precio_unit || null,
      referencia || null,
      ref_id || null,
      notas || null,
      usuario_id || null
    ]
  );

  return {
    id: result.insertId,
    producto_id,
    tipo,
    cantidad,
    precio_unit,
    referencia,
    ref_id,
    notas,
    usuario_id
  };
}

async function actualizarMovimiento(id, { producto_id, tipo, cantidad, precio_unit, referencia, ref_id, notas, usuario_id }) {
  await pool.query(
    `UPDATE movimientos_inventario SET
      producto_id = ?,
      tipo = ?,
      cantidad = ?,
      precio_unit = ?,
      referencia = ?,
      ref_id = ?,
      notas = ?,
      usuario_id = ?
    WHERE id = ?`,
    [
      producto_id,
      tipo,
      cantidad,
      precio_unit || null,
      referencia || null,
      ref_id || null,
      notas || null,
      usuario_id || null,
      id
    ]
  );

  return {
    id,
    producto_id,
    tipo,
    cantidad,
    precio_unit,
    referencia,
    ref_id,
    notas,
    usuario_id
  };
}

async function borrarMovimiento(id) {
  const [result] = await pool.query("DELETE FROM movimientos_inventario WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  obtenerTodosLosMovimientos,
  obtenerMovimientoPorID,
  crearMovimiento,
  actualizarMovimiento,
  borrarMovimiento,
};
