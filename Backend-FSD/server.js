/** @format */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { LocalStorage } = require("node-localstorage");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize node-localstorage (data will be stored in the './localStorage' folder)
const localStorage = new LocalStorage("./localStorage");

// If no database exists, initialize it
if (!localStorage.getItem("employeesDB")) {
	localStorage.setItem(
		"employeesDB",
		JSON.stringify({ lastId: 0, employees: [] })
	);
}

// Helper function to load data from local storage
function loadData() {
	return JSON.parse(localStorage.getItem("employeesDB"));
}

// Helper function to save data to local storage
function saveData(data) {
	localStorage.setItem("employeesDB", JSON.stringify(data));
}

const router = express.Router();

// Bulk Upload JSON data
router.post("/upload", (req, res) => {
	try {
		const { data } = req.body;

		if (!data || !Array.isArray(data) || data.length === 0) {
			return res.status(400).json({ error: "Invalid or empty data." });
		}

		const dbData = loadData();
		let rowsInserted = 0;

		data.forEach((row) => {
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

			// Check for duplicate by EmployeeID or Email
			const duplicate = dbData.employees.find(
				(emp) => emp.employeeId === row.EmployeeID || emp.email === row.Email
			);
			if (duplicate) {
				throw new Error("Duplicate entry detected in the database.");
			}

			// Generate a new unique id
			dbData.lastId++;
			const newEmployee = {
				id: dbData.lastId,
				name: row.Name,
				employeeId: row.EmployeeID,
				email: row.Email,
				phone: row.Phone.toString(),
				department: row.Department,
				dateOfJoining: formattedDate,
				role: row.Role,
			};

			dbData.employees.push(newEmployee);
			rowsInserted++;
		});

		saveData(dbData);
		return res.status(200).json({
			message: "Data successfully uploaded to the database.",
			rowsInserted,
		});
	} catch (error) {
		console.error("Error processing upload:", error);
		return res.status(500).json({
			error: error.message || "Error occurred while processing the data.",
		});
	}
});

// Add a single employee
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

	const dbData = loadData();

	// Check for duplicate employeeId or email
	const duplicate = dbData.employees.find(
		(emp) => emp.employeeId === employeeId || emp.email === email
	);
	if (duplicate) {
		return res
			.status(400)
			.json({ error: "Employee ID or Email already exists" });
	}

	// Generate a new unique id
	dbData.lastId++;
	const newEmployee = {
		id: dbData.lastId,
		name,
		employeeId,
		email,
		phone: phone.toString(),
		department,
		dateOfJoining,
		role,
	};

	dbData.employees.push(newEmployee);
	saveData(dbData);
	return res.status(201).json({ message: "Employee added successfully" });
});

// List all employees
router.get("/list", (req, res) => {
	const dbData = loadData();
	res.status(200).json(dbData.employees);
});

// Delete an employee by id
router.delete("/delete/:id", (req, res) => {
	const { id } = req.params;
	const dbData = loadData();

	const index = dbData.employees.findIndex((emp) => emp.id == id);
	if (index === -1) {
		return res.status(404).json({ error: "Employee not found" });
	}

	dbData.employees.splice(index, 1);
	saveData(dbData);
	res.status(200).json({ message: "Employee deleted successfully" });
});

// Update an employee by id
router.put("/update/:id", (req, res) => {
	const { id } = req.params;
	const { name, email, phone, department, dateOfJoining, role } = req.body;

	if (!name || !email || !phone || !department || !dateOfJoining || !role) {
		return res.status(400).json({ error: "All fields are required." });
	}

	const dbData = loadData();
	const employee = dbData.employees.find((emp) => emp.id == id);

	if (!employee) {
		return res.status(404).json({ error: "Employee not found." });
	}

	// Update employee fields
	employee.name = name;
	employee.email = email;
	employee.phone = phone.toString();
	employee.department = department;
	employee.dateOfJoining = dateOfJoining;
	employee.role = role;

	saveData(dbData);
	res.status(200).json({ message: "Employee updated successfully." });
});

// Use the router under /api/employees
app.use("/api/employees", router);

// Root endpoint
app.get("/", (req, res) => {
	res.status(200).json({
		message: "Welcome to the Employee Management API!",
		documentation: "Use /api/employees for CRUD operations.",
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
