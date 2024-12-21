/** @format */

import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import API from "../utils/api"; // Adjust the path as necessary
import { toast } from "react-toastify";

const EmployeeTable = () => {
	const [employees, setEmployees] = useState([]);
	const [editRowId, setEditRowId] = useState(null);
	const [editedEmployee, setEditedEmployee] = useState({});
	const [searchTerm, setSearchTerm] = useState("");
	const formatDate = (date) =>
		date ? new Date(date).toISOString().split("T")[0] : "";
	const validateEmployee = (employee) => {
		if (!employee.name.trim()) return "Name is required.";
		if (!/^\d{10}$/.test(employee.phone))
			return "Phone number must be 10 digits.";
		if (!employee.email.includes("@")) return "Invalid email format.";
		return null;
	};

	// Fetch employees from the database
	const fetchEmployees = async () => {
		try {
			const response = await API.get("/employees/list");
			setEmployees(response.data);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch employees");
		}
	};

	useEffect(() => {
		fetchEmployees();

		const interval = setInterval(() => {
			fetchEmployees();
		}, 5000); // Polling every 5 seconds for real-time updates

		return () => clearInterval(interval);
	}, []);

	// Handle delete employee
	const handleDelete = async (id) => {
		try {
			await API.delete(`/employees/delete/${id}`);
			setEmployees((prevEmployees) =>
				prevEmployees.filter((emp) => emp.id !== id)
			);
			toast.success("Employee deleted successfully!");
		} catch (error) {
			toast.error("Failed to delete employee!");
		}
	};

	// Handle edit initiation
	const handleEdit = (id, employee) => {
		setEditRowId(id);
		setEditedEmployee({
			name: employee.name || "",
			email: employee.email || "",
			phone: employee.phone || "",
			department: employee.department || "",
			dateOfJoining: employee.dateOfJoining || "",
			role: employee.role || "",
		});
	};

	// Handle edit cancellation
	const handleCancelEdit = () => {
		setEditRowId(null);
		setEditedEmployee({});
	};

	// Handle save changes
	const handleSave = async (id) => {
		const validationError = validateEmployee(editedEmployee);
		if (validationError) {
			toast.error(validationError);
			return;
		}

		try {
			const updatedEmployee = {
				...editedEmployee,
				dateOfJoining: formatDate(editedEmployee.dateOfJoining),
			};
			await API.put(`/employees/update/${id}`, updatedEmployee);
			setEmployees((prev) =>
				prev.map((emp) =>
					emp.id === id ? { ...emp, ...updatedEmployee } : emp
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
		<div className='w-full p-8 bg-white shadow-lg rounded-lg'>
			<div className='overflow-x-auto'>
				<input
					type='text'
					placeholder='Search employees...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='mb-4 p-2 border border-gray-300 rounded w-full'
				/>
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
								<td className='px-4 py-3'>
									{editRowId === emp.id ? (
										<input
											type='date'
											value={formatDate(editedEmployee.dateOfJoining)}
											onChange={(e) =>
												setEditedEmployee({
													...editedEmployee,
													dateOfJoining: e.target.value,
												})
											}
											className='w-full px-2 py-1 border border-gray-300 rounded'
										/>
									) : (
										formatDate(emp.dateOfJoining)
									)}
								</td>
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

export default EmployeeTable;
