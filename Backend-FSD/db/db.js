/** @format */

const mysql = require("mysql2");

// Remote MySQL configuration (Clever Cloud)
const connection = mysql.createConnection({
	host: "bdpokti1lfuieq6nn40n-mysql.services.clever-cloud.com",
	user: "uqexnp2xp9jwck8w",
	password: "HhXSiAzZgWXZ7IRJh62K",
	database: "bdpokti1lfuieq6nn40n",
	port: 3306,
});

connection.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL:", err);
		return;
	}
	console.log("Connected to Clever Cloud MySQL Database");
});

module.exports = connection;
