/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/employees", employeeRoutes);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Welcome to the Employee Management API!",
		documentation: "Use /api/employees for CRUD operations.",
	});
});

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
