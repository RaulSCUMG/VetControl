const { pool } = require("../../db");

async function obtenerTodasLasFacturas() {
  const [rows] = await pool.query(`
    SELECT 
      f.id,
      f.serie,
      f.numero,
      f.fecha_emision,
      f.subtotal,
      f.impuestos,
      f.descuentos,
      f.total,
      f.estado,
      p.nombre AS paciente,
      u.usuario AS usuario
    FROM facturas_encabezado f
    LEFT JOIN pacientes p ON f.paciente_id = p.id
    LEFT JOIN usuarios u ON f.usuario_id = u.id
    ORDER BY f.id DESC
  `);
  return rows;
}

async function obtenerFacturaPorID(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      f.*,
      p.nombre AS paciente,
      u.usuario AS usuario
    FROM facturas_encabezado f
    LEFT JOIN pacientes p ON f.paciente_id = p.id
    LEFT JOIN usuarios u ON f.usuario_id = u.id
    WHERE f.id = ?
  `,
    [id]
  );
  return rows[0];
}

async function crearFactura({
  serie,
  numero,
  fecha_emision,
  paciente_id,
  nit,
  direccion,
  subtotal,
  impuestos,
  descuentos,
  total,
  usuario_id,
  estado
}) {
  const [result] = await pool.query(
    `
    INSERT INTO facturas_encabezado 
    (serie, numero, fecha_emision, paciente_id, nit, direccion, subtotal, impuestos, descuentos, total, usuario_id, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      serie || null,
      numero,
      fecha_emision || new Date(),
      paciente_id || null,
      nit || null,
      direccion || null,
      subtotal || 0,
      impuestos || 0,
      descuentos || 0,
      total || 0,
      usuario_id || null,
      estado || "Emitida"
    ]
  );

  return { id: result.insertId, numero, total, estado };
}

async function actualizarFactura(id, datos) {
  const {
    serie,
    numero,
    fecha_emision,
    paciente_id,
    nit,
    direccion,
    subtotal,
    impuestos,
    descuentos,
    total,
    usuario_id,
    estado
  } = datos;

  await pool.query(
    `
    UPDATE facturas_encabezado SET
      serie = ?, numero = ?, fecha_emision = ?, paciente_id = ?, nit = ?, direccion = ?, 
      subtotal = ?, impuestos = ?, descuentos = ?, total = ?, usuario_id = ?, estado = ?
    WHERE id = ?
  `,
    [
      serie || null,
      numero,
      fecha_emision || new Date(),
      paciente_id || null,
      nit || null,
      direccion || null,
      subtotal || 0,
      impuestos || 0,
      descuentos || 0,
      total || 0,
      usuario_id || null,
      estado || "Emitida",
      id
    ]
  );

  return { id, numero, total, estado };
}

async function borrarFactura(id) {
  const [result] = await pool.query("DELETE FROM facturas_encabezado WHERE id = ?", [id]);
  return result.affectedRows > 0;
}


module.exports = {
  obtenerTodasLasFacturas,
  obtenerFacturaPorID,
  crearFactura,
  actualizarFactura,
  borrarFactura
};


