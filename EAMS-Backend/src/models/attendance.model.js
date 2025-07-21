import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date:  {
            type: Date,
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            default: null
        },
        status: {
            type: String,
            enum: ["late", "present", "absent"],
            default: "present",
        },
        workingHours: {
            type: Number,
            default: 0,
        },
        location: {
            lat: {
                type: Number
            },
            lng: {
                type: Number
            }
        },
    },
    {timestamps: true,},
)

export const Attendance = mongoose.model("Attendance", attendanceSchema);