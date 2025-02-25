const db = require("../../config/db");
const { param } = require("../../routes/employeeRoute");



// register A new Employee 
exports.registerEmployee = (req, res) => {
  const {
    employee_id,
    registration_number,
    full_name,
    father_name,
    cnic,
    address,
    contact_number,
    emergency_contact_number,
    blood_group,
    designation,
    date_of_birth,
    education,
    department,
    gender,
    marital_status,
    salary,
    company,
    joining_date,
    salary_status,
    dependants,
  } = req.body;

  // Debugging Log: Check Incoming Data
  console.log("📥 Received Data:", req.body);

  // Replace undefined values with null
  const values = [
    employee_id ?? null,
    registration_number ?? null,
    full_name ?? null,
    father_name ?? null,
    cnic ?? null,
    address ?? null,
    contact_number ?? null,
    emergency_contact_number ?? null,
    blood_group ?? null,
    designation ?? null,
    JSON.stringify(education) ?? null, // Ensure education array is stored as JSON
    date_of_birth ?? null,
    department ?? null,
    gender ?? null,
    marital_status ?? null,
    salary ?? null,
    company ?? null,
    joining_date ?? null,
    salary_status ?? null,
    dependants ? JSON.stringify(dependants) : null, // Ensure dependants are stored as JSON
  ];

  // Debugging Log: Check Final Values Before Insert
  console.log("📤 Final Values for DB:", values);

  const sql = `INSERT INTO employees 
                (employee_id, registration_number, full_name, father_name, cnic, address, contact_number, emergency_contact_number, blood_group, 
                 designation, education, date_of_birth, department, gender, marital_status, salary, company, joining_date, salary_status, dependants) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.promise()
    .execute(sql, values)
    .then(([result]) => {
      res.status(201).json({ message: "Employee registered successfully", result });
    })
    .catch((error) => {
      console.error("❌ Error registering employee:", error);
      res.status(500).json({ message: "Error registering employee", error });
    });
};





// get all emplooyes 
exports.getemployee = (req , res) =>{
  const sql = `SELECT * FROM employees`;
  db.promise()
  .query(sql)
  .then(([rows]) =>{
    res.json(rows);
  }
)  }

exports.getEmployeesName = (req, res) => {
  const sql = "SELECT employee_id, full_name FROM employees";

  console.log("🔍 Executing Query:", sql); // Log the query being executed

  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.log("📊 Query Result:", rows); // Log the fetched data
      
      if (rows.length === 0) {
        console.log("⚠️ No employees found.");
        return res.status(404).json({ message: "No employees found" });
      }

      res.json(rows);
    })
    .catch(error => {
      console.error("❌ Error fetching employees:", error);
      res.status(500).json({ message: "Internal server error", error });
    });
};





// GET EMPLOYEE BY ID 
exports.getemployeeByid = (req, res) => {
  const id = req.params.id;
  console.log("Employee ID:", id);
  const sql = `SELECT * FROM employees WHERE employee_id = ?`;
  db.promise()
    .query(sql, id)
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json(rows[0]); // Send the first (and only) employee object
    })
    .catch(error => {
      console.error('Error fetching employee:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
};

exports.UpdateEmployee = (req, res) => {
  const { employeeID } = req.params;
  const updatedData = req.body;

  const sql = `UPDATE employees SET ? WHERE employee_id = ?`;
  
  db.query(sql, [updatedData, employeeID], (err, result) => {
    if (err) return res.status(500).send('Database error');
    res.status(200).send('Employee updated successfully');
  });
};

exports.RecordPromotion = (req, res) => {
  const { employeeID } = req.params;
  const { new_designation, new_salary } = req.body;

  // Get current details
  db.query(
    `SELECT designation, salary FROM employees WHERE employee_id = ?`,
    [employeeID],
    (err, result) => {
      if (err) return res.status(500).send('Database error');
      
      const { designation, salary } = result[0];
      
      // Insert promotion history
      db.query(
        `INSERT INTO employee_promotion_history 
        (employee_id, old_designation, new_designation, old_salary, new_salary, promotion_date)
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [employeeID, designation, new_designation, salary, new_salary],
        (err) => {
          if (err) return res.status(500).send('History recording failed');
          res.status(200).send('Promotion recorded');
        }
      );
    }
  );
};

// get employee records 
exports.getEmployeeRecords = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM employee_promotion_history WHERE employee_id = ?`;
  
  db.query(sql, [id], (err, result) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json(result);
  });
};

//  Assign Department & Role
exports.assignDepartment = (req, res) => {
  const { employee_id, department_id } = req.body;

  const sql = `UPDATE employees SET department_id = ? WHERE employee_id = ?`;

  db.promise()
    .execute(sql, [department_id, employee_id])
    .then(([result]) => {
      res.status(200).json({ message: "Department assigned successfully", result });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error assigning department", error });
    });
};

exports.deactivateEmployee = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM employees WHERE id = ?`;

  db.promise()
    .execute(sql, [id])
    .then(([result]) => {
      res.status(200).json({ message: "Employee deactivated successfully", result });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error deactivating employee", error });
    });
};



