const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Get all users
exports.getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: err });
    res.json(results);
  });
};

// Create user
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ message: "Missing fields" });

  const hash = await bcrypt.hash(password, 10);
  db.query("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [name, email, hash, role],
    err => {
      if (err) return res.status(500).json({ message: err });
      res.json({ message: "User created successfully" });
    }
  );
};

// Update user
exports.updateUser = (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;

  const query = "UPDATE users SET name=?, email=?, role=? WHERE id=?";
  db.query(query, [name, email, role, id], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.json({ message: "User updated successfully" });
  });
};


// Delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], err => {
    if (err) return res.status(500).json({ message: err });
    res.json({ message: "User deleted successfully" });
  });
};
