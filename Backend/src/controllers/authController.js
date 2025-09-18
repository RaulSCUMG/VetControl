const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

function signToken(user) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  const expiresIn = process.env.JWT_EXPIRES || "8h";
  // incluye info mínima
  return jwt.sign(
    { id: user.id, usuario: user.usuario, rol_id: user.rol_id },
    secret,
    { expiresIn }
  );
}

async function login(req, res) {
  try {
    const { usuario, clave } = req.body;
    if (!usuario || !clave) return res.status(400).json({ error: "usuario y clave son requeridos" });

    const u = await Usuario.obtenerUsuarioPorUsuario(usuario);
    // mensajes genéricos para no filtrar info
    if (!u) return res.status(401).json({ error: "Credenciales inválidas" });
    if (!u.activo) return res.status(401).json({ error: "Cuenta inactiva" });

    const ok = await bcrypt.compare(String(clave), u.clave_hash || "");
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    // actualizar último login (opcional)
    await Usuario.actualizarUltimoLogin(u.id);

    const token = signToken(u);
    // no exponer hash
    const { clave_hash, ...safe } = u;
    return res.json({ token, user: safe });
  } catch (e) {
    console.error("Error login:", e);
    return res.status(500).json({ error: "Error interno" });
  }
}

async function me(req, res) {
  try {
    // req.user viene del middleware
    const u = await Usuario.obtenerUsuarioPorId(req.user.id);
    if (!u) return res.status(404).json({ error: "No encontrado" });
    delete u.clave_hash;
    res.json({ user: u });
  } catch (e) {
    return res.status(500).json({ error: "Error interno" });
  }
}

module.exports = { login, me };