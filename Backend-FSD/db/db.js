/** @format */

const mysql = require("mysql2");

// local config ithu

const connection = mysql.createConnection({
	host: "localhost",
	user: "root", // Your MySQL username
	password: "3030", // Your MySQL password
	database: "employee_management",
});

//const connection = mysql.createConnection({
//	host: "bkeqwbrw9vvaji11m5lr-mysql.services.clever-cloud.com",
//	user: "uoyn81xrniw1b8ue", // Your MySQL username
//	password: "QViLsxSfqZXh8cPEhmxS", // Your MySQL password
//	database: "bkeqwbrw9vvaji11m5lr",
//});

//const connection = mysql.createConnection({
//	host: "be3qntz0atsxfp9pmgji-mysql.services.clever-cloud.com",
//	user: "uvilzovkrzxzrrg9", // Your MySQL username
//	password: "6heJRCo37294QxVd1Eav", // Your MySQL password
//	database: "be3qntz0atsxfp9pmgji",
//});

//
// clever cloud config ithu
//const connection = mysql.createConnection({
//	host: "bb21nq3nqa6f9ycerga9-mysql.services.clever-cloud.com",
//	user: "ukkpyho4axw90o5n",
//	password: "lo0z827brCWL1vL1JZQL",
//	database: "bb21nq3nqa6f9ycerga9",
//	port: 3306,
//});

connection.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL:", err);
		return;
	}
	console.log("Connected to MySQL Database");
});

module.exports = connection;
