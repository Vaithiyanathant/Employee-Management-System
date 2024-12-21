/** @format */

const express = require("express");
const router = express.Router();
const db = require("../db/db");

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
