import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler(async(req, res, next)=> {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized Request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("Decoded Token:", decodedToken);
        
        const user =  await User.findById(decodedToken?._id).select("name email role")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = {
            _id: user._id.toString(),
            name: user.name,
            role: user.role,
            email: user.email,
        };

        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token!!")
    }
}) 