/** @format */

import React, { useEffect, useState } from "react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	LineChart,
	Line,
} from "recharts";
import API from "../utils/api";
import { toast } from "react-toastify";

const EmployeeAnalytics = () => {
	const [employees, setEmployees] = useState([]);
	const [departmentData, setDepartmentData] = useState({});
	const [roleData, setRoleData] = useState({});
	const [selectedChart, setSelectedChart] = useState("Pie");
	const [filter, setFilter] = useState("Department");

	const fetchEmployees = async () => {
		try {
			const response = await API.get("/employees/list");
			setEmployees(response.data);
			processAnalytics(response.data);
		} catch (error) {
			toast.error("Error fetching employees");
		}
	};

	const processAnalytics = (data) => {
		const departmentCount = {};
		const roleCount = {};

		data.forEach((emp) => {
			departmentCount[emp.department] =
				(departmentCount[emp.department] || 0) + 1;
			roleCount[emp.role] = (roleCount[emp.role] || 0) + 1;
		});

		setDepartmentData(departmentCount);
		setRoleData(roleCount);
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	const chartData =
		filter === "Department"
			? Object.keys(departmentData).map((key) => ({
					name: key,
					value: departmentData[key],
					color: "#FF6F61",
			  }))
			: Object.keys(roleData).map((key) => ({
					name: key,
					value: roleData[key],
					color: "#4CAF50",
			  }));

	const renderChart = (data) => {
		switch (selectedChart) {
			case "Pie":
				return (
					<PieChart>
						<Pie
							data={data}
							dataKey='value'
							nameKey='name'
							cx='50%'
							cy='50%'
							outerRadius={100}
							innerRadius={60}
							paddingAngle={5}
							label={({ name, value }) => `${name}: ${value}`}>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.color}
								/>
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "#ffffff",
								border: "1px solid #ddd",
								borderRadius: "5px",
								fontSize: "14px",
							}}
						/>
						<Legend
							layout='horizontal'
							align='center'
							verticalAlign='bottom'
							wrapperStyle={{ fontSize: "14px", color: "#333" }}
						/>
					</PieChart>
				);
			case "Bar":
				return (
					<BarChart
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
						<XAxis dataKey='name' />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar
							dataKey='value'
							fill='#FF6F61'
						/>
					</BarChart>
				);
			case "Line":
				return (
					<LineChart
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
						<XAxis dataKey='name' />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line
							type='monotone'
							dataKey='value'
							stroke='#FF6F61'
						/>
					</LineChart>
				);
			default:
				return null;
		}
	};

	return (
		<div className='p-6 bg-gradient-to-br from-white via-gray-100 to-white min-h-screen'>
			<h1 className='text-3xl font-bold text-center mb-8 text-[#dc2626]'>
				📊 Employee Analytics Dashboard
			</h1>

			{/* Stats Cards Section */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
				<div className='p-6 bg-[#fee2e2] rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-[#f15656] rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-2xl font-bold'>👤</span>
					</div>
					<h2 className='text-md font-semibold text-[#f15656]'>
						Total Employees
					</h2>
					<p className='text-4xl font-extrabold text-[#f15656] mt-2'>
						{employees.length}
					</p>
				</div>

				<div className='p-6 bg-[#fff9c4] rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-[#fbc02d] rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-2xl font-bold'>🏢</span>
					</div>
					<h2 className='text-md font-semibold text-[#fbc02d]'>Departments</h2>
					<p className='text-4xl font-extrabold text-[#fbc02d] mt-2'>
						{Object.keys(departmentData).length}
					</p>
				</div>

				<div className='p-6 bg-[#c8e6c9] rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-[#43a047] rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-2xl font-bold'>👔</span>
					</div>
					<h2 className='text-md font-semibold text-[#43a047]'>Roles</h2>
					<p className='text-4xl font-extrabold text-[#43a047] mt-2'>
						{Object.keys(roleData).length}
					</p>
				</div>

				<div className='p-6 bg-[#e3f2fd] rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-[#1e88e5] rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-2xl font-bold'>📅</span>
					</div>
					<h2 className='text-md font-semibold text-[#1e88e5]'>
						Idle Employees	
					</h2>
					<p className='text-4xl font-extrabold text-[#1e88e5] mt-2'>1</p>
				</div>
			</div>

			{/* Main Section */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
				{/* Left Section: Chart */}
				<div className='p-6 bg-white rounded-xl shadow-lg border'>
					<div className=' mb-6'>
						<div className='flex items-center justify-center'>
							<h2 className='text-lg font-semibold text-gray-700 text-center'>
								Employees by {filter}
							</h2>
						</div>
					</div>

					<div className='flex justify-center mb-6 space-x-4'>
						<select
							className='px-4 py-2 rounded-lg border text-black bg-[#fee2e2] hover:bg-[#f15656] hover:text-white focus:outline-none focus:ring focus:ring-[#f15656]'
							value={selectedChart}
							onChange={(e) => setSelectedChart(e.target.value)}>
							<option value='Pie'>Pie Chart</option>
							<option value='Bar'>Bar Chart</option>
							<option value='Line'>Line Chart</option>
						</select>
						<select
							className='px-4 py-2 rounded-lg border text-black bg-[#fee2e2] hover:bg-[#f15656] hover:text-white focus:outline-none focus:ring focus:ring-[#f15656]'
							value={filter}
							onChange={(e) => setFilter(e.target.value)}>
							<option value='Department'>By Department</option>
							<option value='Role'>By Role</option>
						</select>
					</div>

					<ResponsiveContainer
						width='100%'
						height={400}>
						{renderChart(chartData)}
					</ResponsiveContainer>
				</div>

				{/* Right Section: Empty (For Map) */}
				<div className='p-6 bg-white rounded-xl shadow-lg border flex items-center justify-center'>
					<p className='text-gray-500 italic'>Map section coming soon...</p>
				</div>
			</div>
		</div>
	);
};

export default EmployeeAnalytics;
