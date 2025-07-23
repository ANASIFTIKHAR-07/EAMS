import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { User } from "../models/user.model.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        // console.log("ENVIRONMENT:", process.env.NODE_ENV);
        

        if (process.env.NODE_ENV !== "production") {
            const existingAdmin = await User.findOne({email: "admin@emas.com"});
            if (!existingAdmin) {
                await User.create({
                    name: "Muhammad Anas",
                    email: "admin@emas.com",
                    password: "Admin@123",
                    phone: "03227727537",
                    designation: "System Admin",
                    status: "active",
                    role: "admin",
                });
                console.log("✅ Admin user seeded successfully.");
            } else{
                console.log("ℹ️ Admin already exists, skipping seed.");
            }
        }
        
    } catch (error) {
        console.error("Mongo Db connection Failed!!", error)    
        process.exit(1);
    }
}

export default connectDB;