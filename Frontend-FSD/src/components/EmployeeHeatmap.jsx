/** @format */

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import API from "../utils/api"; // Import your API instance
import { notify } from "sooner"; // Notification library

const EmployeeHeatmap = () => {
	const [heatmapData, setHeatmapData] = useState([]);
	const [years, setYears] = useState([]);
	const [months] = useState([
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	]);

	useEffect(() => {
		// Fetch employee data from API
		const fetchEmployees = async () => {
			try {
				const response = await API.get("/employees/list"); // Adjust API endpoint as needed
				const employeeData = response.data;

				// Process data for heatmap
				const groupedData = {};
				employeeData.forEach((employee) => {
					const date = new Date(employee.dateOfJoining);
					const year = date.getFullYear();
					const month = date.getMonth(); // 0-based index for months
					if (!groupedData[year]) groupedData[year] = new Array(12).fill(0);
					groupedData[year][month]++;
				});

				// Prepare heatmap data
				const data = [];
				const yearKeys = Object.keys(groupedData).sort(); // Sort years
				yearKeys.forEach((year, yIndex) => {
					groupedData[year].forEach((count, mIndex) => {
						data.push([mIndex, yIndex, count]); // [month, year, value]
					});
				});

				setHeatmapData(data);
				setYears(yearKeys);
				notify.success("Employee data fetched successfully!");
			} catch (error) {
				notify.error("Error fetching employees. Please try again.");
			}
		};

		fetchEmployees();
	}, []);

	const chartOptions = {
		title: {
			text: "Employee Joining Heatmap",
			left: "center",
			textStyle: {
				color: "#374151", // grey-800
				fontSize: 20,
			},
		},
		tooltip: {
			position: "top",
		},
		grid: {
			height: "60%",
			top: "10%",
		},
		xAxis: {
			type: "category",
			data: months,
			splitArea: {
				show: true,
			},
			axisLabel: {
				color: "#374151", // grey-800
			},
		},
		yAxis: {
			type: "category",
			data: years,
			splitArea: {
				show: true,
			},
			axisLabel: {
				color: "#374151", // grey-800
			},
		},
		visualMap: {
			min: 0,
			max: Math.max(...heatmapData.map((item) => item[2]), 1),
			calculable: true,
			orient: "horizontal",
			left: "center",
			bottom: "5%",
			inRange: {
				color: ["#e5f9e0", "#34d399", "#059669", "#064e3b"], // Gradient: light green to dark green
			},
		},
		series: [
			{
				name: "Employees",
				type: "heatmap",
				data: heatmapData,
				label: {
					show: true,
					color: "#374151", // grey-800 for contrast
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowColor: "rgba(0, 0, 0, 0.5)",
					},
				},
			},
		],
	};

	return (
		<div
			className='bg-[#f9fafb] min-h-screen p-6 flex flex-col items-center'
			style={{ fontFamily: "Arial, sans-serif" }}>
				<h1 className='text-green-600 text-2xl font-bold text-center mb-4'>
					Employee Joining Heatmap
				</h1>
				<ReactECharts
					option={chartOptions}
					style={{ height: "500px", width: "100%" }}
				/>
		</div>
	);
};

export default EmployeeHeatmap;
