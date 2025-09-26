const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err });
    if (!results.length) return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    db.query("UPDATE users SET refreshToken=? WHERE id=?", [refreshToken, user.id], (err) => {
      if (err) return res.status(500).json({ message: err });
      res.json({ accessToken, refreshToken, user: { id: user.id, name: user.name, role: user.role } });
    });
  });
};

exports.refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Refresh token missing" });

  db.query("SELECT * FROM users WHERE refreshToken=?", [token], (err, results) => {
    if (err) return res.status(500).json({ message: err });
    if (!results.length) return res.status(403).json({ message: "Invalid refresh token" });

    const user = results[0];
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    db.query("UPDATE users SET refreshToken=? WHERE id=?", [newRefreshToken, user.id], (err) => {
      if (err) return res.status(500).json({ message: err });
      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  });
};


exports.logout = (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    db.query(
      "UPDATE users SET refreshToken = NULL WHERE refreshToken = ?",
      [refreshToken],
      (err, result) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
          return res.status(400).json({ message: "Invalid refresh token" });
        }

        return res.status(200).json({ message: "Logged out successfully" });
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};