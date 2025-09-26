const express = require("express");
const router = express.Router();
const { login, refreshToken, logout } = require("../controllers/authController");
const { createUser } = require("../controllers/userController");

// Existing routes
router.post("/login", login);
router.post("/refresh", refreshToken);

// Add public register route
router.post("/register", createUser); // anyone can register
router.post("/logout", logout);

module.exports = router;
