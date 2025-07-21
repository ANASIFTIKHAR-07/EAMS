import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createEmployee = asyncHandler(async (req, res)=> {
    const {name, email, designation, phone, status, password} = req.body

    if (!name || !email || !password) {
        throw new ApiError(401, "Name, Password and Email are required!!")
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new ApiError(401, "Employee Already exists with this Email!!!")
    }


    const employee = await User.create({
        name,
        email,  
        designation,
        phone,
        status,
        role: "employee",
        password,
    })


    return res
    .status(200)
    .json(
        new ApiResponse(200, employee, "Employee Created Successfully")
    );  
});


const getAllEmployee = asyncHandler(async (req, res) => {
    const employees = await User.find({role: "employee"}).select("-password -refreshToken");

    return res
    .status(200)
    .json(
        new ApiResponse(200, employees, "Employees List Fetched Successfully.")
    );
});


const getEmployeeById = asyncHandler(async (req, res) => {
    const employee = await User.findOne({_id: req.params.id , role: "employee"}).select("-password -refreshToken");

    if (!employee) {
        throw new ApiError(404, "Employee does not exist!");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, employee, "Employee Fetched.")
    )
});

const updateEmployee = asyncHandler(async (req, res) => {
    const updates = req.body

    const employee = await User.findByIdAndUpdate(
        {_id: req.params.id, role: "employee"},
        updates,
        {new: true}
    ).select("-password -refreshToken")

    if (!employee) {
        throw new ApiError(404, "Employee not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, employee, "Employee Updated Successfully.")
    )
});

const deleteEmployee = asyncHandler(async (req, res) => {
    const employee = await User.findByIdAndDelete({
        _id: req.params.id,
        role: "employee",
    })

    if (!employee) {
        throw new ApiError(404, "Employee Not Found!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "User Deleted Successfully!")
    )
});

const updateUserStatus = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "suspended"].includes(status)) {
        throw new ApiError(400, "Invalid status.")
    }
    const updatedUser = await User.findByIdAndUpdate(id, { status }, { new: true })

    return res
    .status(200)
    .json(
        new ApiResponse(200,  updatedUser, "Status Updated")
    )
})

export{ 
    createEmployee,
    getAllEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    updateUserStatus,
}


