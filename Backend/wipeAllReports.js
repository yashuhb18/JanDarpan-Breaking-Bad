import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Report from "./models/report.model.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const wipeAllReports = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(`${process.env.MONGODB_URL}/scheme-seva`);
        const res = await Report.deleteMany({});
        console.log(`🗑️ SUCCESSFULLY REMOVED ALL ${res.deletedCount} COMPLAINTS FROM DATABASE!`);
        process.exit(0);
    } catch (err) {
        console.error("Error wiping reports:", err);
        process.exit(1);
    }
};

wipeAllReports();
