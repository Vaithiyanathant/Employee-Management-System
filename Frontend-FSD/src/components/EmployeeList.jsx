/** @format */

import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const EmployeeList = () => {
	const [employees, setEmployees] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [editRowId, setEditRowId] = useState(null);
	const [editedEmployee, setEditedEmployee] = useState({});

	// Fetch all employees
	const fetchEmployees = async () => {
		try {
			const response = await API.get("/employees/list");
			setEmployees(response.data);
		} catch (error) {
			toast.error("Error fetching employees");
		}
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	// Handle delete employee
	const handleDelete = async (id) => {
		try {
			await API.delete(`/employees/delete/${id}`);
			setEmployees(employees.filter((emp) => emp.id !== id));
			toast.success("Employee deleted successfully!");
		} catch (error) {
			toast.error("Failed to delete employee!");
		}
	};

	// Handle edit initiation
	const handleEdit = (id, employee) => {
		setEditRowId(id);
		setEditedEmployee(employee);
	};

	// Handle edit cancelation
	const handleCancelEdit = () => {
		setEditRowId(null);
		setEditedEmployee({});
	};

	// Handle save changes
	const handleSave = async (id) => {
		try {
			await API.put(`/employees/update/${id}`, editedEmployee);
			setEmployees((prevEmployees) =>
				prevEmployees.map((emp) =>
					emp.id === id ? { ...emp, ...editedEmployee } : emp
				)
			);
			setEditRowId(null);
			toast.success("Employee updated successfully!");
		} catch (error) {
			toast.error("Failed to update employee!");
		}
	};

	// Filter employees based on search term
	const filteredEmployees = employees.filter((emp) =>
		emp.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className='max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md'>
			{/* Header Section */}
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-semibold text-gray-700'>
					Manage Employee
				</h2>
				<div className='flex space-x-4'>
					<Link to='/import-excel'>
						<button className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200'>
							Import from Excel
						</button>
					</Link>

					<Link to='/Add-emp'>
						<button className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600'>
							+ Add Employee
						</button>
					</Link>
				</div>
			</div>

			{/* Search Bar */}
			<div className='flex items-center mb-4'>
				<input
					type='text'
					placeholder='Search employee'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
				/>
			</div>

			{/* Employee Table */}
			<div className='overflow-x-auto'>
				<table className='w-full table-auto text-sm border-collapse rounded-md'>
					<thead>
						<tr className='bg-gray-50 text-gray-700 text-sm font-medium'>
							<th className='px-4 py-3 text-left'>ID</th>
							<th className='px-4 py-3 text-left'>Name</th>
							<th className='px-4 py-3 text-left'>Employee ID</th>
							<th className='px-4 py-3 text-left'>Email</th>
							<th className='px-4 py-3 text-left'>Phone</th>
							<th className='px-4 py-3 text-left'>Department</th>
							<th className='px-4 py-3 text-left'>Date of Joining</th>
							<th className='px-4 py-3 text-left'>Role</th>
							<th className='px-4 py-3 text-center'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredEmployees.map((emp, index) => (
							<tr
								key={emp.id}
								className={`text-sm ${
									index % 2 === 0 ? "bg-white" : "bg-gray-50"
								} hover:bg-gray-100`}>
								<td className='px-4 py-3'>{emp.id}</td>
								<td className='px-4 py-3'>
									{editRowId === emp.id ? (
										<input
											type='text'
											value={editedEmployee.name}
											onChange={(e) =>
												setEditedEmployee({
													...editedEmployee,
													name: e.target.value,
												})
											}
											className='w-full px-2 py-1 border border-gray-300 rounded'
										/>
									) : (
										emp.name
									)}
								</td>
								<td className='px-4 py-3'>{emp.employeeId}</td>
								<td className='px-4 py-3'>
									{editRowId === emp.id ? (
										<input
											type='email'
											value={editedEmployee.email}
											onChange={(e) =>
												setEditedEmployee({
													...editedEmployee,
													email: e.target.value,
												})
											}
											className='w-full px-2 py-1 border border-gray-300 rounded'
										/>
									) : (
										emp.email
									)}
								</td>
								<td className='px-4 py-3'>
									{editRowId === emp.id ? (
										<input
											type='text'
											value={editedEmployee.phone}
											onChange={(e) =>
												setEditedEmployee({
													...editedEmployee,
													phone: e.target.value,
												})
											}
											className='w-full px-2 py-1 border border-gray-300 rounded'
										/>
									) : (
										emp.phone
									)}
								</td>
								<td className='px-4 py-3'>
									{editRowId === emp.id ? (
										<input
											type='text'
											value={editedEmployee.department}
											onChange={(e) =>
												setEditedEmployee({
													...editedEmployee,
													department: e.target.value,
												})
											}
											className='w-full px-2 py-1 border border-gray-300 rounded'
										/>
									) : (
										emp.department
									)}
								</td>
								<td className='px-4 py-3'>{emp.dateOfJoining}</td>
								<td className='px-4 py-3'>{emp.role}</td>
								<td className='px-4 py-3 text-center flex justify-center space-x-2'>
									{editRowId === emp.id ? (
										<>
											<button
												className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'
												onClick={() => handleSave(emp.id)}>
												<FaCheck />
											</button>
											<button
												className='px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600'
												onClick={handleCancelEdit}>
												<FaTimes />
											</button>
										</>
									) : (
										<>
											<button
												className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
												onClick={() => handleEdit(emp.id, emp)}>
												Edit
											</button>
											<button
												onClick={() => handleDelete(emp.id)}
												className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'>
												<FaTrash />
											</button>
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default EmployeeList;
