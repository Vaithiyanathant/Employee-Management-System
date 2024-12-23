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
import { notify } from "sooner";
import EmployeeHeatmap from "./EmployeeHeatmap";

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
			notify.success("Employee data fetched successfully!");
		} catch (error) {
			notify.error("Error fetching employees. Please try again.");
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

	const blueGradient = [
		"#E3F2FD", // blue-100
		"#BBDEFB", // blue-200
		"#90CAF9", // blue-300
		"#64B5F6", // blue-400
		"#42A5F5", // blue-500
		"#2196F3", // blue-600
		"#1E88E5", // blue-700
		"#1976D2", // blue-800
		"#1565C0", // blue-900
	];

	const getColor = (value, maxValue) => {
		const index = Math.min(
			Math.floor((value / maxValue) * (blueGradient.length - 1)),
			blueGradient.length - 1
		);
		return blueGradient[index];
	};

	const chartData =
		filter === "Department"
			? Object.keys(departmentData).map((key) => ({
					name: key,
					value: departmentData[key],
			  }))
			: Object.keys(roleData).map((key) => ({
					name: key,
					value: roleData[key],
			  }));

	const maxValue = Math.max(...chartData.map((item) => item.value));

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
									fill={getColor(entry.value, maxValue)}
								/>
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "#ffffff", // white
								border: "1px solid #3B82F6", // blue-500
								borderRadius: "5px",
								fontSize: "14px",
							}}
						/>
						<Legend
							layout='horizontal'
							align='center'
							verticalAlign='bottom'
							wrapperStyle={{ fontSize: "14px", color: "#1E3A8A" }}
						/>
					</PieChart>
				);
			case "Bar":
				return (
					<BarChart
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
						<XAxis
							dataKey='name'
							stroke='#1E3A8A'
						/>
						<YAxis stroke='#1E3A8A' />
						<Tooltip />
						<Legend />
						<Bar dataKey='value'>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={getColor(entry.value, maxValue)}
								/>
							))}
						</Bar>
					</BarChart>
				);
			case "Line":
				return (
					<LineChart
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
						<XAxis
							dataKey='name'
							stroke='#1E3A8A'
						/>
						<YAxis stroke='#1E3A8A' />
						<Tooltip />
						<Legend />
						<Line
							type='monotone'
							dataKey='value'
							stroke='#3B82F6'
							dot={{ fill: "#3B82F6" }}
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				);
			default:
				return null;
		}
	};

	return (
		<div className='p-6 bg-[#f9fafb] min-h-screen'>
			<h1 className='text-3xl font-bold text-center mb-8 text-blue-500'>
				📊 Employee Analytics Dashboard
			</h1>

			{/* Stats Cards Section */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
				<div className='p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-2xl font-bold'>👤</span>
					</div>
					<h2 className='text-md font-semibold text-blue-500'>
						Total Employees
					</h2>
					<p className='text-4xl font-extrabold text-blue-500 mt-2'>
						{employees.length}
					</p>
				</div>

				<div className='p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-2xl font-bold'>🏢</span>
					</div>
					<h2 className='text-md font-semibold text-blue-500'>Departments</h2>
					<p className='text-4xl font-extrabold text-blue-500 mt-2'>
						{Object.keys(departmentData).length}
					</p>
				</div>

				<div className='p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-2xl font-bold'>👔</span>
					</div>
					<h2 className='text-md font-semibold text-blue-500'>Roles</h2>
					<p className='text-4xl font-extrabold text-blue-500 mt-2'>
						{Object.keys(roleData).length}
					</p>
				</div>

				<div className='p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center'>
					<div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4'>
						<span className='text-white text-2xl font-bold'>📅</span>
					</div>
					<h2 className='text-md font-semibold text-blue-500'>
						Current Year Joining
					</h2>
					<p className='text-4xl font-extrabold text-blue-500 mt-2'>
						{
							employees.filter(
								(emp) =>
									new Date(emp.dateOfJoining).getFullYear() ===
									new Date().getFullYear()
							).length
						}
					</p>
				</div>
			</div>

			{/* Main Section */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
				{/* Left Section: Chart */}
				<div className='p-6 bg-white rounded-xl shadow-lg border'>
					<div className='mb-6'>
						<h2 className='text-lg font-semibold text-gray-700 text-center'>
							Employees by {filter}
						</h2>
					</div>

					<div className='flex justify-center mb-6 space-x-4'>
						<select
							className='px-4 py-2 rounded-lg border text-black bg-blue-500 text-white hover:bg-blue-600'
							value={selectedChart}
							onChange={(e) => setSelectedChart(e.target.value)}>
							<option value='Pie'>Pie Chart</option>
							<option value='Bar'>Bar Chart</option>
							<option value='Line'>Line Chart</option>
						</select>
						<select
							className='px-4 py-2 rounded-lg border text-black bg-blue-500 text-white hover:bg-blue-600'
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

				{/* Right Section: Heatmap */}
				<div className='p-6 bg-white rounded-xl shadow-lg border'>
					<EmployeeHeatmap />
				</div>
			</div>
		</div>
	);
};

export default EmployeeAnalytics;
