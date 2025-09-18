const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const { requireAuth } = require("../middlewares/auth");

router.post("/login", auth.login);
router.get("/me", requireAuth, auth.me);

module.exports = router;
