/** @format */

import React from "react";
import AddEmployeeForm from "../components/AddEmployeeForm";
import EmployeeList from "../components/EmployeeList";

const EmployeeManagementPage = () => {
	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header Section */}
			<header className='bg-black text-white py-2 shadow-md'>
				<div className='max-w-7xl mx-auto px-4 text-center'>
					<h1 className='text-4xl font-bold'>Employee Management</h1>
					<p className='text-lg text-gray-200 mt-2'>
						Easily manage and organize your employee records.
					</p>
					
				</div>
			</header>

			{/* Content Section */}
			<main className='mt-8 max-w-7xl mx-auto px-4'>
				<AddEmployeeForm />
				<div className='mt-6'>
					<EmployeeList />
				</div>
			</main>
		</div>
	);
};

export default EmployeeManagementPage;
