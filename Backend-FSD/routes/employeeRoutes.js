/** @format */

const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Upload JSON data to MySQL
router.post("/upload", async (req, res) => {
	try {
		const { data } = req.body;

		if (!data || !Array.isArray(data) || data.length === 0) {
			return res.status(400).json({ error: "Invalid or empty data." });
		}

		// Validate and format data
		const values = data.map((row) => {
			if (
				!row.Name ||
				!row.EmployeeID ||
				!row.Email ||
				!row.Phone ||
				!row.Department ||
				!row["Date of Joining"] ||
				!row.Role
			) {
				throw new Error("Missing required fields in the uploaded data.");
			}

			// Format Date of Joining
			const formattedDate = new Date(row["Date of Joining"])
				.toISOString()
				.split("T")[0];

			return [
				row.Name,
				row.EmployeeID,
				row.Email,
				row.Phone.toString(),
				row.Department,
				formattedDate,
				row.Role,
			];
		});

		// Insert data into the MySQL table
		const sql = `INSERT INTO employees (name, employeeId, email, phone, department, dateOfJoining, role) VALUES ?`;
		db.query(sql, [values], (err, result) => {
			if (err) {
				console.error("Error inserting data:", err);
				if (err.code === "ER_DUP_ENTRY") {
					return res.status(400).json({
						error: "Duplicate entry detected in the database.",
					});
				}
				return res.status(500).json({ error: "Error inserting data." });
			}

			return res.status(200).json({
				message: "Data successfully uploaded to the database.",
				rowsInserted: result.affectedRows,
			});
		});
	} catch (error) {
		console.error("Error processing upload:", error);
		res.status(500).json({
			error: error.message || "Error occurred while processing the data.",
		});
	}
});

// Add
router.post("/add", (req, res) => {
	const { name, employeeId, email, phone, department, dateOfJoining, role } =
		req.body;

	if (
		!name ||
		!employeeId ||
		!email ||
		!phone ||
		!department ||
		!dateOfJoining ||
		!role
	) {
		return res.status(400).json({ error: "All fields are required" });
	}

	const sql = `INSERT INTO employees (name, employeeId, email, phone, department, dateOfJoining, role) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

	db.query(
		sql,
		[name, employeeId, email, phone, department, dateOfJoining, role],
		(err, result) => {
			if (err) {
				if (err.code === "ER_DUP_ENTRY") {
					return res
						.status(400)
						.json({ error: "Employee ID or Email already exists" });
				}
				return res.status(500).json({ error: err.message });
			}
			res.status(201).json({ message: "Employee added successfully" });
		}
	);
});

// Get
router.get("/list", (req, res) => {
	const sql = `SELECT * FROM employees`;

	db.query(sql, (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.status(200).json(results);
	});
});

// Update

// Delete
router.delete("/delete/:id", (req, res) => {
	const { id } = req.params;

	const sql = `DELETE FROM employees WHERE id = ?`;

	db.query(sql, [id], (err, result) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Employee not found" });
		}
		res.status(200).json({ message: "Employee deleted successfully" });
	});
});

router.put("/update/:id", (req, res) => {
	const { id } = req.params; // Employee ID from the URL
	const { name, email, phone, department, dateOfJoining, role } = req.body; // Ensure the field matches the database column name

	if (!name || !email || !phone || !department || !dateOfJoining || !role) {
		return res.status(400).json({ error: "All fields are required." });
	}

	const sql =
		"UPDATE employees SET name = ?, email = ?, phone = ?, department = ?, dateOfJoining = ?, role = ? WHERE id = ?";
	const values = [name, email, phone, department, dateOfJoining, role, id];

	db.query(sql, values, (err, result) => {
		if (err) {
			console.error("Error updating employee:", err);
			return res.status(500).json({ error: "Error updating employee." });
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Employee not found." });
		}

		res.status(200).json({ message: "Employee updated successfully." });
	});
});

module.exports = router;
