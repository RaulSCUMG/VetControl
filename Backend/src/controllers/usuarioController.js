const usuarioModel = require("../models/usuario");

async function listar(req, res) {
  try {
    const usuarios = await usuarioModel.obtenerTodosLosUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function obtener(req, res) {
  try {
    const { id } = req.params;
    const usuario = await usuarioModel.obtenerUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function crear(req, res) {
  try {
    const { empleado_id, usuario, clave_hash, rol_id } = req.body;
    const nuevoId = await usuarioModel.crearUsuario({ empleado_id, usuario, clave_hash, rol_id });
    res.status(201).json({ message: "Usuario creado correctamente", id: nuevoId });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const actualizado = await usuarioModel.actualizarUsuario(id, req.body);
    if (!actualizado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await usuarioModel.eliminarUsuario(id);
    if (!eliminado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  listar,
  crear,
  obtener,
  actualizar,
  eliminar
};
