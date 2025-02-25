const express = require("express");
const router = express.Router();
const AttendanceControllers = require("../Controllers/HrPayrolls/AttendanceControllers");


router.post('/mark', AttendanceControllers.markAttendance);
router.get('/:employee_id', AttendanceControllers.GetAttendance);
router.put('/:attendance_id', AttendanceControllers.updateAttendance);
router.delete('/:attendance_id', AttendanceControllers.deleteAttandance);

module.exports = router;


