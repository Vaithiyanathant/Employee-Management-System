/** @format */

import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import EmployeeList from "./components/EmployeeList";
import ImportExcel from "./components/ImportExcel";
import AddEmployeeForm from "./components/AddEmployeeForm";
import EmployeeAnalytics from "./components/EmployeeAnalytics";
import HomePage from "./components/HomePage";

const App = () => {
	return (
		<BrowserRouter>
			<div className='flex h-screen bg-gray-100'>
				{/* Sidebar */}
				<div className='w-64 bg-white shadow-md hidden md:block'>
					<Sidebar />
				</div>

				{/* Main Content */}
				<div className='flex-1 flex flex-col'>
					{/* Navbar */}
					<Navbar />

					{/* Page Content */}
					<div className='p-6 flex-1 bg-[#f9fafb] overflow-y-auto'>
						<Routes>
							{/* Employee List */}
							<Route
								path='/employees'
								element={<EmployeeList />}
							/>
							{/* Import Excel */}
							<Route
								path='/import-excel'
								element={<ImportExcel />}
							/>
							{/* Add Employee */}
							<Route
								path='/Add-emp'
								element={<AddEmployeeForm />}
							/>
							{/* Employee Analytics */}
							<Route
								path='/emp-analysis'
								element={<EmployeeAnalytics />}
							/>
							{/* Default Route */}
							<Route
								path='/'
								element={<HomePage />}
							/>
							{/* Fallback Route */}
							<Route
								path='*'
								element={
									<div className='text-center mt-10'>
										<h1 className='text-3xl font-bold text-red-500'>404</h1>
										<p className='text-gray-600 mt-4'>Page Not Found</p>
									</div>
								}
							/>
						</Routes>
					</div>
				</div>
			</div>
			<ToastContainer />
		</BrowserRouter>
	);
};

export default App;
