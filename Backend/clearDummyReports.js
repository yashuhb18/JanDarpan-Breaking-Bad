import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Report from "./models/report.model.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const clearDummyReports = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(`${process.env.MONGODB_URL}/scheme-seva`);
        
        // Delete all dummy seed reports
        const deleted = await Report.deleteMany({
            $or: [
                { title: { $regex: /Muddy Trench/i } },
                { title: { $regex: /Substandard Asphalt/i } },
                { title: { $regex: /Leaking Primary Water/i } },
                { title: { $regex: /Unfinished School Roof/i } }
            ]
        });

        console.log(`🗑️ Deleted ${deleted.deletedCount} dummy reports.`);
        const remaining = await Report.find({});
        console.log(`✅ ${remaining.length} REAL citizen reports remain in MongoDB Atlas.`);
        
        process.exit(0);
    } catch (err) {
        console.error("Error clearing dummy reports:", err);
        process.exit(1);
    }
};

clearDummyReports();
