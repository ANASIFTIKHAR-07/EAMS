import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Attendance } from "../models/attendance.model.js";
import { getDsitanceFromLatLng } from "../utils/getDistanceFromLatLng.js";
import dayjs from "dayjs"



const getMyAttendance = asyncHandler(async(req, res) => {
    console.log("User inside getMyAttendance: ", req.user);
    
    const userId = req.user._id;
    console.log(userId)

    console.log("Type of userId:", typeof(userId));
    
    console.log("🔍 userId in getMyAttendance:", userId);

    const records = await Attendance.find({user: userId})
    .populate("user", "name email")
    .sort({checkIn: -1})
    .lean();
    console.log('Records: ',records)
    return res
    .status(200)
    .json(
        new ApiResponse(200, {records}, "Attendance records fetched successfully ")
    );
})

const checkInAttendance = asyncHandler(async (req, res)=> {
    const userId = req.user._id;
    const { lat, lng } = req.body


    if (!lat || !lng) {
        throw new ApiError(400, "Location (lat & lng) is required.")
    }

    const OFFICE_LAT = parseFloat(process.env.OFFICE_LAT)
    const OFFICE_LNG = parseFloat(process.env.OFFICE_LNG)
    const MAX_DISTANCE = parseFloat(process.env.CHECKIN_RADIUS)

    const distance = getDsitanceFromLatLng(OFFICE_LAT, OFFICE_LNG, lat, lng);

    console.log("📍 Received coords:", lat, lng);
    console.log("📍 Office coords:", OFFICE_LAT, OFFICE_LNG);
    console.log("📍 Calculated distance (meters):", distance);

    if (distance > MAX_DISTANCE) {
        throw new ApiError(403, "You're outside the allowed area of check-in area.")
    }

    const startOfDay = dayjs().startOf("day").toDate()
    const endOfDay = dayjs().endOf("day").toDate()


    const alreadyCheckedIn = await Attendance.findOne(
        {
            user: userId,
            checkIn: { $gte: startOfDay, $lte: endOfDay}
        }
    )

    if(alreadyCheckedIn) {
        throw new ApiError(400, "Already Checked In.")
    }

    const now = new Date()
    const status = now.getHours() >= 9 ? "late" : "present"


    const todayDate = dayjs().startOf("day").toDate();

    const attendance = await Attendance.create({
        user: userId,
        checkIn: now, 
        status,
        date: todayDate,
        location: {
            lat,    
            lng
        }
    });

    return res
    .status(201)
    .json(
        new ApiResponse(201, attendance, "Check-In Successfull.")
    )
});


const checkOutAttendance = asyncHandler(async (req, res)=> {
    console.log("👉 req.user:", req.user);

    const userId = req.user._id

    const startOfDay = dayjs().startOf("day").toDate()
    const endOfDay = dayjs().endOf("day").toDate()


    const attendance = await Attendance.findOne(
        {
            user: userId,
            checkIn: { $gte: startOfDay, $lte: endOfDay }
        }
    )

    if (!attendance) {
        throw new ApiError(404, "No check-in record found for today.")
    }

    if (attendance.checkOut) {
        throw new ApiError(400, "You have already checked out today.")
    }

    if (!attendance.checkIn) {
        throw new ApiError( 500, " CheckIn time is missing in the record!!")
    }

    const now = new Date()
    const workingHours = (now.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60);

    if (!attendance.date) {
        attendance.date = dayjs().startOf("day").toDate();
    }


    attendance.checkOut = now
    attendance.workingHours = Number(workingHours.toFixed(2));
    await attendance.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, attendance, "Check-out Successful.")
    )
});


const getWorkingHours = asyncHandler(async(req, res) => {
    const { employeeId } = req.params 
    const records = await Attendance.find({user: employeeId, workingHours: {
        $exists: true,
    }})

    if (!records.length) {
        return res.status(200).json(new ApiResponse(200, { averageHours:0 }, "No records Found"))
    }

    const total = records.reduce((acc, rec) => acc + rec.workingHours, 0)
    const avg = (total / records.length).toFixed(2)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {averageHours: avg}, "Average Working Hours Fetched!!")
    )
})

export {
    checkInAttendance,
    checkOutAttendance,
    getMyAttendance,
    getWorkingHours,
}
