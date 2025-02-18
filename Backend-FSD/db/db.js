/** @format */

const mysql = require("mysql2");

// local config ithu

const connection = mysql.createConnection({
	host: "localhost",
	user: "root", 
	password: "", // password kedikathu inga
	database: "employee_management",
});

connection.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL:", err);
		return;
	}
	console.log("Connected to MySQL Database");
});

module.exports = connection;
