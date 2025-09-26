const express = require("express");
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");
const permit = require("../middleware/roleMiddleware");

// View users: all roles
router.get("/", verifyToken, permit("admin","editor","user"), getAllUsers);

// Add user: admin only
router.post("/", verifyToken, permit("admin"), createUser);

// Edit user: admin and editor
router.put("/:id", verifyToken, permit("admin","editor"), updateUser);

// Delete user: admin only
router.delete("/:id", verifyToken, permit("admin"), deleteUser);

module.exports = router;
