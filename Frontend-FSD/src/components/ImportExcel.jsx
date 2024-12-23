/** @format */

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const ImportExcel = () => {
	const [fileData, setFileData] = useState(null);
	const [fileName, setFileName] = useState("");

	// Step 1: Convert Excel to JSON
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) {
			toast.error("Please select a file.");
			return;
		}

		setFileName(file.name);
		const reader = new FileReader();
		reader.onload = (event) => {
			const data = new Uint8Array(event.target.result);
			const workbook = XLSX.read(data, { type: "array" });
			const sheetName = workbook.SheetNames[0];
			const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

			// Step 2: Validate and Format the Data
			const formattedData = sheetData.map((row) => {
				let formattedDate;
				if (row["Date of Joining"] instanceof Date) {
					formattedDate = row["Date of Joining"].toISOString().split("T")[0];
				} else if (typeof row["Date of Joining"] === "number") {
					formattedDate = XLSX.SSF.parse_date_code(row["Date of Joining"]);
					formattedDate = new Date(
						formattedDate.y,
						formattedDate.m - 1,
						formattedDate.d
					)
						.toISOString()
						.split("T")[0];
				} else {
					formattedDate = new Date(row["Date of Joining"])
						.toISOString()
						.split("T")[0];
				}

				return {
					...row,
					"Date of Joining": formattedDate,
				};
			});

			const isValid = formattedData.every(
				(row) =>
					row.Name &&
					row.EmployeeID &&
					row.Email &&
					/^\d{10}$/.test(row.Phone) &&
					row.Department &&
					row["Date of Joining"] &&
					row.Role
			);

			if (!isValid) {
				toast.error(
					"Invalid data in Excel file. Check for missing or incorrect fields."
				);
				setFileData(null);
			} else {
				setFileData(formattedData);
				toast.success("File imported and formatted successfully!");
			}
		};

		reader.onerror = () => {
			toast.error("Error reading file.");
		};

		reader.readAsArrayBuffer(file);
	};

	// Step 3: Send JSON data to the server
	const handlePushToDatabase = async () => {
		if (!fileData || fileData.length === 0) {
			toast.error("No data to push. Please upload a valid file.");
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:5000/api/employees/upload",
				{
					data: fileData,
				}
			);
			toast.success(response.data.message || "Data pushed successfully!");
		} catch (error) {
			toast.error(
				error.response?.data?.error ||
					"Error occurred while pushing data to the database."
			);
		}
	};

	return (
		<div className='container mx-auto p-6 bg-[#f9fafb] rounded-lg shadow-md'>
			<h2 className='text-2xl font-semibold text-blue-500 mb-6 text-center'>
				Import Excel File
			</h2>
			<div className='space-y-4'>
				<div className='flex flex-col items-center'>
					<button className='btn-upload-file'>
						<svg
							fill='#fff'
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 50 50'>
							<path
								d='M28.8125 .03125L.8125 5.34375C.339844 
    5.433594 0 5.863281 0 6.34375L0 43.65625C0 
    44.136719 .339844 44.566406 .8125 44.65625L28.8125 
    49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 
    50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 
    30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 
    .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 
    6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 
    29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 
    43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 
    13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 
    21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 
    22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 
    15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 
    28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 
    27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 
    14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 
    20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z'></path>
						</svg>
						Upload File
						<input
							className='file'
							name='text'
							type='file'
							onChange={handleFileUpload}
						/>
					</button>

					{fileName && (
						<p className='text-sm text-gray-600 mt-2'>
							Selected File: {fileName}
						</p>
					)}
				</div>

				{fileData && (
					<div className='mt-6'>
						<h3 className='text-lg font-semibold text-blue-500 mb-2'>
							Preview of Imported Data
						</h3>
						<div className='overflow-x-auto'>
							<table className='w-full border-collapse border border-gray-300 text-sm'>
								<thead className='bg-blue-100'>
									<tr>
										{Object.keys(fileData[0]).map((key) => (
											<th
												key={key}
												className='border border-gray-300 px-4 py-2 text-blue-500'>
												{key}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{fileData.map((row, index) => (
										<tr
											key={index}
											className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
											{Object.values(row).map((value, i) => (
												<td
													key={i}
													className='border border-gray-300 px-4 py-2 text-gray-600'>
													{value}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<button
							onClick={handlePushToDatabase}
							className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
							Push to Database
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ImportExcel;
