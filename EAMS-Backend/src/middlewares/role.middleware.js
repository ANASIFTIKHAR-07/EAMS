import { ApiError } from "../utils/ApiError.js";


export const isAdmin = (req, res, next) => {
    
    console.log("req.user: ", req.user);
    
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Only Admin can access")
    }
    next()
}

export const isEmployee = (req, res, next) => {
    if (req.user?.role !== "employee") {
        throw new ApiError(403, "Only Employee can access")
    }
    next()
}