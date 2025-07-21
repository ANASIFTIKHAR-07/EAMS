import connectDB from "./db/index.js";
import { app } from "./app.js";
import "dotenv/config"


connectDB()
.then(()=> {
    // Handle unexpected server erros.
    app.on("error" , (error)=> {
        console.log("Server is not running at the PORT, Please check you PORT.", error);
        throw error
    })
    //  Start server
    app.listen(process.env.PORT || 4000, ()=> {
        console.log(`🚀 Server is running at PORT : ${process.env.PORT}`);
    })
})
.catch((error)=> {
    console.log("❌ MongoDB connnetion Failed", error);
})

