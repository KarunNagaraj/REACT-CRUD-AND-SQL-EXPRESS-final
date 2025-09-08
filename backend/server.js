// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// --- IMPORTANT: CONFIGURE YOUR DATABASE CONNECTION ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // <-- Change this
  password: "6996", // <-- Change this
  database: "crud"   // <-- Change this
});

// -- API ENDPOINTS --

// READ (Get all items)
app.get("/api/items", (req, res) => {
  const sql = "SELECT * FROM items ORDER BY id DESC";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// CREATE (Add a new item)
app.post("/api/items", (req, res) => {
  const sql = "INSERT INTO items (`text`) VALUES (?)";
  const values = [req.body.text];
  db.query(sql, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json({ success: true });
  });
});

// UPDATE (Edit an existing item)
app.put("/api/items/:id", (req, res) => {
  const sql = "UPDATE items SET `text` = ? WHERE id = ?";
  const values = [req.body.text];
  const id = req.params.id;
  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.json(err);
    return res.json({ success: true });
  });
});

// DELETE (Remove an item)
app.delete("/api/items/:id", (req, res) => {
  const sql = "DELETE FROM items WHERE id = ?";
  const id = req.params.id;
  db.query(sql, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json({ success: true });
  });
});

app.listen(8081, () => {
  console.log("Backend server is listening on http://localhost:8081");
});