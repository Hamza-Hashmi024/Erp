const express = require("express");
const router = express.Router();
const employeeController = require("../Controllers/HrPayrolls/employeeController");

// Routes
router.post("/register", employeeController.registerEmployee);
router.get("/", employeeController.getemployee );
router.get("/:id", employeeController.getemployeeByid );
router.get("/name", employeeController.getEmployeesName);
router.get('/get/records/:id', employeeController.getEmployeeRecords);
router.put('/update/:employeeID', employeeController.UpdateEmployee);
router.post('/promote/:employeeID', employeeController.RecordPromotion);




router.put("/assign-department", employeeController.assignDepartment);
router.delete("/deactivate/:id", employeeController.deactivateEmployee);

module.exports = router;
