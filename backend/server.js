const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

db.run(`
	CREATE TABLE IF NOT EXISTS projects (
		id INTEGER PRIMARY KEY,
		title TEXT NOT NULL,
		principalInvestigator TEXT NOT NULL,
		department TEXT,
		status TEXT NOT NULL,
		startDate TEXT NOT null)
	`);
	
app.listen(3000, () => {
	console.log("Server running on http://localhost:3000");
});

app.get("/api/projects", (req, res) => {
  const query = req.query.query || "";

  db.all(
    `SELECT * FROM projects
     WHERE title LIKE ? OR principalInvestigator LIKE ?`,
    [`%${query}%`, `%${query}%`],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

app.post("/api/projects", (req, res) => {
	const {title, principalInvestigator, department, status, startDate} = req.body;
	
	if (!title || !principalInvestigator || !department || !status || !startDate) {
		res.status(400).json({error: "Missing required fields"});
	}
	
	const sql = `
		INSERT INTO projects (title, principalInvestigator, department, status, startDate)
		values(?, ?, ?, ?, ?)
	`;
	db.run(sql, [title, principalInvestigator, department, status, startDate], function(err) {
		if (err) {
			res.status(500).json({error: err.message});
			return;
		}
		
		res.status(201).json({
			id: this.lastID,
			title,
			principalInvestigator,
			department,
			status,
			startDate
		});
	});
});