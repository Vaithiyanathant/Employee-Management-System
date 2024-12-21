/** @format */

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import EmployeeList from "./components/EmployeeList";
import ImportExcel from "./components/ImportExcel";
import AddEmployeeForm from "./components/AddEmployeeForm";
import EmployeeAnalytics from "./components/EmployeeAnalytics";

const App = () => {
	return (
		<BrowserRouter>
			<div className='flex h-screen bg-gray-100'>
				{/* Sidebar - Fixed on the Left */}
				<div className='w-64 bg-white shadow-md'>
					<Sidebar />
				</div>

				{/* Main Content - Right of Sidebar */}
				<div className='flex-1 flex flex-col'>
					{/* Navbar */}
					<Navbar />

					{/* Page Content */}
					<div className='p-6 flex-1 bg-gray-50 overflow-y-auto'>
						<Routes>
							{/* Employee List Route */}
							<Route
								path='/employees'
								element={<EmployeeList />}
							/>

							{/* Import Excel Route */}
							<Route
								path='/import-excel'
								element={<ImportExcel />}
							/>
							<Route
								path='/Add-emp'
								element={<AddEmployeeForm />}
							/>
							<Route
								path='/emp-analysis'
								element={<EmployeeAnalytics />}
							/>

							{/* Default Route */}
							<Route
								path='/'
								element={
									<div className='text-center mt-10'>
										<h1 className='text-3xl font-bold text-gray-800'>
											Welcome to the Employee Management System
										</h1>
										<p className='text-gray-600 mt-4'>
											Use the sidebar to navigate through the sections.
										</p>
									</div>
								}
							/>
						</Routes>
						<ToastContainer />
					</div>
				</div>
			</div>
		</BrowserRouter>
	);
};

export default App;
