import {
    checkInAttendance,
    checkOutAttendance,
    getMyAttendance
} from "../controllers/attendance.controller.js"
import { isEmployee } from "../middlewares/role.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { Router } from "express"


const router = Router()

router.get("/", verifyJWT, isEmployee, getMyAttendance)
router.post("/check-in", verifyJWT, isEmployee, checkInAttendance)
router.post("/check-out", verifyJWT, isEmployee, checkOutAttendance)

export default router;