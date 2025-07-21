import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Attendance } from "../models/attendance.model.js";
import { Parser } from "json2csv";

const getAttendanceReport = asyncHandler(async (req, res) => {
  const { user, from, to, status, export: exportType } = req.query;

  const filter = {};

  if (user) filter.user = user;
  if (status) filter.status = status;
  if (from && to) {
    filter.checkIn = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  const records = await Attendance.find(filter).populate("user", "name email");

  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const late = records.filter((r) => r.status === "late").length;
  const absent = records.filter((r) => r.status === "absent").length;

  const totalWorkingHours = records.reduce(
    (sum, rec) => sum + (rec.workingHours || 0),
    0
  );
  const avgHours = total > 0 ? (totalWorkingHours / total).toFixed(2) : 0;

  if (exportType === "csv") {
    const flatData = records.map((r) => ({
      Name: r.user?.name,
      Email: r.user?.email,
      Status: r.status,
      CheckIn: r.checkIn?.toISOString(),
      CheckOut: r.checkOut?.toISOString() || "",
      WorkingHours: r.workingHours || 0,
    }));

    const json2csv = new Parser();
    const csv = json2csv.parse(flatData);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance-report.csv");
    return res.send(csv);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRecords: total,
        present,
        late,
        absent,
        averageWorkingHours: avgHours,
        records,
      },
      "Attendance Report Fetched Successfully."
    )
  );
});

export { getAttendanceReport };
