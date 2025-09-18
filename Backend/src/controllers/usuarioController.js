const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

// LISTAR
async function listar(req, res) {
  try {
    const usuarios = await Usuario.obtenerTodosLosUsuarios();
    const safe = usuarios.map(u => ({ ...u, clave_hash: undefined }));
    res.json(safe);
  } catch (e) {
    console.error("Error listar usuarios:", e);
    res.status(500).json({ error: e?.sqlMessage || "Error interno" });
  }
}

// OBTENER POR ID
async function obtener(req, res) {
  try {
    const usuario = await Usuario.obtenerUsuarioPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: "No encontrado" });
    delete usuario.clave_hash;
    res.json(usuario);
  } catch (e) {
    console.error("Error obtener usuario:", e);
    res.status(500).json({ error: e?.sqlMessage || "Error interno" });
  }
}

async function crear(req, res) {
  try {
    const { empleado_id, usuario, rol_id, activo } = req.body;
    const plain = req.body.clave ?? req.body.clave_hash;

    if (!empleado_id || !usuario || !plain || !rol_id) {
      return res.status(400).json({ error: "empleado_id, usuario, clave y rol_id son requeridos" });
    }

    const hashed = await bcrypt.hash(String(plain), 10);

    const nuevo = await Usuario.crearUsuario({
      empleado_id: Number(empleado_id),
      usuario: String(usuario).trim(),
      clave_hash: hashed,
      rol_id: Number(rol_id),
      activo: activo ? 1 : 0,
    });

    if (nuevo) delete nuevo.clave_hash;
    res.status(201).json(nuevo);
  } catch (e) {
    console.error("Error crear usuario:", e);
    if (e?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Usuario duplicado" });
    }
    res.status(500).json({ error: e?.sqlMessage || "Error interno" });
  }
}

async function actualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const { empleado_id, usuario, rol_id, activo } = req.body;
    const plain = req.body.clave ?? req.body.clave_hash;

    if (!id || !empleado_id || !usuario || !rol_id) {
      return res.status(400).json({ error: "id, empleado_id, usuario y rol_id son requeridos" });
    }

    let hashedToSave = null;
    if (plain && String(plain).trim() !== "") {
      hashedToSave = await bcrypt.hash(String(plain), 10);
    } else {
      
      const actual = await Usuario.obtenerUsuarioPorId(id);
      if (!actual) return res.status(404).json({ error: "No encontrado" });
      hashedToSave = actual.clave_hash;
    }

    const upd = await Usuario.actualizarUsuario(id, {
      empleado_id: Number(empleado_id),
      usuario: String(usuario).trim(),
      clave_hash: hashedToSave,
      rol_id: Number(rol_id),
      activo: activo ? 1 : 0,
    });

    if (upd) delete upd.clave_hash;
    res.json(upd);
  } catch (e) {
    console.error("Error actualizar usuario:", e);
    if (e?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Usuario duplicado" });
    }
    res.status(500).json({ error: e?.sqlMessage || "Error interno" });
  }
}

async function eliminar(req, res) {
  try {
    await Usuario.BorrarUsuario(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error("Error eliminar usuario:", e);
    res.status(500).json({ error: e?.sqlMessage || "Error interno" });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };