import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Schemev2 from "./models/schemev2.model.js";

// Fix Windows Node.js SRV DNS lookup issues
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const fullSchemesDataset = [
    {
        schemeName: "Pradhan Mantri Awas Yojana (PMAY-Urban & Gramin)",
        schemeShortTitle: "PMAY",
        tags: ["Housing", "Urban", "Rural", "Subsidy", "PMAY"],
        level: "Central",
        nodalMinistryName: "Ministry Of Housing & Urban Affairs",
        state: "All States",
        schemeCategory: ["Housing & Shelter", "Social welfare & Empowerment"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2026-12-31"),
        detailedDescription_md: "Pradhan Mantri Awas Yojana is a flagship mission of the Government of India aimed at providing housing for all by providing interest subsidies and financial assistance for constructing or acquiring pucca houses.",
        eligibilityDescription_md: "**Eligibility Criteria:**\n- Annual household income below ₹3 Lakhs (EWS) or ₹6 Lakhs (LIG).\n- Beneficiary family must not own a pucca house in any part of India.\n- Female ownership or co-ownership of house mandated.",
        benefits: [
            { type: "paragraph", children: [{ text: "Up to ₹2.67 Lakh interest subsidy under Credit Linked Subsidy Scheme (CLSS)." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Aadhaar Card, Income Certificate, Bank Passbook, Land ownership proof." }] }
        ],
        faqs: [
            { question: "What is the maximum subsidy amount?", answer: "Up to ₹2.67 Lakhs credited directly to loan account." }
        ]
    },
    {
        schemeName: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
        schemeShortTitle: "PM-JAY",
        tags: ["Healthcare", "Insurance", "Hospitalization", "Free Treatment"],
        level: "Central",
        nodalMinistryName: "Ministry Of Health & Family Welfare",
        state: "All States",
        schemeCategory: ["Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Ayushman Bharat PM-JAY is the world's largest government-funded health insurance scheme offering coverage up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization.",
        eligibilityDescription_md: "**Eligibility:** Families identified based on deprivation and occupational criteria under SECC 2011.",
        benefits: [
            { type: "paragraph", children: [{ text: "Cashless treatment at all empanelled public and private hospitals nationwide." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Aadhaar Card, Ration Card, PM-JAY Golden Card." }] }
        ],
        faqs: [
            { question: "Is pre-existing condition covered?", answer: "Yes, all pre-existing conditions are covered from day one." }
        ]
    },
    {
        schemeName: "PM Kisan Samman Nidhi",
        schemeShortTitle: "PM-KISAN",
        tags: ["Agriculture", "Direct Benefit Transfer", "Farmers", "Financial Aid"],
        level: "Central",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "All States",
        schemeCategory: ["Agriculture,Rural & Environment"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "PM-KISAN provides income support of ₹6,000 per annum to all landholding farmer families across the country to assist in farm input expenses.",
        eligibilityDescription_md: "**Eligibility:** All landholding farmers cultivating land registered in their name.",
        benefits: [
            { type: "paragraph", children: [{ text: "₹6,000 directly transferred to bank accounts in 3 equal installments of ₹2,000 every 4 months." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Land ownership records (Khatauni), Aadhaar, Bank Details with eKYC." }] }
        ],
        faqs: [
            { question: "How to complete eKYC?", answer: "eKYC can be completed via OTP on PM-KISAN portal or CSC biometric center." }
        ]
    },
    {
        schemeName: "National Apprenticeship Promotion Scheme (NAPS)",
        schemeShortTitle: "NAPS",
        tags: ["Skills", "Employment", "Stipend", "Apprenticeship"],
        level: "Central",
        nodalMinistryName: "Ministry Of Skill Development And Entrepreneurship",
        state: "All States",
        schemeCategory: ["Skills & Employment", "Education & Learning"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2027-12-31"),
        detailedDescription_md: "NAPS promotes apprenticeship training and provides financial support to industrial establishments engaging young apprentices.",
        eligibilityDescription_md: "**Eligibility:** Candidates aged 15-35 years with ITI, diploma, 10th, or 12th pass qualifications.",
        benefits: [
            { type: "paragraph", children: [{ text: "Government shares 25% of prescribed stipend up to ₹1,500 per month per apprentice." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Educational Certificates, Aadhaar Card, Bank Passbook." }] }
        ],
        faqs: [
            { question: "What is the training duration?", answer: "From 6 to 36 months based on designated trades." }
        ]
    },
    {
        schemeName: "Beti Bachao Beti Padhao (BBBP)",
        schemeShortTitle: "BBBP",
        tags: ["Women Empowerment", "Girl Child", "Education", "Safety"],
        level: "Central",
        nodalMinistryName: "Ministry Of Women and Child Development",
        state: "All States",
        schemeCategory: ["Women and Child", "Education & Learning"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "BBBP addresses the declining Child Sex Ratio and promotes education, rights, and welfare for girl children across India.",
        eligibilityDescription_md: "**Eligibility:** All families with girl children under 10 years.",
        benefits: [
            { type: "paragraph", children: [{ text: "High-interest savings account under Sukanya Samriddhi Yojana with tax exemptions." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Girl Child Birth Certificate, Guardian Identity Proof, Address Proof." }] }
        ],
        faqs: [
            { question: "What is the interest rate for Sukanya Samriddhi?", answer: "Compounded annual interest rate (currently ~8.2%)." }
        ]
    },
    {
        schemeName: "PM SVANidhi - Micro Credit Scheme for Street Vendors",
        schemeShortTitle: "PM-SVANidhi",
        tags: ["Vendor Loan", "Micro Finance", "Business", "Working Capital"],
        level: "Central",
        nodalMinistryName: "Ministry Of Housing & Urban Affairs",
        state: "All States",
        schemeCategory: ["Business & Entrepreneurship", "Banking, Financial Services and Insurance"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2026-12-31"),
        detailedDescription_md: "PM SVANidhi facilitates collateral-free working capital loans up to ₹50,000 for street vendors affected by economic disruptions.",
        eligibilityDescription_md: "**Eligibility:** Street vendors possessing Vending Certificate or Identity Card issued by Urban Local Bodies.",
        benefits: [
            { type: "paragraph", children: [{ text: "First loan tranche of ₹10,000, 2nd tranche ₹20,000, 3rd tranche ₹50,000 with 7% interest subsidy." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Certificate of Vending / ULB Recommendation Letter, Aadhaar, Bank Details." }] }
        ],
        faqs: [
            { question: "Is collateral required?", answer: "No collateral required." }
        ]
    },
    {
        schemeName: "PM Mudra Yojana (PMMY)",
        schemeShortTitle: "PMMY",
        tags: ["Business Loan", "MSME", "Entrepreneurship", "Collateral Free"],
        level: "Central",
        nodalMinistryName: "Ministry Of Finance",
        state: "All States",
        schemeCategory: ["Business & Entrepreneurship", "Banking, Financial Services and Insurance"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2029-12-31"),
        detailedDescription_md: "PMMY provides loans up to ₹10 Lakhs to non-corporate, non-farm small and micro enterprises across Shishu, Kishore, and Tarun categories.",
        eligibilityDescription_md: "**Eligibility:** Any Indian citizen who has a business plan for a non-farm sector revenue generating activity.",
        benefits: [
            { type: "paragraph", children: [{ text: "Shishu: up to ₹50k, Kishore: ₹50k to ₹5L, Tarun: ₹5L to ₹10L collateral free." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Business Plan Proof, Identity Proof, Address Proof, Bank Statements." }] }
        ],
        faqs: [
            { question: "Where to apply?", answer: "Apply at any commercial bank, RRB, MFI, or online via UdyamiMitra." }
        ]
    },
    {
        schemeName: "PM Ujjwala Yojana 2.0 (Free LPG Connection)",
        schemeShortTitle: "PMUY",
        tags: ["Gas Connection", "LPG", "Women", "Clean Energy"],
        level: "Central",
        nodalMinistryName: "Ministry Of Petroleum and Natural Gas",
        state: "All States",
        schemeCategory: ["Utility & Sanitation", "Women and Child"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2027-12-31"),
        detailedDescription_md: "PMUY 2.0 provides deposit-free LPG gas connections to adult women from low-income households along with a free first refill and stove.",
        eligibilityDescription_md: "**Eligibility:** Adult woman belonging to BPL/poor households without existing LPG connection.",
        benefits: [
            { type: "paragraph", children: [{ text: "Deposit-free gas connection + first cylinder refill + free hotplate/stove." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Ration Card, Aadhaar Card, Bank Account Details." }] }
        ],
        faqs: [
            { question: "Is self-declaration accepted for migrant workers?", answer: "Yes, family declaration proof is accepted." }
        ]
    },
    {
        schemeName: "Stand Up India Scheme",
        schemeShortTitle: "StandUpIndia",
        tags: ["SC/ST", "Women Entrepreneurs", "Greenfield Business"],
        level: "Central",
        nodalMinistryName: "Ministry Of Finance",
        state: "All States",
        schemeCategory: ["Business & Entrepreneurship", "Social welfare & Empowerment"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Facilitates bank loans between ₹10 Lakhs and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch.",
        eligibilityDescription_md: "**Eligibility:** SC/ST and/or women entrepreneurs above 18 years setting up greenfield enterprises.",
        benefits: [
            { type: "paragraph", children: [{ text: "Bank loans from ₹10 Lakhs to ₹1 Crore for manufacturing, services, or trading." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Caste Certificate (for SC/ST), Project Proposal, Business Address Proof." }] }
        ],
        faqs: [
            { question: "What is greenfield enterprise?", answer: "First-time venture in manufacturing, services or trading sector." }
        ]
    },
    {
        schemeName: "PM Vishwakarma Scheme",
        schemeShortTitle: "PM-Vishwakarma",
        tags: ["Artisans", "Craftsmen", "Skills", "Toolkit Incentive"],
        level: "Central",
        nodalMinistryName: "Ministry Of Micro, Small and Medium Enterprises",
        state: "All States",
        schemeCategory: ["Skills & Employment", "Business & Entrepreneurship"],
        openDate: new Date("2023-09-17"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Holistic support scheme for traditional artisans and craftsmen engaged in 18 traditional trades like carpenters, blacksmiths, goldsmiths, and potters.",
        eligibilityDescription_md: "**Eligibility:** Traditional artisans working with hands and tools in eligible trades.",
        benefits: [
            { type: "paragraph", children: [{ text: "PM Vishwakarma ID, Skill training stipend ₹500/day, ₹15,000 toolkit grant, collateral-free loan up to ₹3 Lakhs at 5% interest." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Aadhaar Card, Mobile Number, Bank Passbook, Skill trade proof." }] }
        ],
        faqs: [
            { question: "How many trades are covered?", answer: "18 traditional trades including Carpenter, Blacksmith, Potter, Tailor, Cobbler." }
        ]
    },
    {
        schemeName: "PM Surya Ghar: Muft Bijli Yojana",
        schemeShortTitle: "PM-SuryaGhar",
        tags: ["Rooftop Solar", "Free Electricity", "Renewable Energy"],
        level: "Central",
        nodalMinistryName: "Ministry Of New and Renewable Energy",
        state: "All States",
        schemeCategory: ["Utility & Sanitation", "Science, IT & Communications"],
        openDate: new Date("2024-02-15"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Provides up to ₹78,000 subsidy for residential rooftop solar installation to supply up to 300 units of free electricity per month.",
        eligibilityDescription_md: "**Eligibility:** All residential households owning a house with suitable roof space.",
        benefits: [
            { type: "paragraph", children: [{ text: "Subsidy of ₹30,000 for 1kW, ₹60,000 for 2kW, and ₹78,000 for 3kW systems." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Latest Electricity Bill, Roof Ownership Proof, Aadhaar Card." }] }
        ],
        faqs: [
            { question: "Can excess power be sold back?", answer: "Yes, excess solar power is fed back to local grid via net metering." }
        ]
    },
    {
        schemeName: "Atal Pension Yojana (APY)",
        schemeShortTitle: "APY",
        tags: ["Pension", "Unorganized Sector", "Social Security"],
        level: "Central",
        nodalMinistryName: "Ministry Of Finance",
        state: "All States",
        schemeCategory: ["Banking, Financial Services and Insurance", "Social welfare & Empowerment"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2035-12-31"),
        detailedDescription_md: "Guaranteed pension scheme for workers in the unorganized sector offering a monthly pension ranging from ₹1,000 to ₹5,000 after age 60.",
        eligibilityDescription_md: "**Eligibility:** Indian citizens aged 18 to 40 years holding a savings bank account.",
        benefits: [
            { type: "paragraph", children: [{ text: "Guaranteed minimum monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000 at age 60." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Bank Savings Account, Aadhaar Card, Nominee Details." }] }
        ],
        faqs: [
            { question: "Is contribution tax-deductible?", answer: "Yes, contributions qualify for tax deduction under Section 80CCD." }
        ]
    },
    {
        schemeName: "Post Matric Scholarship for SC/ST/OBC Students",
        schemeShortTitle: "PMS-Scholarship",
        tags: ["Scholarship", "Higher Education", "SC/ST", "Financial Assistance"],
        level: "State/ UT",
        nodalMinistryName: "Ministry Of Social Justice and Empowerment",
        state: "Karnataka",
        schemeCategory: ["Education & Learning", "Social welfare & Empowerment"],
        openDate: new Date("2024-06-01"),
        closeDate: new Date("2025-03-31"),
        detailedDescription_md: "Financial support for post-matriculation or post-secondary courses to enable SC, ST, and OBC students to complete higher education.",
        eligibilityDescription_md: "**Eligibility:** SC/ST students with family income less than ₹2.5 Lakhs per annum studying in recognized colleges.",
        benefits: [
            { type: "paragraph", children: [{ text: "Full tuition fee reimbursement + annual maintenance allowance." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Caste Certificate, Income Certificate, Previous Marksheet, Fee Receipt." }] }
        ],
        faqs: [
            { question: "Can engineering students apply?", answer: "Yes, eligible professional degree students can apply." }
        ]
    },
    {
        schemeName: "Pradhan Mantri Gram Sadak Yojana (PMGSY)",
        schemeShortTitle: "PMGSY",
        tags: ["Infrastructure", "Road Connectivity", "Rural Development"],
        level: "Central",
        nodalMinistryName: "Ministry Of Rural Development",
        state: "All States",
        schemeCategory: ["Transport & Infrastructure Sports & Culture", "Agriculture,Rural & Environment"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Provides all-weather road connectivity to eligible unconnected habitations in rural areas to enhance socio-economic development.",
        eligibilityDescription_md: "**Eligibility:** Rural habitations with population 500+ in plains and 250+ in hill/desert areas.",
        benefits: [
            { type: "paragraph", children: [{ text: "Quality paved road connectivity connecting villages to agricultural markets, schools, and hospitals." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "Panchayat Resolution, Habitation Census Data." }] }
        ],
        faqs: [
            { question: "Who maintains these roads?", answer: "Maintained under 5-year post-construction maintenance contracts by state PWDs." }
        ]
    },
    {
        schemeName: "Digital India Internship Scheme",
        schemeShortTitle: "DIIS",
        tags: ["IT", "Technology", "Internship", "Government Tech"],
        level: "Central",
        nodalMinistryName: "Ministry Of Science And Technology",
        state: "All States",
        schemeCategory: ["Science, IT & Communications", "Skills & Employment"],
        openDate: new Date("2024-05-01"),
        closeDate: new Date("2026-12-31"),
        detailedDescription_md: "Offers students exposure to policy formulation, AI initiatives, cyber security, and digital governance projects under MeitY.",
        eligibilityDescription_md: "**Eligibility:** Students pursuing B.Tech/BE/M.Tech/MCA/M.Sc (IT) with at least 60% marks.",
        benefits: [
            { type: "paragraph", children: [{ text: "Monthly stipend of ₹10,000 + official certificate from Government of India." }] }
        ],
        documents_required: [
            { type: "paragraph", children: [{ text: "College Recommendation Letter, Semester Marksheets, Resume." }] }
        ],
        faqs: [
            { question: "What is the duration?", answer: "2 months during summer/winter breaks." }
        ]
    }
];

const seedDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(`${mongoUrl}/scheme-seva`);
        console.log("Connected to MongoDB Atlas successfully!");

        await Schemev2.deleteMany({});
        console.log("Cleared existing schemesv2 collection...");

        const inserted = await Schemev2.insertMany(fullSchemesDataset);
        console.log(`Successfully seeded ${inserted.length} rich government schemes into MongoDB Atlas!`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();
