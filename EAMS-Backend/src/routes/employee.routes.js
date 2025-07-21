import { Router } from "express"
import {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getAllEmployee,
    getEmployeeById,
    updateUserStatus,
} from "../controllers/employee.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"
import { isAdmin } from "../middlewares/role.middleware.js"

const router = Router()


//  Admin-only employee management routes
router.post("/", verifyJWT,isAdmin,createEmployee);
router.get("/",verifyJWT, isAdmin, getAllEmployee);
router.get("/:id", verifyJWT, isAdmin, getEmployeeById);
router.put("/:id",verifyJWT, isAdmin, updateEmployee);
router.delete("/:id", verifyJWT, isAdmin, deleteEmployee)
router.patch("/status/:id", verifyJWT, isAdmin, updateUserStatus)



export default router;