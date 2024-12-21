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
} from "react-icons/fa";

const Sidebar = () => {
	const [isEmployeeMenuOpen, setEmployeeMenuOpen] = useState(true);

	return (
		<div className='bg-white h-screen w-64 flex flex-col text-gray-700 border-r border-gray-200 fixed'>
			{/* Logo Section */}
			<div className='flex items-center justify-center h-16 border-b border-gray-200'>
				<div className='flex items-center'>
					<div className='bg-[#f15656] h-8 w-8 rounded-full flex items-center justify-center text-white font-bold'>
						V
					</div>
					<h1 className='text-xl font-bold ml-2 text-gray-800'>Vaithi</h1>
				</div>
			</div>

			{/* Navigation Links */}
			<nav className='flex-1 overflow-y-auto p-2'>
				<ul className='space-y-1 mt-4'>
					{/* Dashboard */}
					<li>
						<a
							href='/'
							className='flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg'>
							<FaHome className='h-5 w-5 mr-3 text-gray-500' /> Home
						</a>
					</li>

					{/* Employee Menu */}
					<li>
						<button
							onClick={() => setEmployeeMenuOpen(!isEmployeeMenuOpen)}
							className='flex items-center w-full px-4 py-2 hover:bg-gray-100 rounded-lg'>
							<FaUsers className='h-5 w-5 mr-3 text-gray-500' /> Manage Employee
							{isEmployeeMenuOpen ? (
								<FaChevronDown className='h-4 w-4 ml-auto text-gray-500' />
							) : (
								<FaChevronRight className='h-4 w-4 ml-auto text-gray-500' />
							)}
						</button>
						{isEmployeeMenuOpen && (
							<ul className='pl-12 space-y-1 mt-2'>
								<li>
									<a
										href='/employees'
										className='flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg'>
										Display Employee
									</a>
								</li>
								<li>
									<a
										href='/Add-emp'
										className='flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg'>
										Add Employee
									</a>
								</li>
								<li>
									<a
										href='/import-excel'
										className='flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg'>
										import From Excell
									</a>
								</li>
							</ul>
						)}
					</li>

					{/* Attendance */}
					<li>
						<a
							href='/emp-analysis'
							className='flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg'>
							<FaCalendarAlt className='h-5 w-5 mr-3 text-gray-500' /> Analysis
						</a>
					</li>

					{/* Time Off */}
					<li>
						<a
							href='#'
							className='flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg'>
							<FaBriefcase className='h-5 w-5 mr-3 text-gray-500' /> Time Off
						</a>
					</li>
				</ul>
			</nav>

			{/* Footer */}
			<div className='py-4 border-t border-gray-200'>
				<a
					href='#'
					className='flex items-center px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg'>
					<FaSignOutAlt className='h-5 w-5 mr-3' /> Logout
				</a>
			</div>
		</div>
	);
};

export default Sidebar;
