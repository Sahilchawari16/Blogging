import express from 'express';
import dotenv from 'dotenv';
import connectDb from './utils/db.js';
import userRoutes from './routes/user.js';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
dotenv.config();
//Cloudinay Connection Configuration
cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api_Key,
    api_secret: process.env.Cloud_Api_Sec
});
const app = express();
app.use(cors());
app.use(express.json());
//Connection with Mongodb
connectDb();
//Routes for the user services route
app.use("/api/v1", userRoutes);
//Port Setting 
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
