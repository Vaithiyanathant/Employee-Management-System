/** @format */

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import axios from "axios";

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
				// Ensure "Date of Joining" is in YYYY-MM-DD format
				let formattedDate;
				if (row["Date of Joining"] instanceof Date) {
					formattedDate = row["Date of Joining"].toISOString().split("T")[0];
				} else if (typeof row["Date of Joining"] === "number") {
					// Convert Excel numeric date to proper date
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
			toast.success(response.data.message);
		} catch (error) {
			toast.error(
				error.response?.data?.error ||
					"Error occurred while pushing data to the database."
			);
		}
	};

	return (
		<div className='container mx-auto p-6'>
			<div className='bg-white shadow-md rounded-lg p-6'>
				<h2 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>
					Import Excel File
				</h2>
				<div className='space-y-4'>
					<div className='flex flex-col items-center'>
						<label
							htmlFor='file-upload'
							className='block text-lg font-medium text-gray-700 mb-2'>
							Select Excel File
						</label>
						<input
							id='file-upload'
							type='file'
							accept='.xlsx, .xls'
							onChange={handleFileUpload}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
						/>
						{fileName && (
							<p className='text-sm text-gray-600 mt-2'>
								Selected File: {fileName}
							</p>
						)}
					</div>

					{fileData && (
						<div className='mt-6'>
							<h3 className='text-lg font-semibold text-gray-800 mb-2'>
								Preview of Imported Data
							</h3>
							<div className='overflow-x-auto'>
								<table className='w-full border-collapse border border-gray-300 text-sm'>
									<thead className='bg-gray-100'>
										<tr>
											{Object.keys(fileData[0]).map((key) => (
												<th
													key={key}
													className='border border-gray-300 px-4 py-2'>
													{key}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{fileData.map((row, index) => (
											<tr
												key={index}
												className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
												{Object.values(row).map((value, i) => (
													<td
														key={i}
														className='border border-gray-300 px-4 py-2'>
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
		</div>
	);
};

export default ImportExcel;
