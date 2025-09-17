const Empleado = require("../models/empleados");

async function listar(req, res) {
  try {
    const empleados = await Empleado.obtenerTodosLosEmpleados();
    res.json(empleados);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al listar empleados" });
  }
}

async function obtener(req, res) {
  try {
    const empleado = await Empleado.obtenerEmpleadoPorId(req.params.id);
    if (!empleado) return res.status(404).json({ error: "Empleado no encontrado" });
    res.json(empleado);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al obtener empleado" });
  }
}

async function crear(req, res) {
  try {
    const { nombre, nombre2, apellido, apellido2, apellido_casada, dpi, telefono, tipo_empleado_id, especialidad_id } = req.body;

    if (!nombre || !apellido || !dpi || !tipo_empleado_id) {
      return res.status(400).json({ error: "Nombre, apellido, DPI y tipo_empleado_id son requeridos" });
    }

    const nuevo = await Empleado.crearEmpleado({
      nombre,
      nombre2,
      apellido,
      apellido2,
      apellido_casada,
      dpi,
      telefono,
      tipo_empleado_id,
      especialidad_id
    });

    res.status(201).json(nuevo);
  } catch (e) {
    if (e && e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Alguna llave foránea no existe" });
    }
    console.error(e);
    res.status(500).json({ error: "Error interno al crear empleado" });
  }
}

async function actualizar(req, res) {
  try {
    const actualizado = await Empleado.actualizarEmpleado(req.params.id, req.body);
    res.json(actualizado);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al actualizar empleado" });
  }
}

async function eliminar(req, res) {
  try {
    await Empleado.borrarEmpleado(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno al eliminar empleado" });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
