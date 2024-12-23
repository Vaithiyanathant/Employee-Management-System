/** @format */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	FaChartPie,
	FaFileExcel,
	FaEdit,
	FaSearch,
	FaTrashAlt,
} from "react-icons/fa";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5"; // Back icon

const HomePage = () => {
	const navigate = useNavigate();

	// Navigate back to the previous page
	const handleBackClick = () => {
		navigate(-1);
	};

	return (
		<div className='bg-[#f9fafb] min-h-screen p-10 pt-0'>
			{/* Back Button */}

			{/* Title */}
			<h1 className='text-4xl font-bold text-center text-blue-500 mb-10'>
				Employee Management System
			</h1>

			{/* Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
				{/* Analytics Card */}
				<Link to='/emp-analysis'>
					<div className='relative drop-shadow-xl w-full h-64 overflow-hidden rounded-xl bg-blue-500 hover:bg-blue-600 transition-transform transform hover:scale-105'>
						<div className='absolute flex items-center justify-center text-white z-[1] rounded-xl inset-0'>
							<div className='flex flex-col items-center'>
								<FaChartPie className='text-5xl mb-4' />
								<span className='text-xl font-bold'>Analytics</span>
								<p className='text-sm mt-2'>View detailed employee insights</p>
							</div>
						</div>
						<div className='absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2 opacity-30'></div>
					</div>
				</Link>

				{/* Speech Recognition Card */}
				<div className='relative drop-shadow-xl w-full h-64 overflow-hidden rounded-xl bg-blue-500 hover:bg-blue-600 transition-transform transform hover:scale-105'>
					<Link to='/Add-emp'>
						<div className='absolute flex items-center justify-center text-white z-[1] rounded-xl inset-0'>
							<div className='flex flex-col items-center'>
								<MdOutlineKeyboardVoice className='text-5xl mb-4' />
								<span className='text-xl font-bold'>Speech Recognition</span>
								<p className='text-sm mt-2'>Input data using your voice</p>
							</div>
						</div>
						<div className='absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2 opacity-30'></div>
					</Link>
				</div>

				{/* Excel Import Card */}
				<Link to='/import-excel'>
					<div className='relative drop-shadow-xl w-full h-64 overflow-hidden rounded-xl bg-blue-500 hover:bg-blue-600 transition-transform transform hover:scale-105'>
						<div className='absolute flex items-center justify-center text-white z-[1] rounded-xl inset-0'>
							<div className='flex flex-col items-center'>
								<FaFileExcel className='text-5xl mb-4' />
								<span className='text-xl font-bold'>Excel Import</span>
								<p className='text-sm mt-2'>Upload employee data</p>
							</div>
						</div>
						<div className='absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2 opacity-30'></div>
					</div>
				</Link>

				{/* Search Card */}
				<div className='relative drop-shadow-xl w-full h-64 overflow-hidden rounded-xl bg-blue-500 hover:bg-blue-600 transition-transform transform hover:scale-105'>
					<div className='absolute flex items-center justify-center text-white z-[1] rounded-xl inset-0'>
						<div className='flex flex-col items-center'>
							<FaSearch className='text-5xl mb-4' />
							<span className='text-xl font-bold'>Search</span>
							<p className='text-sm mt-2'>Find employees quickly</p>
						</div>
					</div>
					<div className='absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2 opacity-30'></div>
				</div>

				{/* Edit/Delete Card */}
				<Link to='/employees'>
					<div className='relative drop-shadow-xl w-full h-64 overflow-hidden rounded-xl bg-blue-500 hover:bg-blue-600 transition-transform transform hover:scale-105'>
						<div className='absolute flex items-center justify-center text-white z-[1] rounded-xl inset-0'>
							<div className='flex flex-col items-center'>
								<FaEdit className='text-5xl mb-4' />
								<span className='text-xl font-bold'>Manage Employees</span>
								<p className='text-sm mt-2'>Edit or delete employee details</p>
							</div>
						</div>
						<div className='absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2 opacity-30'></div>
					</div>
				</Link>

				{/* Notification and Validation Card */}
				<div className='relative drop-shadow-xl w-full h-64 overflow-hidden rounded-xl bg-blue-500 hover:bg-blue-600 transition-transform transform hover:scale-105'>
										<Link to='/Add-emp'>

					<div className='absolute flex items-center justify-center text-white z-[1] rounded-xl inset-0'>
						<div className='flex flex-col items-center'>
							<FaTrashAlt className='text-5xl mb-4' />
							<span className='text-xl font-bold'>Validation</span>
							<p className='text-sm mt-2'>Ensure proper data input</p>
						</div>
					</div>
					<div className='absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2 opacity-30'></div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
