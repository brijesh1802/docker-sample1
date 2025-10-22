import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/users", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users");
  res.json(rows);
});

app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  await db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
  res.status(201).json({ message: "User added" }); // ✅ JSON response
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
