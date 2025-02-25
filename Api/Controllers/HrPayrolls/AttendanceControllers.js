const db = require('../../config/db');
const { trace } = require('../../routes/AuthRoute');

exports.markAttendance = (req, res) => {
  const { employee_id, date, check_in, check_out, status, work_hours } = req.body;

  db.promise()
    .query(
      `INSERT INTO attendance (employee_id, date, check_in, check_out, status, work_hours) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employee_id, date, check_in, check_out, status, work_hours]
    )
    .then(([results]) => {
      res.status(201).json({
        message: "Attendance Marked Successfully",
        attendance_id: results.insertId
      });
    })
    .catch((error) => {
      console.error("Error inserting attendance:", error);
      res.status(500).json({ message: "Failed to mark attendance", error: error.message });
    });
};

// get Attendance From an Employee 
exports.GetAttendance = (req, res) => {
  const { employee_id } = req.params;
  const { startDate, endDate, month, year } = req.query;

  let query = `SELECT * FROM attendance WHERE employee_id = ?`;
  let queryParams = [employee_id];

  // Filter by Date Range
  if (startDate && endDate) {
    query += ` AND date BETWEEN ? AND ?`;
    queryParams.push(startDate, endDate);
  }

  // Filter by Month & Year
  if (month && year) {
    query += ` AND MONTH(date) = ? AND YEAR(date) = ?`;
    queryParams.push(month, year);
  }

  // Execute Query
  db.promise().query(query, queryParams)
    .then(([results]) => {
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "No attendance records found" });
      }
    })
    .catch(error => {
      console.error("Database Error:", error);
      res.status(500).json({ message: "Database query failed", error });
    });
};


// Update Attendance Record
exports.updateAttendance = (req , res) =>{
  const { check_in, check_out, status, work_hours } = req.body;
  db.execute(
    `UPDATE attendance SET check_in = ?, check_out = ?, status = ?, work_hours = ?
     WHERE attendance_id = ?`,
    [check_in, check_out, status, work_hours, req.params.attendance_id]
  );
  res.status(200).send("Attendance Update Sucessfully ");
}

// Delete Attendance Record 
exports.deleteAttandance = (req , res) =>{
  const { attendance_id} = req.params;
  db.querry(`DELETE FROM attendance WHERE attendance_id = ?` ,  [attendance_id])
  .then(results =>{
    res.status(200).json({message : "Attendance Delete Sucessfully"})

  })
}

