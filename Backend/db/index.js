import mongoose from "mongoose";
import dns from "dns";
import { DB_NAME } from "../constants.js";

// Fix Windows Node.js SRV DNS lookup issues for Atlas
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB Atlas Connected Successfully...");
    } catch (error) {
        console.error("Error connecting to MongoDB\n\n", error);
        process.exit(1);
    }
};

export default connectDB;