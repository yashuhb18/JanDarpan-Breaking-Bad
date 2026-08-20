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

const SECTOR_INITIATIVES = [
    { title: "Mukhyamantri Solar Rooftop & Power Subsidy", category: "Utility & Sanitation", ministry: "Ministry Of New and Renewable Energy" },
    { title: "Kisan Samman & Drip Irrigation Subsidy", category: "Agriculture,Rural & Environment", ministry: "Ministry Of Agriculture and Farmers Welfare" },
    { title: "MSME Self-Employment & Micro Credit Grant", category: "Business & Entrepreneurship", ministry: "Ministry Of Micro, Small and Medium Enterprises" },
    { title: "Girl Child Higher Education & Laptop Incentive", category: "Education & Learning", ministry: "Ministry Of Education" },
    { title: "State Cashless Health Protection Insurance", category: "Health & Wellness", ministry: "Ministry Of Health & Family Welfare" },
    { title: "Unemployed Youth Graduation & Skill Allowance", category: "Skills & Employment", ministry: "Ministry Of Skill Development And Entrepreneurship" },
    { title: "Pucca House Construction Financial Assistance", category: "Housing & Shelter", ministry: "Ministry Of Housing & Urban Affairs" },
    { title: "Women Empowerment Monthly Financial Rights Grant", category: "Women and Child", ministry: "Ministry Of Women and Child Development" },
    { title: "Senior Citizen Assistive Device & Pension Support", category: "Social welfare & Empowerment", ministry: "Ministry Of Social Justice and Empowerment" },
    { title: "State IT & Youth Startup Innovation Seed Grant", category: "Science, IT & Communications", ministry: "Ministry Of Electronics and Information Technology" },
    { title: "Street Vendor Micro Working Capital Loan", category: "Banking, Financial Services and Insurance", ministry: "Ministry Of Finance" },
    { title: "Rural Panchayat Road & Drinking Water Mission", category: "Transport & Infrastructure Sports & Culture", ministry: "Ministry Of Rural Development" },
    { title: "Eco-Tourism & Homestay Entrepreneur Subsidy", category: "Travel & Tourism", ministry: "Ministry Of Labour and Employment" },
    { title: "Public Legal Aid & Victim Assistance Fund", category: "Public Safety,Law & Justice", ministry: "Ministry Of Social Justice and Empowerment" },
    { title: "State Youth Sports Excellence & Equipment Grant", category: "Sports & Culture", ministry: "Ministry Of Education" }
];

const generateStateWise2000Schemes = () => {
    const schemes = [];

    // Generate ~130 schemes per state across all 33 States and UTs (~4,290 total schemes)
    for (let sIdx = 0; sIdx < STATES.length; sIdx++) {
        const stateName = STATES[sIdx];
        
        for (let i = 0; i < 130; i++) {
            const initiative = SECTOR_INITIATIVES[(sIdx + i) % SECTOR_INITIATIVES.length];
            const isCentral = (i % 7 === 0); // 1 out of 7 is Central, 6 out of 7 are State-specific
            const level = isCentral ? "Central" : "State";
            const schemeState = isCentral ? "All States" : stateName;
            
            const prefix = isCentral ? "Pradhan Mantri" : `Mukhyamantri ${stateName}`;
            const title = `${prefix} ${initiative.title} (Phase ${i + 1})`;
            const code = `${stateName.substring(0, 3).toUpperCase()}-${sIdx + 1}-${i + 1}`;

            schemes.push({
                schemeName: title,
                schemeShortTitle: code,
                tags: [stateName, initiative.category.split(',')[0], "State Welfare", level],
                level: level,
                nodalMinistryName: initiative.ministry,
                state: schemeState,
                schemeCategory: [initiative.category],
                openDate: new Date("2023-01-01"),
                closeDate: new Date("2029-12-31"),
                detailedDescription_md: `Official welfare initiative by ${isCentral ? 'Government of India' : stateName + ' State Government'} providing direct financial assistance, subsidies, and benefit transfers under the ${initiative.title} program for eligible residents.`,
                eligibilityDescription_md: `**Eligibility:** Permanent residents and domicile holders of ${schemeState} belonging to low & middle-income households.`,
                benefits: [{ type: "paragraph", children: [{ text: `Direct Benefit Transfer (DBT) state grant up to ₹${(i % 15 + 1) * 3000} per year.` }] }],
                documents_required: [{ type: "paragraph", children: [{ text: `${stateName} Domicile Certificate, Ration Card, Aadhaar Card, Bank Passbook.` }] }],
                faqs: [{ question: "How to apply?", answer: `Submit application online via official ${stateName} state service portal or visit local Seva Kendra.` }]
            });
        }
    }

    return schemes;
};

const seedStateWise2000InAtlas = async () => {
    try {
        console.log("=========================================================");
        console.log("  JANDARPAN AI - STATE-WISE 2,000+ SCHEMES EXPANSION     ");
        console.log("=========================================================");
        console.log("Connecting to MongoDB Atlas Cluster...");

        await mongoose.connect(`${process.env.MONGODB_URL}/scheme-seva`, {
            serverSelectionTimeoutMS: 60000,
            socketTimeoutMS: 60000,
        });

        console.log("✅ Connected to MongoDB Atlas!");
        console.log("Generating state-wise scheme records for all 28 States & UTs...");

        const megaList = generateStateWise2000Schemes();

        console.log(`Generated ${megaList.length} state-focused scheme records.`);
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

        console.log("=========================================================");
        console.log(`🎉 SUCCESS! INGESTED ${insertedCount} STATE-WISE SCHEMES INTO MONGODB ATLAS!`);
        console.log("=========================================================");

        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding state-wise schemes:", err);
        process.exit(1);
    }
};

seedStateWise2000InAtlas();
