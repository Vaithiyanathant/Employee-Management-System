	/** @format */

	import React, { useState } from "react";
	import API from "../utils/api";
	import { toast } from "react-toastify";
	import { FaMicrophone } from "react-icons/fa";
	import EmployeeTable from "./EmployeeTable";

	const AddEmployeeForm = () => {
		const [formData, setFormData] = useState({
			name: "",
			employeeId: "",
			email: "",
			phone: "",
			department: "",
			dateOfJoining: "",
			role: "",
		});

		const [errors, setErrors] = useState({});
		const [isListening, setIsListening] = useState(false);

		const handleChange = (e) => {
			const { name, value } = e.target;
			if (name === "phone" && !/^\d*$/.test(value)) return;
			setFormData({ ...formData, [name]: value });
			setErrors({ ...errors, [name]: "" });
		};

		const handleSpeechInput = (fieldName) => {
			const SpeechRecognition =
				window.SpeechRecognition || window.webkitSpeechRecognition;

			if (!SpeechRecognition) {
				toast.error("Your browser does not support Speech Recognition.");
				return;
			}

			const recognition = new SpeechRecognition();
			recognition.lang = "en-US";
			recognition.interimResults = false;

			recognition.onstart = () => {
				setIsListening(true);
			};

			recognition.onresult = (event) => {
				const transcript = event.results[0][0].transcript;
				setFormData((prev) => ({ ...prev, [fieldName]: transcript }));
				setIsListening(false);
			};

			recognition.onerror = (event) => {
				console.error("Speech recognition error:", event.error);
				toast.error("Error capturing voice input.");
				setIsListening(false);
			};

			recognition.onend = () => {
				setIsListening(false);
			};

			recognition.start();
		};

		const validate = () => {
			const newErrors = {};
			if (!formData.name.trim() || formData.name.split(" ").length < 2) {
				newErrors.name = "Name must include first and last name.";
			}
			if (!/^[a-zA-Z0-9]{1,10}$/.test(formData.employeeId)) {
				newErrors.employeeId =
					"Employee ID must be alphanumeric (1-10 characters).";
			}
			if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
				newErrors.email = "Invalid email format.";
			}
			if (!/^\d{10}$/.test(formData.phone)) {
				newErrors.phone = "Phone number must be exactly 10 digits.";
			}
			if (!formData.department) {
				newErrors.department = "Department is required.";
			}
			const today = new Date().toISOString().split("T")[0];
			if (!formData.dateOfJoining || formData.dateOfJoining > today) {
				newErrors.dateOfJoining = "Date of Joining cannot be in the future.";
			}
			if (!formData.role) {
				newErrors.role = "Role is required.";
			}
			setErrors(newErrors);
			return Object.keys(newErrors).length === 0;
		};

		const handleSubmit = async (e) => {
			e.preventDefault();
			if (!validate()) {
				toast.error("Please fix the validation errors before submitting.");
				return;
			}
			try {
				const response = await API.post("/employees/add", formData);
				toast.success(response.data.message);
				setFormData({
					name: "",
					employeeId: "",
					email: "",
					phone: "",
					department: "",
					dateOfJoining: "",
					role: "",
				});
				setErrors({});
			} catch (error) {
				toast.error(error.response?.data?.error || "Submission failed!");
			}
		};

		return (
			<>
				<div className='w-full p-8 bg-white shadow-lg rounded-lg mb-3'>
					<h2 className='text-3xl font-bold mb-6 text-[#f15656] text-center'>
						Add Employee
					</h2>
					<form
						onSubmit={handleSubmit}
						className='space-y-6'>
						{/* Input Fields */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							{[
								{
									label: "Name",
									name: "name",
									placeholder: "First and Last Name",
								},
								{
									label: "Employee ID",
									name: "employeeId",
									placeholder: "Max 10 Alphanumeric",
								},
								{
									label: "Email",
									name: "email",
									placeholder: "example@email.com",
								},
								{
									label: "Phone",
									name: "phone",
									placeholder: "10-digit Number",
									maxLength: 10,
								},
							].map((field) => (
								<div key={field.name}>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										{field.label}
									</label>
									<div className='relative flex items-center'>
										<input
											name={field.name}
											value={formData[field.name]}
											onChange={handleChange}
											placeholder={field.placeholder}
											maxLength={field.maxLength || undefined}
											className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'
										/>
										<FaMicrophone
											className={`absolute right-3 cursor-pointer ${
												isListening ? "text-red-500" : "text-gray-400"
											}`}
											onClick={() => handleSpeechInput(field.name)}
										/>
									</div>
									{errors[field.name] && (
										<p className='text-red-500 text-sm'>{errors[field.name]}</p>
									)}
								</div>
							))}
						</div>
						{/* Dropdowns */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Department
								</label>
								<select
									name='department'
									value={formData.department}
									onChange={handleChange}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'>
									<option value=''>Select Department</option>
									<option value='CSE'>CSE</option>
									<option value='IT'>IT</option>
									<option value='ECE'>ECE</option>
									<option value='MECH'>MECH</option>
									<option value='BME'>BME</option>
								</select>
								{errors.department && (
									<p className='text-red-500 text-sm'>{errors.department}</p>
								)}
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Date of Joining
								</label>
								<input
									name='dateOfJoining'
									type='date'
									value={formData.dateOfJoining}
									onChange={handleChange}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'
								/>
								{errors.dateOfJoining && (
									<p className='text-red-500 text-sm'>{errors.dateOfJoining}</p>
								)}
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Role
								</label>
								<select
									name='role'
									value={formData.role}
									onChange={handleChange}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'>
									<option value=''>Select Role</option>
									<option value='SDE'>SDE</option>
									<option value='FSD'>FSD</option>
									<option value='UI UX'>UI UX</option>
								</select>
								{errors.role && (
									<p className='text-red-500 text-sm'>{errors.role}</p>
								)}
							</div>
						</div>
						{/* Buttons */}
						<div className='flex justify-end space-x-4'>
							<button
								type='submit'
								className='px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'>
								Submit
							</button>
							<button
								type='reset'
								onClick={() =>
									setFormData({
										name: "",
										employeeId: "",
										email: "",
										phone: "",
										department: "",
										dateOfJoining: "",
										role: "",
									})
								}
								className='px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'>
								Reset
							</button>
						</div>
					</form>
				</div>
				<EmployeeTable />
			</>
		);
	};

	export default AddEmployeeForm;
