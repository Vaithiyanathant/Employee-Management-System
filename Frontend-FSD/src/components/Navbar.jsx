/** @format */

import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

const Navbar = () => {
	return (
		<div className='bg-white h-16 w-full flex items-center justify-between px-6 shadow-md border-b border-gray-200'>
			{/* Left Section: Logo and Search Bar */}
			<div className='flex items-center space-x-4'>
				{/* Logo */}

				{/* Search Bar */}
			</div>

			{/* Right Section: Notifications and Profile */}
			<div className='flex items-center space-x-6'>
				{/* Notifications Icon */}
				<div className='flex items-center bg-gray-100 rounded-full px-4 py-2 w-96 m-6'>
					<FaSearch className='text-gray-400 mr-3' />
					<input
						type='text'
						placeholder='Search'
						className='bg-gray-100 text-gray-600 focus:outline-none w-full'
					/>
					<kbd className='text-xs text-gray-400 ml-3'>⌘ P</kbd>
				</div>

				<div className='relative'>
					<button className='text-gray-500 hover:text-gray-700'>
						<FaBell className='h-5 w-5' />
					</button>
					<span className='absolute top-0 right-0 h-2 w-2 bg-[#f15656] rounded-full'></span>
				</div>

				{/* Divider */}
				<div className='h-6 w-[1px] bg-gray-300'></div>

				{/* User Profile */}
				<div className='flex items-center space-x-2'>
					<img
						src='https://via.placeholder.com/32'
						alt='User Avatar'
						className='h-8 w-8 rounded-full object-cover'
					/>
					<button className='text-gray-500 hover:text-gray-700'>
						<MdKeyboardArrowDown className='h-5 w-5' />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
