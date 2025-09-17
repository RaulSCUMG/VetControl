const { pool } = require("../../db");

async function obtenerTodosLosProductos() {
  const [rows] = await pool.query(`
    SELECT p.*, c.nombre AS categoria
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    ORDER BY p.id ASC
  `);
  return rows;
}

async function obtenerProductoPorID(id) {
  const [rows] = await pool.query(`
    SELECT p.*, c.nombre AS categoria
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ?
  `, [id]);
  return rows[0];
}

async function crearProducto({ codigo, nombre, categoria_id, proveedor_id, existencia, stock_minimo, precio, activo }) {
  const [result] = await pool.query(
    `INSERT INTO productos 
      (codigo, nombre, categoria_id, proveedor_id, existencia, stock_minimo, precio, activo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      codigo,
      nombre,
      categoria_id || null,
      proveedor_id || null,
      existencia || 0,
      stock_minimo || 0,
      precio || 0.00,
      activo ?? 1
    ]
  );

  return {
    id: result.insertId,
    codigo,
    nombre,
    categoria_id,
    proveedor_id,
    existencia,
    stock_minimo,
    precio,
    activo
  };
}

async function actualizarProducto(id, { codigo, nombre, categoria_id, proveedor_id, existencia, stock_minimo, precio, activo }) {
  await pool.query(
    `UPDATE productos SET 
      codigo = ?,
      nombre = ?,
      categoria_id = ?,
      proveedor_id = ?,
      existencia = ?,
      stock_minimo = ?,
      precio = ?,
      activo = ?
    WHERE id = ?`,
    [
      codigo,
      nombre,
      categoria_id || null,
      proveedor_id || null,
      existencia || 0,
      stock_minimo || 0,
      precio || 0.00,
      activo ?? 1,
      id
    ]
  );

  return {
    id,
    codigo,
    nombre,
    categoria_id,
    proveedor_id,
    existencia,
    stock_minimo,
    precio,
    activo
  };
}

async function borrarProducto(id) {
  const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  obtenerTodosLosProductos,
  obtenerProductoPorID,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
