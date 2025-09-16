const { pool } = require("../../db");

async function obtenerTodosLosPacientes() {
  const [rows] = await pool.query("SELECT * FROM pacientes ORDER BY id ASC");
  return rows;
}

async function obtenerPacientePorID(id) {
  const [rows] = await pool.query("SELECT * FROM pacientes WHERE id = ?", [id]);
  return rows[0];
}

async function crearPaciente({
  nombre,
  especie,
  raza,
  sexo,
  fecha_nacimiento,
  vacunas,
  alergias,
  tratamientos,
  responsable,
  telefono_resp,
  correo_resp
}) {
  const [result] = await pool.query(
    `INSERT INTO pacientes 
      (nombre, especie, raza, sexo, fecha_nacimiento, vacunas, alergias, tratamientos, responsable, telefono_resp, correo_resp) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      especie,
      raza || null,
      sexo || 'Macho',
      fecha_nacimiento || null,
      vacunas || null,
      alergias || null,
      tratamientos || null,
      responsable,
      telefono_resp || null,
      correo_resp || null
    ]
  );
  return { id: result.insertId, nombre, especie, raza, sexo, fecha_nacimiento, vacunas, alergias, tratamientos, responsable, telefono_resp, correo_resp };
}

async function actualizarPaciente(id, {
  nombre,
  especie,
  raza,
  sexo,
  fecha_nacimiento,
  vacunas,
  alergias,
  tratamientos,
  responsable,
  telefono_resp,
  correo_resp
}) {
  await pool.query(
    `UPDATE pacientes SET 
      nombre = ?, 
      especie = ?, 
      raza = ?, 
      sexo = ?, 
      fecha_nacimiento = ?, 
      vacunas = ?, 
      alergias = ?, 
      tratamientos = ?, 
      responsable = ?, 
      telefono_resp = ?, 
      correo_resp = ?
     WHERE id = ?`,
    [
      nombre,
      especie,
      raza || null,
      sexo || 'Macho',
      fecha_nacimiento || null,
      vacunas || null,
      alergias || null,
      tratamientos || null,
      responsable,
      telefono_resp || null,
      correo_resp || null,
      id
    ]
  );
  return { id, nombre, especie, raza, sexo, fecha_nacimiento, vacunas, alergias, tratamientos, responsable, telefono_resp, correo_resp };
}

async function borrarPaciente(id) {
  const [result] = await pool.query("DELETE FROM pacientes WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  obtenerTodosLosPacientes,
  obtenerPacientePorID,
  crearPaciente,
  actualizarPaciente,
  borrarPaciente,
};

