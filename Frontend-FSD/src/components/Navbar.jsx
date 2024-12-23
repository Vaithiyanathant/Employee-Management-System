/** @format */

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5"; // Back icon
import { useNavigate, useLocation } from "react-router-dom";
import { notify } from "sooner";

const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Routes for search functionality
	const routes = [
		{ label: "Home", path: "/" },
		{ label: "Employee List", path: "/employees" },
		{ label: "Import Excel", path: "/import-excel" },
		{ label: "Add Employee", path: "/Add-emp" },
		{ label: "Employee Analytics", path: "/emp-analysis" },
	];

	// State for search input and dropdown visibility
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredRoutes, setFilteredRoutes] = useState([]);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);

	// Sync search input with the current route on page load or back navigation
	useEffect(() => {
		const currentRoute = routes.find(
			(route) => route.path === location.pathname
		);
		setSearchQuery(currentRoute ? currentRoute.label : "");
		setFilteredRoutes([]); // Clear dropdown options when route changes
		setIsDropdownVisible(false); // Hide dropdown on route change
	}, [location.pathname]);

	// Handle search input changes
	const handleSearchChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);

		if (query.trim() === "") {
			setFilteredRoutes([]);
			setIsDropdownVisible(false);
		} else {
			const filtered = routes.filter((route) =>
				route.label.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredRoutes(filtered);
			setIsDropdownVisible(true);
		}
	};

	// Handle navigation on route selection
	const handleRouteSelect = (path) => {
		setSearchQuery(""); // Clear the search input
		setFilteredRoutes([]); // Clear dropdown options
		setIsDropdownVisible(false); // Hide dropdown
		navigate(path); // Navigate to the selected route
	};

	// Handle Enter key press for navigation
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && filteredRoutes.length > 0) {
			handleRouteSelect(filteredRoutes[0].path);
		}
	};

	return (
		<div className='bg-[#f9fafb] h-auto w-full flex items-center justify-between px-4 py-3 shadow-md border-b border-gray-200 relative'>
			{/* Search Bar */}
			<div className='relative flex items-center bg-white rounded-full px-3 py-2 shadow w-60 sm:w-72 md:w-96'>
				<FaSearch className='text-gray-400 mr-2 sm:mr-3' />
				<input
					type='text'
					value={searchQuery}
					onChange={handleSearchChange}
					onKeyDown={handleKeyDown}
					placeholder='Search...'
					className='bg-white text-gray-600 text-sm sm:text-base focus:outline-none w-full'
				/>
				{/* Dropdown for filtered routes */}
				{isDropdownVisible && (
					<div className='absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
						{filteredRoutes.map((route) => (
							<div
								key={route.path}
								className='px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white'
								onClick={() => handleRouteSelect(route.path)}>
								{route.label}
							</div>
						))}
					</div>
				)}
			</div>
			{/* Back Button */}
			<button
				onClick={() => navigate(-1)}
				className='flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-medium px-2 py-1 bg-white rounded-md shadow-md border border-gray-200 hover:shadow-lg transition'>
				<IoArrowBackOutline className='text-base md:text-lg' />
				<span className='text-sm md:text-base'>Back</span>
			</button>
		</div>
	);
};

export default Navbar;
