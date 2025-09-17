const { pool } = require("../../db");

async function obtenerTodasLasCitas() {
    const [rows] = await pool.query(`
         SELECT c.id, c.fecha_inicio, c.fecha_fin, c.estado, c.notas,
             p.nombre AS paciente, e.nombre AS veterinario, es.nombre AS especialidad
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      LEFT JOIN empleados e ON c.veterinario_id = e.id
      LEFT JOIN especialidades es ON c.especialidad_id = es.id
      ORDER BY c.fecha_inicio DESC
    `)
    return rows;  
}

async function obtenerCitaPorID(id) {
    const [rows] = await pool.query(`
      SELECT c.id, c.fecha_inicio, c.fecha_fin, c.estado, c.notas,
             p.nombre AS paciente, e.nombre AS veterinario, es.nombre AS especialidad
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      LEFT JOIN empleados e ON c.veterinario_id = e.id
      LEFT JOIN especialidades es ON c.especialidad_id = es.id
      WHERE c.id = ?
    `, [id]);
    return rows[0];
}

async function crearCita(paciente_id, veterinario_id, especialidad_id, fecha_inicio, fecha_fin, notas) {
    const [result] = await pool.query(`
      INSERT INTO citas (paciente_id, veterinario_id, especialidad_id, fecha_inicio, fecha_fin, notas)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [paciente_id, veterinario_id, especialidad_id, fecha_inicio, fecha_fin, notas]);
    return { id: result.insertId, paciente_id, veterinario_id, especialidad_id, fecha_inicio, fecha_fin, notas, estado: "Programada" };
}

async function actualizarCita(id, data) {
    const { paciente_id, veterinario_id, especialidad_id, fecha_inicio, fecha_fin, estado, notas } = data;
    await pool.query(`
      UPDATE citas 
      SET paciente_id=?, veterinario_id=?, especialidad_id=?, fecha_inicio=?, fecha_fin=?, estado=?, notas=? 
      WHERE id=?
    `, [paciente_id, veterinario_id, especialidad_id, fecha_inicio, fecha_fin, estado, notas, id]);
    return { id, ...data };
  }

async function borrarCita(id) {
    await pool.query(`DELETE FROM citas WHERE id=?`, [id]);
    return true;
}

module.exports = {
    obtenerTodasLasCitas,
    obtenerCitaPorID,
    crearCita,
    actualizarCita,
    borrarCita
}