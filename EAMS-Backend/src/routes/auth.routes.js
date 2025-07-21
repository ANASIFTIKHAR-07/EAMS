import { Router } from "express";
import {
    login,
    logout, 
    accessRefreshToken,
    getCurrentUser
} from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/login").post(login)
router.route("/logout").post(verifyJWT, logout)
router.route("/refresh-tokens").post(verifyJWT, accessRefreshToken)
router.route("/me").get(verifyJWT, getCurrentUser)

export default router; 