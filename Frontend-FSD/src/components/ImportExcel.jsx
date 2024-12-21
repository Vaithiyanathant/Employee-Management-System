/** @format */

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import axios from "axios";

const ImportExcel = () => {
	const [fileData, setFileData] = useState(null);
	const [fileName, setFileName] = useState("");

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
			setFileData(sheetData);
			toast.success("File imported successfully!");
		};

		reader.onerror = () => {
			toast.error("Error reading file.");
		};

		reader.readAsArrayBuffer(file);
	};

	const handlePushToDatabase = async () => {
		if (!fileData || fileData.length === 0) {
			toast.error("No data to push. Please upload a valid file.");
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:3000/upload",
				fileData
			);
			toast.success(response.data);
		} catch (error) {
			toast.error(
				error.response?.data ||
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

					<div className='mt-6 text-center'>
						<p className='text-gray-700'>File Format:</p>
						<table className='w-full mt-4 border-collapse border border-gray-300 text-sm'>
							<thead className='bg-gray-100'>
								<tr>
									<th className='border border-gray-300 px-4 py-2'>Column</th>
									<th className='border border-gray-300 px-4 py-2'>
										Description
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className='border border-gray-300 px-4 py-2'>Name</td>
									<td className='border border-gray-300 px-4 py-2'>
										Full name of the employee
									</td>
								</tr>
								<tr>
									<td className='border border-gray-300 px-4 py-2'>
										Employee ID
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										Unique identifier for the employee
									</td>
								</tr>
								<tr>
									<td className='border border-gray-300 px-4 py-2'>Email</td>
									<td className='border border-gray-300 px-4 py-2'>
										Email address of the employee
									</td>
								</tr>
								<tr>
									<td className='border border-gray-300 px-4 py-2'>Phone</td>
									<td className='border border-gray-300 px-4 py-2'>
										10-digit phone number
									</td>
								</tr>
								<tr>
									<td className='border border-gray-300 px-4 py-2'>
										Department
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										Department name
									</td>
								</tr>
								<tr>
									<td className='border border-gray-300 px-4 py-2'>
										Date of Joining
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										Date in YYYY-MM-DD format
									</td>
								</tr>
								<tr>
									<td className='border border-gray-300 px-4 py-2'>Role</td>
									<td className='border border-gray-300 px-4 py-2'>Job role</td>
								</tr>
							</tbody>
						</table>
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
