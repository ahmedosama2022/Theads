require('dotenv').config();
import express from "express"

import cors from "cors";
import cookieParser from "cookie-parser"

import authRouter  from "./routes/user.route";
import connectDB from "./utils/db";



const app = express()


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN
  }));





app.use("/api/v1", authRouter)




 


app.listen(process.env.PORT, () => {
    console.log(`server is conntect port ${process.env.PORT}`)
    connectDB()
})


