import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Project from "./models/project.model.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const projectData = [
    {
        projectName: "ORR Metro Line Flyover Extension (Phase 3)",
        department: "Public Works Department (PWD)",
        city: "Bengaluru",
        state: "Karnataka",
        latitude: 12.9716,
        longitude: 77.5946,
        budgetAllocated: 125000000, // ₹12.5 Cr
        budgetSpent: 85000000,      // ₹8.5 Cr
        progressPercentage: 68,
        startDate: new Date("2023-03-01"),
        targetCompletionDate: new Date("2025-06-30"),
        status: "ON_TRACK",
        contractorName: "L&T Infrastructure Engineering",
        description: "Construction of 6-lane elevated corridor and metro pillar foundation along Outer Ring Road."
    },
    {
        projectName: "Cauvery Stage V Water Supply Pipeline",
        department: "Jal Shakti (Water Supply)",
        city: "Bengaluru",
        state: "Karnataka",
        latitude: 12.9250,
        longitude: 77.5862,
        budgetAllocated: 80000000, // ₹8.0 Cr
        budgetSpent: 72000000,     // ₹7.2 Cr
        progressPercentage: 45,
        startDate: new Date("2022-09-01"),
        targetCompletionDate: new Date("2024-03-31"), // Past target!
        status: "CRITICAL_DELAY",
        contractorName: "BWSSB Regional Infra Works",
        description: "Pipeline laying for 110 villages in Peripheral East Bengaluru. Delayed due to road cutting approvals."
    },
    {
        projectName: "PM Surya Ghar 50MW Solar Grid Plant",
        department: "Renewable Energy & Solar",
        city: "Bengaluru",
        state: "Karnataka",
        latitude: 13.0827,
        longitude: 77.5877,
        budgetAllocated: 45000000, // ₹4.5 Cr
        budgetSpent: 42000000,     // ₹4.2 Cr
        progressPercentage: 92,
        startDate: new Date("2023-11-01"),
        targetCompletionDate: new Date("2024-12-31"),
        status: "ON_TRACK",
        contractorName: "KREDL Clean Energy Corp",
        description: "Rooftop solar installation on government educational institutions across North Bengaluru."
    },
    {
        projectName: "Coastal Road Project (South Section)",
        department: "Public Works Department (PWD)",
        city: "Mumbai",
        state: "Maharashtra",
        latitude: 18.9647,
        longitude: 72.8258,
        budgetAllocated: 350000000, // ₹35 Cr
        budgetSpent: 290000000,     // ₹29 Cr
        progressPercentage: 85,
        startDate: new Date("2022-01-15"),
        targetCompletionDate: new Date("2025-02-28"),
        status: "ON_TRACK",
        contractorName: "Hindustan Construction Co.",
        description: "Undersea tunnel and reclaimed land freeway connecting Marine Drive to Worli Bandra Sea Link."
    },
    {
        projectName: "Thane Creek Bridge Expansion",
        department: "Public Works Department (PWD)",
        city: "Mumbai",
        state: "Maharashtra",
        latitude: 19.0330,
        longitude: 73.0297,
        budgetAllocated: 180000000, // ₹18 Cr
        budgetSpent: 165000000,     // ₹16.5 Cr
        progressPercentage: 55,
        startDate: new Date("2023-02-01"),
        targetCompletionDate: new Date("2024-08-31"),
        status: "DELAYED",
        contractorName: "MSRDC Infra Projects",
        description: "Additional 6-lane bridge across Vashi Creek connecting Mumbai to Navi Mumbai."
    },
    {
        projectName: "Guindy Flyover Sub-surface Storm Drain",
        department: "Jal Shakti (Water Supply)",
        city: "Chennai",
        state: "Tamil Nadu",
        latitude: 13.0067,
        longitude: 80.2206,
        budgetAllocated: 60000000, // ₹6.0 Cr
        budgetSpent: 48000000,     // ₹4.8 Cr
        progressPercentage: 75,
        startDate: new Date("2023-07-01"),
        targetCompletionDate: new Date("2025-01-15"),
        status: "ON_TRACK",
        contractorName: "Greater Chennai Corp Civil Dept",
        description: "Monsoon flood mitigation storm drain network connecting Adyar river basin."
    },
    {
        projectName: "Musi Riverfront Urban Promenade & Park",
        department: "Urban Development & Housing",
        city: "Hyderabad",
        state: "Telangana",
        latitude: 17.3850,
        longitude: 78.4867,
        budgetAllocated: 95000000, // ₹9.5 Cr
        budgetSpent: 89000000,     // ₹8.9 Cr
        progressPercentage: 40,
        startDate: new Date("2023-05-01"),
        targetCompletionDate: new Date("2024-11-30"),
        status: "DELAYED",
        contractorName: "HMDA Urban Renewal Ltd",
        description: "Riverbed desilting, sewage diversion treatment, and public green park development."
    },
    {
        projectName: "Pragati Maidan Integrated Transit Tunnel",
        department: "Public Works Department (PWD)",
        city: "Delhi",
        state: "Delhi",
        latitude: 28.6139,
        longitude: 77.2090,
        budgetAllocated: 210000000, // ₹21 Cr
        budgetSpent: 205000000,     // ₹20.5 Cr
        progressPercentage: 98,
        startDate: new Date("2022-04-01"),
        targetCompletionDate: new Date("2024-06-30"),
        status: "ON_TRACK",
        contractorName: "Delhi PWD Engineering Board",
        description: "Signal-free access tunnel connecting Central Delhi to Ring Road and India Gate."
    },
    {
        projectName: "EWS Pucca Housing Colony Phase 4",
        department: "Urban Development & Housing",
        city: "Ahmedabad",
        state: "Gujarat",
        latitude: 23.0225,
        longitude: 72.5714,
        budgetAllocated: 110000000, // ₹11 Cr
        budgetSpent: 65000000,      // ₹6.5 Cr
        progressPercentage: 60,
        startDate: new Date("2023-01-15"),
        targetCompletionDate: new Date("2025-05-31"),
        status: "ON_TRACK",
        contractorName: "Gujarat Urban Housing Board",
        description: "Construction of 1,200 G+4 multi-story affordable flats under PMAY Urban."
    },
    {
        projectName: "Govt Primary School Digital Classrooms Upgrade",
        department: "Education & Schools Infrastructure",
        city: "Kolkata",
        state: "West Bengal",
        latitude: 22.5726,
        longitude: 88.3639,
        budgetAllocated: 32000000, // ₹3.2 Cr
        budgetSpent: 31000000,     // ₹3.1 Cr
        progressPercentage: 90,
        startDate: new Date("2023-08-01"),
        targetCompletionDate: new Date("2024-12-15"),
        status: "ON_TRACK",
        contractorName: "WB Education Infrastructure Corp",
        description: "Smart classroom hardware, solar inverter backup, and computer lab installation in 45 municipal schools."
    }
];

const seedProjects = async () => {
    try {
        console.log("=========================================");
        console.log("  JANDARPAN AI - INFRASTRUCTURE SEEDER   ");
        console.log("=========================================");
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(`${process.env.MONGODB_URL}/scheme-seva`);
        console.log("✅ Connected!");

        await Project.deleteMany({});
        console.log("🗑️ Cleared old projects collection.");

        const res = await Project.insertMany(projectData);
        console.log(`🎉 SUCCESS! Seeded ${res.length} public infrastructure projects across India!`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding projects:", error);
        process.exit(1);
    }
};

seedProjects();
