import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Report from "./models/report.model.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const sampleReports = [
    {
        title: "Substandard Road Asphalt Layer on ORR Service Road",
        category: "Delayed Roadwork & Potholes",
        description: "The newly paved asphalt layer in Bellandur Service Road is crumbling after just 2 rains. No bitumen density testing was performed.",
        imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
        cityName: "Bengaluru",
        latitude: 12.9250,
        longitude: 77.6862,
        upvotesCount: 54,
        status: "ENOTICE_ISSUED"
    },
    {
        title: "Leaking Primary Water Distribution Pipeline",
        category: "Water Supply / Drainage Leakage",
        description: "Over 50,000 liters of potable water leaking daily near HSR Layout 5th Main. Reported to local ward office 10 days ago.",
        imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80",
        cityName: "Bengaluru",
        latitude: 12.9116,
        longitude: 77.6389,
        upvotesCount: 42,
        status: "VERIFIED"
    },
    {
        title: "Unfinished School Roof Concrete Casting",
        category: "Substandard Public Construction",
        description: "Construction of Govt Primary School roof slab halted for 4 months without protective cover. Rainwater damaging existing classrooms.",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=800&auto=format&fit=crop&q=80",
        cityName: "Mumbai",
        latitude: 19.0330,
        longitude: 73.0297,
        upvotesCount: 35,
        status: "UNDER_INVESTIGATION"
    },
    {
        title: "Muddy Trench Unpaved Road Fraud",
        category: "Substandard Public Construction",
        description: "Contractor claimed completed road but citizen ground-truth photo shows unpaved muddy trench at GPS spot.",
        imageUrl: "https://images.unsplash.com/photo-1574482620826-406856a7b6a4?w=800&auto=format&fit=crop&q=80",
        cityName: "Bengaluru",
        latitude: 11.0000,
        longitude: 76.9700,
        upvotesCount: 68,
        status: "ENOTICE_ISSUED"
    }
];

const seedReports = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(`${process.env.MONGODB_URL}/scheme-seva`);
        await Report.deleteMany({});
        await Report.insertMany(sampleReports);
        console.log("🎉 Successfully re-seeded all complaints into MongoDB Atlas!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding reports:", err);
        process.exit(1);
    }
};

seedReports();
