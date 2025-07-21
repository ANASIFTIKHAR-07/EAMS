import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
//  Routes import: 
import authRouter from "./routes/auth.routes.js"
import employeeRouter from "./routes/employee.routes.js"
import attendanceRouter from "./routes/attendance.routes.js"
import reportRouter from "./routes/report.routes.js"

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))



app.use(cookieParser())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb", extended: true}))


//  Routes registration: 

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/employees", employeeRouter)
app.use("/api/v1/attendance", attendanceRouter)
app.use("/api/v1/reports", reportRouter)



// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
  
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  });

export { app }