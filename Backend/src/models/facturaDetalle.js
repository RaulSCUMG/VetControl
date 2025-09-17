const { pool } = require("../../db");

async function obtenerTodosLosDetalles() {
  const [rows] = await pool.query(`
    SELECT 
      d.id,
      d.factura_id,
      f.numero AS factura_numero,
      d.producto_id,
      p.codigo AS producto_codigo,
      p.nombre AS producto_nombre,
      d.codigo,
      d.descripcion,
      d.cantidad,
      d.precio_unit,
      d.total_linea
    FROM factura_detalle d
    INNER JOIN facturas_encabezado f ON d.factura_id = f.id
    LEFT JOIN productos p ON d.producto_id = p.id
    ORDER BY d.id ASC
  `);
  return rows;
}

async function obtenerDetallePorFacturaId(facturaId) {
  const [rows] = await pool.query(`
    SELECT 
      d.id,
      d.factura_id,
      f.numero AS factura_numero,
      d.producto_id,
      p.codigo AS producto_codigo,
      p.nombre AS producto_nombre,
      d.codigo,
      d.descripcion,
      d.cantidad,
      d.precio_unit,
      d.total_linea
    FROM factura_detalle d
    INNER JOIN facturas_encabezado f ON d.factura_id = f.id
    LEFT JOIN productos p ON d.producto_id = p.id
    WHERE d.factura_id = ?
    ORDER BY d.id ASC
  `, [facturaId]);
  return rows;
}

async function obtenerDetallePorId(id) {
  const [rows] = await pool.query(`
    SELECT 
      d.id,
      d.factura_id,
      f.numero AS factura_numero,
      d.producto_id,
      p.codigo AS producto_codigo,
      p.nombre AS producto_nombre,
      d.codigo,
      d.descripcion,
      d.cantidad,
      d.precio_unit,
      d.total_linea
    FROM factura_detalle d
    INNER JOIN facturas_encabezado f ON d.factura_id = f.id
    LEFT JOIN productos p ON d.producto_id = p.id
    WHERE d.id = ?
  `, [id]);
  return rows[0] || null;
}

async function crearDetalle({ factura_id, producto_id = null, codigo = null, descripcion, cantidad, precio_unit, total_linea }) {
  const total = total_linea != null
    ? total_linea
    : Number((Number(cantidad) * Number(precio_unit)).toFixed(2));

  const [res] = await pool.query(`
    INSERT INTO factura_detalle
      (factura_id, producto_id, codigo, descripcion, cantidad, precio_unit, total_linea)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [factura_id, producto_id, codigo, descripcion, cantidad, precio_unit, total]);

  return res.insertId;
}

async function actualizarDetalle(id, data) {
  const actual = await obtenerDetallePorId(id);
  if (!actual) return false;

  const {
    factura_id = actual.factura_id,
    producto_id = actual.producto_id,
    codigo = actual.codigo,
    descripcion = actual.descripcion,
    cantidad = actual.cantidad,
    precio_unit = actual.precio_unit,
    total_linea
  } = data;

  const total = total_linea != null
    ? total_linea
    : Number((Number(cantidad) * Number(precio_unit)).toFixed(2));

  const [res] = await pool.query(`
    UPDATE factura_detalle
    SET factura_id = ?, producto_id = ?, codigo = ?, descripcion = ?, 
        cantidad = ?, precio_unit = ?, total_linea = ?
    WHERE id = ?
  `, [factura_id, producto_id, codigo, descripcion, cantidad, precio_unit, total, id]);

  return res.affectedRows > 0;
}

async function eliminarDetalle(id) {
  const [res] = await pool.query(`
    DELETE FROM factura_detalle WHERE id = ?
  `, [id]);
  return res.affectedRows > 0;
}

module.exports = {
  obtenerTodosLosDetalles,
  obtenerDetallePorFacturaId,
  obtenerDetallePorId,
  crearDetalle,
  actualizarDetalle,
  eliminarDetalle,
};
