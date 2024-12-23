/** @format */

import React, { useState } from "react";
import {
	FaHome,
	FaUsers,
	FaCalendarAlt,
	FaBriefcase,
	FaChevronDown,
	FaChevronRight,
	FaSignOutAlt,
	FaFileImport,
	FaUserPlus,
	FaChartPie,
} from "react-icons/fa";
import { notify } from "sooner";
import { Link } from "react-router-dom";

const Sidebar = () => {
	const [isEmployeeMenuOpen, setEmployeeMenuOpen] = useState(true);

	const handleLogout = () => {
		notify.info("You have logged out successfully!");
	};

	return (
		<div className='bg-[#f9fafb] h-screen w-64 flex flex-col text-gray-700 border-r border-gray-200 fixed'>
			{/* Logo Section */}
			<div className='flex items-center justify-center h-16 border-b border-gray-200 bg-[#f9fafb'>
				<div className='flex items-center'>
					<div className='bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold'>
						V
					</div>
					<h1 className='text-xl font-bold ml-2 text-blue-500'>EMS</h1>
				</div>
			</div>

			{/* Navigation Links */}
			<nav className='flex-1 overflow-y-auto p-4'>
				<ul className='space-y-2'>
					{/* Dashboard */}
					<li>
						<Link
							to='/'
							className='flex items-center px-4 py-2 text-black hover:text-white hover:bg-blue-600 rounded-lg transition-colors'>
							<FaHome className='h-5 w-5 mr-3' /> Home
						</Link>
					</li>

					{/* Employee Menu */}
					<li>
						<button
							onClick={() => setEmployeeMenuOpen(!isEmployeeMenuOpen)}
							className='flex items-center w-full px-4 py-2 text-black hover:text-white hover:bg-blue-600 rounded-lg transition-colors'>
							<FaUsers className='h-5 w-5 mr-3' /> Manage Employee
							{isEmployeeMenuOpen ? (
								<FaChevronDown className='h-4 w-4 ml-auto' />
							) : (
								<FaChevronRight className='h-4 w-4 ml-auto' />
							)}
						</button>
						{isEmployeeMenuOpen && (
							<ul className='pl-10 space-y-1 mt-2'>
								<li>
									<Link
										to='/employees'
										className='flex items-center px-4 py-2 text-black hover:text-white hover:bg-blue-600 rounded-lg transition-colors'>
										<FaBriefcase className='h-5 w-5 mr-2' /> Display Employee
									</Link>
								</li>
								<li>
									<Link
										to='/Add-emp'
										className='flex items-center px-4 py-2 text-black hover:text-white hover:bg-blue-600 rounded-lg transition-colors'>
										<FaUserPlus className='h-5 w-5 mr-2' /> Add Employee
									</Link>
								</li>
								<li>
									<Link
										to='/import-excel'
										className='flex items-center px-4 py-2 text-black hover:text-white hover:bg-blue-600 rounded-lg transition-colors'>
										<FaFileImport className='h-5 w-5 mr-2' /> Import from Excel
									</Link>
								</li>
							</ul>
						)}
					</li>

					{/* Analysis */}
					<li>
						<Link
							to='/emp-analysis'
							className='flex items-center px-4 py-2 text-black hover:text-white hover:bg-blue-600 rounded-lg transition-colors'>
							<FaChartPie className='h-5 w-5 mr-3' /> Analysis
						</Link>
					</li>
				</ul>
			</nav>

			{/* Footer */}
		</div>
	);
};

export default Sidebar;
