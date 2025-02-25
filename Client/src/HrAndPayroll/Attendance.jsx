import { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("Absent");
  const [workHours, setWorkHours] = useState("0.00");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const API_URL = import.meta.env.VITE_API_URL_EMP;
  const AttendanceApi = import.meta.env.VITE_API_URL_ATT;

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  // Auto-calculate work hours
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(`1970-01-01T${checkIn}`);
      const end = new Date(`1970-01-01T${checkOut}`);
      const diff = (end - start) / (1000 * 60 * 60);
      setWorkHours(diff > 0 ? diff.toFixed(2) : "0.00");
    }
  }, [checkIn, checkOut]);

  // Fetch attendance records when employee changes
  useEffect(() => {
    if (selectedEmployeeId) {
      fetchAttendance();
    }
  }, [selectedEmployeeId]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${AttendanceApi}/${selectedEmployeeId}`);
      setAttendanceRecords(response.data); // ✅ Save fetched data
    } catch (error) {
      console.error("Error Fetching Attendance:", error);
      setAttendanceRecords([]); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployeeId || !date) {
      alert("Employee and Date are required!");
      return;
    }

    const attendanceData = {
      employee_id: selectedEmployeeId,
      date,
      check_in: checkIn || null,
      check_out: checkOut || null,
      status,
      work_hours: workHours,
    };

    try {
      console.log("Attendance Data:", attendanceData);
      await axios.post(`${AttendanceApi}/mark`, attendanceData);
      alert("Attendance marked successfully!");
      fetchAttendance(); 
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance.");
    }
  };


  //  Filter by date or employee id to track records of Attendance  
  const handleFilter = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      alert("Please select an employee to filter records.");
      return;
    }

    try {
      let url = `${AttendanceApi}/${selectedEmployeeId}?`;
      if (filterStartDate) url += `startDate=${filterStartDate}&`;
      if (filterEndDate) url += `endDate=${filterEndDate}`;

      const response = await axios.get(url);
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error("Error Fetching Attendance:", error);
      setAttendanceRecords([]);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-[#993F82] text-center mb-6">
          Mark Attendance
        </h1>

        <form className="grid grid-cols-3 gap-4" onSubmit={handleSubmit}>
          {/* Select Employee */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">Select Employee</label>
            <select
              className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              <option value="">Select an Employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} (ID: {emp.employee_id})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Check-in */}
          <div>
            <label className="block font-medium mb-1">Check In</label>
            <input
              type="time"
              className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block font-medium mb-1">Check Out</label>
            <input
              type="time"
              className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half-Day">Half-Day</option>
            </select>
          </div>

          {/* Work Hours */}
          <div>
            <label className="block font-medium mb-1">Work Hours</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-[#993F82] focus:ring-2"
              value={workHours}
              readOnly
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-3 flex justify-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#993F82] text-white font-semibold rounded-md hover:bg-[#7a3267] transition"
            >
              Mark Attendance
            </button>
          </div>
        </form>
      </div>

      {/* Attendance Record Table */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Attendance Record</h2>

       
        <form className="flex justify-between mb-4" onSubmit={handleFilter}>
          <div className="flex items-center">
            <label className="block font-medium mr-2">From</label>
            <input
              type="date"
              className="p-2 border rounded focus:ring-[#993F82] focus:ring-2"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label className="block font-medium mr-2">To</label>
            <input
              type="date"
              className="p-2 border rounded focus:ring-[#993F82] focus:ring-2"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#993F82] text-white font-semibold rounded-md hover:bg-[#7a3267] transition"
          >
            Filter
          </button>
        </form>
        
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Attendance ID</th>
              <th className="border p-2">Employee ID</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Check In</th>
              <th className="border p-2">Check Out</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Work Hours</th>
              <th className="border p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <tr key={record.attendance_id}>
                  <td className="border p-2">{record.attendance_id}</td>
                  <td className="border p-2">{record.employee_id}</td>
                  <td className="border p-2">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="border p-2">{record.check_in ? new Date(`1970-01-01T${record.check_in}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}</td>
                  <td className="border p-2">{record.check_out ? new Date(`1970-01-01T${record.check_out}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}</td>
                  <td className="border p-2">{record.status}</td>
                  <td className="border p-2">{record.work_hours}</td>
                  <td className="border p-2">{record.created_at ? new Date(record.created_at).toLocaleString() : "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Attendance;





