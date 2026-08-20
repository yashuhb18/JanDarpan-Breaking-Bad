import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Schemev2 from "./models/schemev2.model.js";

// Fix Windows Node.js SRV DNS lookup issues for Atlas
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh"
];

const CATEGORIES = [
    "Agriculture,Rural & Environment",
    "Banking, Financial Services and Insurance",
    "Business & Entrepreneurship",
    "Education & Learning",
    "Health & Wellness",
    "Housing & Shelter",
    "Public Safety,Law & Justice",
    "Science, IT & Communications",
    "Skills & Employment",
    "Social welfare & Empowerment",
    "Sports & Culture",
    "Transport & Infrastructure Sports & Culture",
    "Travel & Tourism",
    "Utility & Sanitation",
    "Women and Child"
];

const MINISTRIES = [
    "Ministry Of Agriculture and Farmers Welfare",
    "Ministry Of Health & Family Welfare",
    "Ministry Of Education",
    "Ministry Of Women and Child Development",
    "Ministry Of Housing & Urban Affairs",
    "Ministry Of Finance",
    "Ministry Of Skill Development And Entrepreneurship",
    "Ministry Of Micro, Small and Medium Enterprises",
    "Ministry Of Rural Development",
    "Ministry Of New and Renewable Energy",
    "Ministry Of Social Justice and Empowerment",
    "Ministry Of Electronics and Information Technology",
    "Ministry Of Labour and Employment"
];

const SCHEME_TYPES = [
    { prefix: "Pradhan Mantri", level: "Central" },
    { prefix: "Mukhyamantri", level: "State" },
    { prefix: "State Citizen", level: "State" },
    { prefix: "National Welfare", level: "Central" },
    { prefix: "Deendayal", level: "Central" },
    { prefix: "Gramin Vikas", level: "State" }
];

const SECTOR_INITIATIVES = [
    { title: "Solar Rooftop & Clean Energy Incentive", category: "Utility & Sanitation", ministry: "Ministry Of New and Renewable Energy" },
    { title: "Kisan Credit & Farm Crop Assistance", category: "Agriculture,Rural & Environment", ministry: "Ministry Of Agriculture and Farmers Welfare" },
    { title: "Micro Small Enterprise Working Capital Loan", category: "Business & Entrepreneurship", ministry: "Ministry Of Micro, Small and Medium Enterprises" },
    { title: "Girl Child Higher Education Scholarship", category: "Education & Learning", ministry: "Ministry Of Education" },
    { title: "Cashless Universal Health Protection Cover", category: "Health & Wellness", ministry: "Ministry Of Health & Family Welfare" },
    { title: "Unemployed Youth Skill & Apprenticeship Allowance", category: "Skills & Employment", ministry: "Ministry Of Skill Development And Entrepreneurship" },
    { title: "Pucca House Urban & Rural Construction Grant", category: "Housing & Shelter", ministry: "Ministry Of Housing & Urban Affairs" },
    { title: "Maternity Cash Assistance & Child Nutrition", category: "Women and Child", ministry: "Ministry Of Women and Child Development" },
    { title: "Senior Citizen Assistive Device & Pension Grant", category: "Social welfare & Empowerment", ministry: "Ministry Of Social Justice and Empowerment" },
    { title: "Digital Technology & AI Innovation Fellowship", category: "Science, IT & Communications", ministry: "Ministry Of Electronics and Information Technology" },
    { title: "Street Vendor Micro Working Capital Loan", category: "Banking, Financial Services and Insurance", ministry: "Ministry Of Finance" },
    { title: "Rural Road & Infrastructure Connectivity", category: "Transport & Infrastructure Sports & Culture", ministry: "Ministry Of Rural Development" },
    { title: "Heritage Eco Tourism & Homestay Subsidy", category: "Travel & Tourism", ministry: "Ministry Of Labour and Employment" },
    { title: "Public Legal Aid & Victim Assistance Fund", category: "Public Safety,Law & Justice", ministry: "Ministry Of Social Justice and Empowerment" },
    { title: "Youth Sports Talent & Equipment Grant", category: "Sports & Culture", ministry: "Ministry Of Education" }
];

// Core Authentic Base Schemes
const baseSchemes = [
    {
        schemeName: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        schemeShortTitle: "PM-KISAN",
        tags: ["Agriculture", "Direct Benefit Transfer", "Farmers"],
        level: "Central",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "All States",
        schemeCategory: ["Agriculture,Rural & Environment"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "PM-KISAN provides direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.",
        eligibilityDescription_md: "**Eligibility:** All landholding farmer families.",
        benefits: [{ type: "paragraph", children: [{ text: "₹6,000 annual financial assistance transferred directly via DBT." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Land Record, Aadhaar Card, Bank Account linked with Aadhaar." }] }]
    },
    {
        schemeName: "Ayushman Bharat - PMJAY",
        schemeShortTitle: "PMJAY",
        tags: ["Healthcare", "Health Insurance", "Cashless Hospitalization"],
        level: "Central",
        nodalMinistryName: "Ministry Of Health & Family Welfare",
        state: "All States",
        schemeCategory: ["Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Health insurance cover up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization.",
        eligibilityDescription_md: "**Eligibility:** Families listed under SECC 2011 data.",
        benefits: [{ type: "paragraph", children: [{ text: "100% cashless treatment at empanelled public and private hospitals." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Ayushman Golden Card, Aadhaar Card, Ration Card." }] }]
    },
    {
        schemeName: "PM Surya Ghar: Muft Bijli Yojana",
        schemeShortTitle: "PM-SuryaGhar",
        tags: ["Rooftop Solar", "Free Electricity", "Solar Subsidy"],
        level: "Central",
        nodalMinistryName: "Ministry Of New and Renewable Energy",
        state: "All States",
        schemeCategory: ["Utility & Sanitation", "Science, IT & Communications"],
        openDate: new Date("2024-02-15"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Subsidizes rooftop solar installations up to ₹78,000 to provide 300 units of free monthly electricity.",
        eligibilityDescription_md: "**Eligibility:** Residential households with suitable roof space.",
        benefits: [{ type: "paragraph", children: [{ text: "₹30,000 for 1kW, ₹60,000 for 2kW, ₹78,000 for 3kW rooftop solar." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Electricity Bill, Roof Ownership Proof, Aadhaar Card." }] }]
    }
];

const generate2000Schemes = () => {
    const schemes = [...baseSchemes];
    let counter = 1;

    while (schemes.length < 2050) {
        const state = STATES[counter % STATES.length];
        const initiative = SECTOR_INITIATIVES[counter % SECTOR_INITIATIVES.length];
        const type = SCHEME_TYPES[counter % SCHEME_TYPES.length];
        
        const schemeState = type.level === "Central" ? "All States" : state;
        const stateNamePrefix = type.level === "Central" ? "National" : state;
        
        const name = `${type.prefix} ${stateNamePrefix} ${initiative.title} (Phase ${Math.floor(counter / 50) + 1})`;
        const shortTitle = `${type.prefix.substring(0, 2)}-${state.substring(0, 3).toUpperCase()}-${counter}`;

        schemes.push({
            schemeName: name,
            schemeShortTitle: shortTitle,
            tags: [state, initiative.category.split(',')[0], "Welfare Grant", type.level],
            level: type.level,
            nodalMinistryName: initiative.ministry,
            state: schemeState,
            schemeCategory: [initiative.category],
            openDate: new Date("2023-01-01"),
            closeDate: new Date("2029-12-31"),
            detailedDescription_md: `Official government initiative providing financial assistance, subsidies, and welfare benefits under the ${initiative.title} scheme for eligible citizens of ${schemeState}.`,
            eligibilityDescription_md: `**Eligibility:** Permanent residents of ${schemeState} belonging to low & middle-income groups seeking ${initiative.title.toLowerCase()} support.`,
            benefits: [{ type: "paragraph", children: [{ text: `Direct Benefit Transfer (DBT) grant up to ₹${(counter % 10 + 1) * 5000} per year.` }] }],
            documents_required: [{ type: "paragraph", children: [{ text: "Aadhaar Card, Domicile Certificate, Bank Account Details, Income Proof." }] }],
            faqs: [{ question: "How to apply?", answer: `Apply online via the official ${schemeState} government portal or nearest Common Service Center (CSC).` }]
        });

        counter++;
    }

    return schemes;
};

const seed2000SchemesInAtlas = async () => {
    try {
        console.log("=================================================");
        console.log("  JANDARPAN AI - 2,000+ SCHEMES MASSIVE SEEDER   ");
        console.log("=================================================");
        console.log("Connecting to MongoDB Atlas Cluster...");

        await mongoose.connect(`${process.env.MONGODB_URL}/scheme-seva`, {
            serverSelectionTimeoutMS: 60000,
            socketTimeoutMS: 60000,
        });

        console.log("✅ Connected to MongoDB Atlas!");
        console.log("Generating 2,050 comprehensive scheme records...");

        const megaList = generate2000Schemes();

        console.log(`Generated ${megaList.length} total scheme records.`);
        console.log("Clearing existing collection...");
        await Schemev2.deleteMany({});

        // Insert in batches of 500
        const BATCH_SIZE = 500;
        let insertedCount = 0;

        for (let i = 0; i < megaList.length; i += BATCH_SIZE) {
            const batch = megaList.slice(i, i + BATCH_SIZE);
            const res = await Schemev2.insertMany(batch);
            insertedCount += res.length;
            console.log(` Batch ${Math.floor(i / BATCH_SIZE) + 1}: Inserted ${res.length} schemes (Total: ${insertedCount}/${megaList.length})`);
        }

        console.log("=================================================");
        console.log(`🎉 SUCCESS! INGESTED ${insertedCount} ACTIVE SCHEMES INTO MONGODB ATLAS!`);
        console.log("=================================================");

        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding 2,000 schemes:", err);
        process.exit(1);
    }
};

seed2000SchemesInAtlas();
