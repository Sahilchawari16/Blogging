import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDb = async() => {
    try {
        mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "blog",
        });
        console.log("Connected to Mongodb");
    } catch (error) {
        console.log(error);
    }
};

export default connectDb;