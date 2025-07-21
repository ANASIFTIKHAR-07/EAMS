import { Router } from "express";
import { isAdmin } from "../middlewares/role.middleware.js";
import { getAttendanceReport } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getWorkingHours } from "../controllers/attendance.controller.js";

const router = Router()
//  For only admin.

router.get("/attendance", verifyJWT, isAdmin, getAttendanceReport)
router.get("/working-hours/:employeeId", verifyJWT, isAdmin, getWorkingHours)


export default router;