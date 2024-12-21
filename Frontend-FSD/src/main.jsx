/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// Select the root element
import "./index.css"; // Import Tailwind CSS

const rootElement = document.getElementById("root");

// Create the root using the correct import
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
