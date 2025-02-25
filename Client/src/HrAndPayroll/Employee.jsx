import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialFormState = {
  employeeID: "",
  registration_number: "",
  full_name: "",
  father_name: "",
  cnic: "",
  address: "",
  contact_number: "",
  emergency_contact_number: "",
  blood_group: "",
  designation: "",
  education: [],
  date_of_birth: "",
  department: "",
  gender: "",
  marital_status: "",
  salary: "",
  company: "",
  joining_date: "",
  salary_status: "",
  dependant: "",
  bank_account: "",
};

const Employee = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [educationList, setEducationList] = useState([""]);
  const [employees, setEmployees] = useState([]);
  const [isEdit, setIsEditing] = useState(false);
  const [newDesignation, setNewDesignation] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [originalDesignation, setOriginalDesignation] = useState("");
  const [originalSalary, setOriginalSalary] = useState("");
  

  const apiUrl = import.meta.env.VITE_API_URL_EMP;
  const navigate = useNavigate();

  // Education handlers
  const handleEducationChange = (index, value) => {
    const updatedList = [...educationList];
    updatedList[index] = value;
    setEducationList(updatedList);
    setFormData((prev) => ({ ...prev, education: updatedList }));
  };

  const addEducationField = () => setEducationList([...educationList, ""]);
  const removeEducationField = (index) => {
    const updatedList = educationList.filter((_, i) => i !== index);
    setEducationList(updatedList);
    setFormData((prev) => ({ ...prev, education: updatedList }));
  };

  // Form validation
  const validateForm = () => {
    let errors = {};
    if (!formData.full_name) errors.full_name = "Full name is required";
    if (!formData.father_name) errors.father_name = "Father's name is required";
    if (!/^\d{13}$/.test(formData.cnic)) errors.cnic = "CNIC must be 13 digits";
    if (!formData.address) errors.address = "Address is required";
    if (!/^\d{11}$/.test(formData.contact_number)) errors.contact_number = "Contact number must be 11 digits";
    if (!/^\d{11}$/.test(formData.emergency_contact_number)) errors.emergency_contact_number = "Emergency contact must be 11 digits";
    if (!formData.blood_group) errors.blood_group = "Blood group is required";
    if (!formData.designation) errors.designation = "Designation is required";
    if (!formData.date_of_birth) errors.date_of_birth = "Date of birth is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.marital_status) errors.marital_status = "Marital status is required";
    if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(formData.salary)) errors.salary = "Enter a valid salary";
    if (!formData.company) errors.company = "Company is required";
    if (!formData.joining_date) errors.joining_date = "Joining date is required";
    if (!formData.salary_status) errors.salary_status = "Salary status is required";
    if (formData.salary_status === "Bank" && !formData.bank_account) errors.bank_account = "Bank account is required";
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await updateEmployee(formData.employeeID);
      } else {
        await axios.post(`${apiUrl}/register`, formData);
        await getAllEmployees();
      }
      resetForm();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  // Employee data operations
  const getAllEmployees = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/`);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const updateEmployee = async (employeeID) => {
    try {
      // Update employee details
      await axios.put(`${apiUrl}/update/${employeeID}`, {
        designation: newDesignation,
        salary: parseFloat(newSalary)
      });

      // Record promotion if changes occurred
      if (newDesignation !== originalDesignation || newSalary !== originalSalary) {
        await axios.post(`${apiUrl}/promote/${employeeID}`, {
          new_designation: newDesignation,
          new_salary: parseFloat(newSalary)
        });
      }
      await getAllEmployees();
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
    }
  };

  const handleEdit = (employee) => {

    setFormData({
      ...employee,
      employeeID: employee.employee_id, 
      education: employee.edducation || []
    });
    setNewDesignation(employee.designation);
    setNewSalary(employee.salary.toString());
    setOriginalDesignation(employee.designation);
    setOriginalSalary(employee.salary.toString());
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEducationList([""]);
    setIsEditing(false);
    setNewDesignation("");
    setNewSalary("");
  };

  useEffect(() => { getAllEmployees(); }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mx-auto">
      {isEdit ? (
          <div>
          <h1 className="text-3xl font-bold text-[#993F82] text-center mb-6">Update Employee</h1>
          <form onSubmit={(e) => { e.preventDefault(); updateEmployee(formData.employeeID); }} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium">New Designation</label>
              <input
                type="text"
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">New Salary</label>
              <input
                type="number"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2"
                required
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-[#993F82] text-white px-4 py-2 rounded-lg hover:bg-[#7A2E64]">
                Update
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-[#993F82] text-center mb-6">Employee Registration</h1>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleSubmit}>
            
           <div>
              <label className="block text-[#47464C] font-semibold">Employee ID</label>
              <input type="text" name="employeeID" value={formData.employeeID} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />               {errors.employeeID && <span className="text-red-500">{errors.employeeID}</span>}
            </div>
    
            {/* Registration */}
            <div>
              <label className="block text-[#47464C] font-semibold">Registration</label>
               <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />        
            </div>
    
            {/* Full Name */}
            <div>
              <label className="block text-[#47464C] font-semibold">Full Name</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
              {errors.full_name && <span className="text-red-500">{errors.full_name}</span>}
            </div>
    
            {/* Father's Name */}
            <div>
              <label className="block text-[#47464C] font-semibold">Father Name</label>
               <input type="text" name="father_name" value={formData.father_name} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
               {errors.father_name && <span className="text-red-500">{errors.father_name}</span>}
             </div>
    
             {/* CNIC */}
             <div>
               <label className="block text-[#47464C] font-semibold">CNIC</label>
               <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
               {errors.cnic && <span className="text-red-500"> {errors.cnic}</span>}
             </div>
    
             {/* Address */}
             <div>
               <label className="block text-[#47464C] font-semibold">Address</label>
               <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
              {errors.address && <span className="text-red-500"> {errors.address}</span>}
            </div>
    
            {/* Emergency Contact */}
            <div>
              <label className="block text-[#47464C] font-semibold">Emergency Contact Number</label>
              <input type="number" name="emergency_contact_number" value={formData.emergency_contact_number} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
              {errors.emergency_contact_number && <span className="text-red-500"> {errors.emergency_contact_number} </span>}
            </div>
    
             {/* Contact Number */}
             <div>
               <label className="block text-[#47464C] font-semibold">Contact Number</label>
               <input type="number" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
               {errors.contact_number && <span className="text-red-500">{errors.contact_number}</span>}
             </div>
    
             {/* Blood Group */}
             <div>
               <label className="block text-[#47464C] font-semibold">Blood Group</label>
              <select name="blood_group" value={formData.blood_group} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required>
                <option value="">Select</option>
                 {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((group) => (
                   <option key={group} value={group}>{group}</option>
                 ))}
            </select>
            </div>
    
            {/* Education */}
            <div className="col-span-2">
              <label className="block text-[#47464C] font-semibold">Education</label>
              <div className="space-y-2">
                {educationList.map((edu, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={edu}
                      onChange={(e) => handleEducationChange(index, e.target.value)}
                      placeholder="Enter education"
                      className="border rounded p-2 w-full"
                    />
                    {educationList.length > 1 && (
                      <button type="button" onClick={() => removeEducationField(index)} className="text-red-500">
                        ❌
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addEducationField} className="text-[#993F82] font-semibold">
                  + Add More
                </button>
              </div>
            </div>
          
    
            {/* Date of Birth */}
            <div>
              <label className="block text-[#47464C] font-semibold">Date of Birth</label>
              <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
            </div>
    
            {/* Department */}
            <div>
              <label className="block text-[#47464C] font-semibold">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
            </div>
    
            {/* Gender */}
            <div>
              <label className="block text-[#47464C] font-semibold">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
    
            {/* Marital Status */}
            <div>
              <label className="block text-[#47464C] font-semibold">Marital Status</label>
              <select name="marital_status" value={formData.marital_status} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required>
                <option value="">Select</option>
                <option>Single</option>
                <option>Married</option>
              </select>
            </div>
    
            {/* Salary */}
            <div>
              <label className="block text-[#47464C] font-semibold">Salary</label>
              <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
              {errors.salary && <span className="text-red-500"> {errors.salary} </span>}
            </div>
    
            {/* Company */}
            <div>
              <label className="block text-[#47464C] font-semibold">Company</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
            </div>
            <div>
              <label className="block text-[#47464C] font-semibold">Designation</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
            </div>
    
            {/* Joining Date */}
            <div>
              <label className="block text-[#47464C] font-semibold">Joining Date</label>
              <input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
            </div>
    
            {/* Salary Status */}
            <div>
              <label className="block text-[#47464C] font-semibold">Salary Status</label>
              <select
                name="salary_status"
                value={formData.salary_status}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2"
                required
              >
                <option value="">Select</option>
                <option value="Bank">Bank</option>
                <option value="Cash">Cash</option>
              </select>
              {errors.salary_status && <span className="text-red-500">{errors.salary_status}</span>}
            </div>
    
            {/* Bank Account Number */}
            {formData.salary_status === "Bank" && (
              <div>
                <label className="block text-[#47464C] font-semibold">Bank Account Number</label>
                <input
                  type="text"
                  name="bank_account"
                  value={formData.bank_account}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2"
                  required
                />
              </div>
            )}
    
            {/* Dependant */}
            <div>
              <label className="block text-[#47464C] font-semibold">Dependant</label>
              <input type="text" name="dependant" value={formData.dependant} onChange={handleChange} className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2" required />
            </div> 
    
            <div className="col-span-3 flex justify-center">
              <button type="submit" className="bg-[#993F82] text-white px-6 py-2 rounded-lg hover:bg-[#7a2c67]">
                Register
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-[#993F82]">Employee List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-[#993F82] text-white">
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Designation</th>
                <th className="py-2 px-4">Department</th>
                <th className="py-2 px-4">Salary</th>
                <th className="py-2 px-4">Company</th>
                <th className="py-2 px-4">Actions</th>
                
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employee_id} className="border-b border-gray-200">
                  <td className="py-2 px-4 text-[#47464C]">{employee.employee_id}</td>
                  <td className="py-2 px-4 text-[#47464C]">{employee.full_name}</td>
                  <td className="py-2 px-4 text-[#47464C]">{employee.designation}</td>
                  <td className="py-2 px-4 text-[#47464C]">{employee.department}</td>
                  <td className="py-2 px-4 text-[#47464C]">{employee.salary}</td>
                  <td className="py-2 px-4 text-[#47464C]">{employee.company}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/employees/${employee.employee_id}`)}
                      className="bg-[#993F82] text-white px-3 py-1 rounded hover:bg-[#7A2E64]"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(employee)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={()=> navigate(`/records/${employee.employee_id}`)}
                      className="bg-slate-400 text-white px-3 py-1 rounded"
                    >
                      Records
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employee;
