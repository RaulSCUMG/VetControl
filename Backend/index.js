const app = require("./app");
const { ensureDbConnection } = require("./db");

const PORT = Number(process.env.PORT ?? 3000);

(async () => {
  console.log("Iniciando app... verificando base de datos...");
  try {
    await ensureDbConnection();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Fallo al iniciar la app (DB no disponible):", err);
    process.exit(1);
  }
})();

process.on("unhandledRejection", (r) => console.error("Unhandled Rejection:", r));
process.on("uncaughtException", (e) => {
  console.error("Uncaught Exception:", e);
  process.exit(1);
});
