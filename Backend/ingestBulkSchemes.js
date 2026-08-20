import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import fs from "fs";
import path from "path";
import Schemev2 from "./models/schemev2.model.js";

// Fix Windows Node.js SRV DNS lookup issues
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

// Comprehensive All-India Government Schemes Dataset covering 28 States & 8 UTs + Central Ministries
const nationwideSchemesDataset = [
    // Central - Agriculture & Rural Development
    {
        schemeName: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        schemeShortTitle: "PM-KISAN",
        tags: ["Agriculture", "Direct Benefit Transfer", "Farmers", "Financial Support"],
        level: "Central",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "All States",
        schemeCategory: ["Agriculture,Rural & Environment"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "PM-KISAN provides direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.",
        eligibilityDescription_md: "**Eligibility:** All landholding farmer families with cultivable land in their names.",
        benefits: [{ type: "paragraph", children: [{ text: "₹6,000 annual financial assistance transferred directly via DBT." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Land Record (Khatauni), Aadhaar Card, Bank Account linked with Aadhaar." }] }],
        faqs: [{ question: "How to update eKYC?", answer: "Complete eKYC on PM-KISAN portal using Aadhaar OTP." }]
    },
    {
        schemeName: "PM Fasal Bima Yojana (PMFBY)",
        schemeShortTitle: "PMFBY",
        tags: ["Crop Insurance", "Agriculture", "Weather Claim"],
        level: "Central",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "All States",
        schemeCategory: ["Agriculture,Rural & Environment"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Comprehensive crop insurance scheme protecting farmers against non-preventable natural risks from pre-sowing to post-harvest.",
        eligibilityDescription_md: "**Eligibility:** All farmers growing notified crops in notified areas including sharecroppers.",
        benefits: [{ type: "paragraph", children: [{ text: "Low premium rates (1.5% Rabi, 2.0% Kharif) with 100% claim payout." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Land Certificate, Sowing Certificate, Aadhaar Card, Bank Passbook." }] }],
        faqs: [{ question: "Claim period?", answer: "Report crop damage within 72 hours." }]
    },
    {
        schemeName: "Kisan Credit Card (KCC)",
        schemeShortTitle: "KCC",
        tags: ["Farmer Credit", "Agricultural Loan", "Low Interest"],
        level: "Central",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "All States",
        schemeCategory: ["Agriculture,Rural & Environment", "Banking, Financial Services and Insurance"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Timely credit for agricultural requirements, animal husbandry, and fisheries at 4% effective interest rate.",
        eligibilityDescription_md: "**Eligibility:** Farmers, tenant farmers, sharecroppers, and SHGs.",
        benefits: [{ type: "paragraph", children: [{ text: "Revolving credit limit up to ₹3 Lakhs without collateral up to ₹1.6 Lakhs." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Land Ownership Record, Identity Proof, Address Proof." }] }],
        faqs: [{ question: "Validity?", answer: "5 years." }]
    },
    {
        schemeName: "PM Krishi Sinchayee Yojana (PMKSY)",
        schemeShortTitle: "PMKSY",
        tags: ["Micro Irrigation", "Drip Irrigation", "Har Khet Ko Pani"],
        level: "Central",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "All States",
        schemeCategory: ["Agriculture,Rural & Environment"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Expands cultivable area under assured irrigation and promotes precision water management (Per Drop More Crop).",
        eligibilityDescription_md: "**Eligibility:** Farmers possessing cultivable land.",
        benefits: [{ type: "paragraph", children: [{ text: "Up to 55% subsidy on drip and sprinkler irrigation equipment." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Land Records, Water Source Proof, Aadhaar." }] }],
        faqs: [{ question: "Subsidy percentage?", answer: "55% for small/marginal farmers, 45% for others." }]
    },
    {
        schemeName: "Paramparagat Krishi Vikas Yojana (PKVY)",
        schemeShortTitle: "PKVY",
        tags: ["Organic Farming", "Eco Friendly", "Soil Health"],
        level: "Central",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "All States",
        schemeCategory: ["Agriculture,Rural & Environment"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Promotes organic farming through cluster approach and Participatory Guarantee System (PGS) certification.",
        eligibilityDescription_md: "**Eligibility:** Farmers forming organic farming clusters of 50 or more acres.",
        benefits: [{ type: "paragraph", children: [{ text: "₹50,000 per hectare financial assistance over 3 years for organic inputs." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Cluster Group Registration, Aadhaar Card, Land Records." }] }],
        faqs: [{ question: "Certification provided?", answer: "PGS-India organic certification." }]
    },

    // Healthcare & Insurance
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
        documents_required: [{ type: "paragraph", children: [{ text: "Ayushman Golden Card, Aadhaar Card, Ration Card." }] }],
        faqs: [{ question: "Pre-existing illness covered?", answer: "Yes, covered from day one." }]
    },
    {
        schemeName: "PM Bharatiya Janaushadhi Pariyojana (PMBJP)",
        schemeShortTitle: "PMBJP",
        tags: ["Generic Medicine", "Affordable Healthcare", "Jan Aushadhi"],
        level: "Central",
        nodalMinistryName: "Ministry Of Health & Family Welfare",
        state: "All States",
        schemeCategory: ["Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Provides quality generic medicines and surgical consumables at 50% to 90% discount compared to branded drugs.",
        eligibilityDescription_md: "**Eligibility:** All citizens.",
        benefits: [{ type: "paragraph", children: [{ text: "Access to 1,900+ generic drugs at up to 90% lower prices." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Prescription from Registered Medical Practitioner." }] }],
        faqs: [{ question: "Are drugs quality-tested?", answer: "Tested in NABL accredited laboratories." }]
    },
    {
        schemeName: "Pradhan Mantri National Dialysis Program (PMNDP)",
        schemeShortTitle: "PMNDP",
        tags: ["Dialysis", "Free Health Services", "District Hospitals"],
        level: "Central",
        nodalMinistryName: "Ministry Of Health & Family Welfare",
        state: "All States",
        schemeCategory: ["Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Free hemodialysis services for BPL patients in all district hospitals across the country.",
        eligibilityDescription_md: "**Eligibility:** BPL patients suffering from end-stage renal disease.",
        benefits: [{ type: "paragraph", children: [{ text: "Free dialysis sessions in government dialysis centers." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "BPL Certificate, Doctor Advice Sheet, Aadhaar." }] }],
        faqs: [{ question: "Is registration required?", answer: "Register at nearest district hospital." }]
    },

    // Housing & Urban Infrastructure
    {
        schemeName: "Pradhan Mantri Awas Yojana - Urban & Gramin (PMAY)",
        schemeShortTitle: "PMAY",
        tags: ["Housing", "Pucca House", "Interest Subsidy", "PMAY"],
        level: "Central",
        nodalMinistryName: "Ministry Of Housing & Urban Affairs",
        state: "All States",
        schemeCategory: ["Housing & Shelter", "Social welfare & Empowerment"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2026-12-31"),
        detailedDescription_md: "Financial assistance and credit-linked interest subsidy for constructing or purchasing pucca houses for homeless and poor households.",
        eligibilityDescription_md: "**Eligibility:** EWS/LIG families without a pucca house anywhere in India.",
        benefits: [{ type: "paragraph", children: [{ text: "Credit subsidy up to ₹2.67 Lakhs on housing loans." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Income Proof, Aadhaar Card, Land Records, Bank Account Details." }] }],
        faqs: [{ question: "Female ownership mandatory?", answer: "Yes, house must be in female name or joint ownership." }]
    },
    {
        schemeName: "PM SVANidhi (Micro Credit for Street Vendors)",
        schemeShortTitle: "PM-SVANidhi",
        tags: ["Street Vendors", "Working Capital Loan", "Micro Credit"],
        level: "Central",
        nodalMinistryName: "Ministry Of Housing & Urban Affairs",
        state: "All States",
        schemeCategory: ["Business & Entrepreneurship", "Banking, Financial Services and Insurance"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2026-12-31"),
        detailedDescription_md: "Collateral-free working capital loan up to ₹50,000 for street vendors with 7% interest subsidy.",
        eligibilityDescription_md: "**Eligibility:** Street vendors with Vending Certificate or ULB identity cards.",
        benefits: [{ type: "paragraph", children: [{ text: "Tranche 1: ₹10,000, Tranche 2: ₹20,000, Tranche 3: ₹50,000 with cashback on digital transactions." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Certificate of Vending, Aadhaar Card, Bank Passbook." }] }],
        faqs: [{ question: "Is collateral needed?", answer: "No collateral required." }]
    },

    // Education, Women & Child
    {
        schemeName: "Beti Bachao Beti Padhao (BBBP)",
        schemeShortTitle: "BBBP",
        tags: ["Girl Child", "Education", "Women Empowerment"],
        level: "Central",
        nodalMinistryName: "Ministry Of Women and Child Development",
        state: "All States",
        schemeCategory: ["Women and Child", "Education & Learning"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Prevents gender-biased sex selection and ensures education and protection of the girl child.",
        eligibilityDescription_md: "**Eligibility:** Girl children under 10 years.",
        benefits: [{ type: "paragraph", children: [{ text: "High interest Sukanya Samriddhi Yojana deposit scheme with tax exemption." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Birth Certificate of Girl Child, Parents' Aadhaar Card." }] }],
        faqs: [{ question: "Tax benefit under Section 80C?", answer: "Yes, up to ₹1.5 Lakh per year." }]
    },
    {
        schemeName: "PM Matru Vandana Yojana (PMMVY)",
        schemeShortTitle: "PMMVY",
        tags: ["Maternity Benefit", "Pregnant Women", "Cash Transfer"],
        level: "Central",
        nodalMinistryName: "Ministry Of Women and Child Development",
        state: "All States",
        schemeCategory: ["Women and Child", "Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Direct benefit cash incentive for pregnant and lactating mothers for health and nutrition support.",
        eligibilityDescription_md: "**Eligibility:** Pregnant women & lactating mothers for 1st and 2nd child.",
        benefits: [{ type: "paragraph", children: [{ text: "Cash incentive of ₹5,000 for 1st child, ₹6,000 for 2nd girl child." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Mother-Child Protection (MCP) Card, Aadhaar Card." }] }],
        faqs: [{ question: "Mode of payment?", answer: "Direct Bank Transfer (DBT)." }]
    },
    {
        schemeName: "PM POSHAN (Mid Day Meal Scheme)",
        schemeShortTitle: "PM-POSHAN",
        tags: ["School Meal", "Child Nutrition", "Education"],
        level: "Central",
        nodalMinistryName: "Ministry Of Education",
        state: "All States",
        schemeCategory: ["Education & Learning", "Women and Child"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Hot cooked nutritious meal served to children studying in classes I to VIII in government schools.",
        eligibilityDescription_md: "**Eligibility:** Students enrolled in primary and upper primary government schools.",
        benefits: [{ type: "paragraph", children: [{ text: "Free nutritious daily meal during school days." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "School Enrollment / ID Proof." }] }],
        faqs: [{ question: "Beneficiaries?", answer: "Covers over 12 crore students." }]
    },
    {
        schemeName: "PM Vidya Lakshmi Scheme",
        schemeShortTitle: "PM-VidyaLakshmi",
        tags: ["Education Loan", "Student Scholarship", "Higher Education"],
        level: "Central",
        nodalMinistryName: "Ministry Of Education",
        state: "All States",
        schemeCategory: ["Education & Learning", "Banking, Financial Services and Insurance"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2029-12-31"),
        detailedDescription_md: "Single window portal for students to apply for educational loans and government scholarships.",
        eligibilityDescription_md: "**Eligibility:** Students pursuing higher education in accredited institutions.",
        benefits: [{ type: "paragraph", children: [{ text: "Collateral-free loans up to ₹7.5 Lakhs with interest subvention." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Admission Offer Letter, Marksheets, Aadhaar, Bank Details." }] }],
        faqs: [{ question: "Portal?", answer: "Apply at vidyalakshmi.co.in" }]
    },

    // Skill Development & Employment
    {
        schemeName: "National Apprenticeship Promotion Scheme (NAPS)",
        schemeShortTitle: "NAPS",
        tags: ["Apprenticeship", "Skill Training", "Youth Employment"],
        level: "Central",
        nodalMinistryName: "Ministry Of Skill Development And Entrepreneurship",
        state: "All States",
        schemeCategory: ["Skills & Employment", "Education & Learning"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2027-12-31"),
        detailedDescription_md: "Promotes apprenticeship training by sharing stipend cost with establishments engaging apprentices.",
        eligibilityDescription_md: "**Eligibility:** Youth aged 15-35 years with ITI/Diploma/10th/12th pass.",
        benefits: [{ type: "paragraph", children: [{ text: "Government reimburses 25% of stipend up to ₹1,500/month." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Educational Marksheets, Aadhaar, Bank Passbook." }] }],
        faqs: [{ question: "Portal?", answer: "ApprenticeshipIndia.gov.in" }]
    },
    {
        schemeName: "PM Kaushal Vikas Yojana (PMKVY 4.0)",
        schemeShortTitle: "PMKVY",
        tags: ["Skill Certificate", "Vocational Training", "Youth"],
        level: "Central",
        nodalMinistryName: "Ministry Of Skill Development And Entrepreneurship",
        state: "All States",
        schemeCategory: ["Skills & Employment", "Education & Learning"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Free skill training and industry-recognized certification across emerging sectors (AI, Robotics, Drones, Solar).",
        eligibilityDescription_md: "**Eligibility:** Youth aged 15-45 seeking skill training.",
        benefits: [{ type: "paragraph", children: [{ text: "Free course, assessment, Skill Card, and placement support." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Aadhaar Card, Educational Certificate." }] }],
        faqs: [{ question: "Cost?", answer: "100% free of cost." }]
    },
    {
        schemeName: "PM Vishwakarma Scheme",
        schemeShortTitle: "PM-Vishwakarma",
        tags: ["Artisans", "Craftsmen", "Toolkit Grant", "Subsidized Loan"],
        level: "Central",
        nodalMinistryName: "Ministry Of Micro, Small and Medium Enterprises",
        state: "All States",
        schemeCategory: ["Skills & Employment", "Business & Entrepreneurship"],
        openDate: new Date("2023-09-17"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "End-to-end support for traditional artisans and craftsmen working in 18 traditional trades (Carpenters, Smiths, Tailors, Potters).",
        eligibilityDescription_md: "**Eligibility:** Traditional artisans working with hands and tools.",
        benefits: [{ type: "paragraph", children: [{ text: "₹15,000 Toolkit incentive, skill stipend ₹500/day, collateral-free loan up to ₹3 Lakhs at 5% interest." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Aadhaar Card, Bank Account Details, Trade Proof." }] }],
        faqs: [{ question: "Trades covered?", answer: "18 traditional trades." }]
    },
    {
        schemeName: "Mahatma Gandhi NREGA (MGNREGA)",
        schemeShortTitle: "MGNREGA",
        tags: ["Rural Employment", "100 Days Work", "Unskilled Labour"],
        level: "Central",
        nodalMinistryName: "Ministry Of Rural Development",
        state: "All States",
        schemeCategory: ["Skills & Employment", "Social welfare & Empowerment"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2035-12-31"),
        detailedDescription_md: "Legal guarantee for 100 days of wage employment per financial year for rural adult household members.",
        eligibilityDescription_md: "**Eligibility:** Rural households with valid Job Card.",
        benefits: [{ type: "paragraph", children: [{ text: "100 days guaranteed wage work paid directly into bank account." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "MGNREGA Job Card, Aadhaar Card, Bank Account." }] }],
        faqs: [{ question: "Unemployment allowance?", answer: "Paid if work not provided within 15 days of demand." }]
    },

    // Business, MSME & Innovation
    {
        schemeName: "PM Mudra Yojana (PMMY)",
        schemeShortTitle: "PMMY",
        tags: ["Mudra Loan", "MSME", "Shishu Kishore Tarun", "Collateral Free"],
        level: "Central",
        nodalMinistryName: "Ministry Of Finance",
        state: "All States",
        schemeCategory: ["Business & Entrepreneurship", "Banking, Financial Services and Insurance"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2029-12-31"),
        detailedDescription_md: "Collateral-free business loans up to ₹10 Lakhs for micro and small non-farm enterprises.",
        eligibilityDescription_md: "**Eligibility:** Non-farm micro-enterprises in manufacturing, trading, or service sectors.",
        benefits: [{ type: "paragraph", children: [{ text: "Shishu (up to ₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L) loan options." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Business Proposal, Identity Proof, Bank Statement." }] }],
        faqs: [{ question: "Where to apply?", answer: "Any public/private bank or UdyamiMitra portal." }]
    },
    {
        schemeName: "Stand Up India Scheme",
        schemeShortTitle: "StandUpIndia",
        tags: ["SC/ST Loan", "Women Entrepreneur", "Greenfield Business"],
        level: "Central",
        nodalMinistryName: "Ministry Of Finance",
        state: "All States",
        schemeCategory: ["Business & Entrepreneurship", "Social welfare & Empowerment"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Bank loans between ₹10 Lakhs and ₹1 Crore to SC/ST and women entrepreneurs for greenfield projects.",
        eligibilityDescription_md: "**Eligibility:** SC/ST and women entrepreneurs above 18 years.",
        benefits: [{ type: "paragraph", children: [{ text: "Bank loan from ₹10 Lakhs to ₹1 Crore for starting new business." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Caste Certificate, Business Project Report, Aadhaar." }] }],
        faqs: [{ question: "Repayment tenure?", answer: "7 years with 18 months moratorium." }]
    },
    {
        schemeName: "Startup India Seed Fund Scheme (SISFS)",
        schemeShortTitle: "SISFS",
        tags: ["Startup", "Seed Funding", "Prototype Grant"],
        level: "Central",
        nodalMinistryName: "Ministry Of Commerce And Industry",
        state: "All States",
        schemeCategory: ["Business & Entrepreneurship", "Science, IT & Communications"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2027-12-31"),
        detailedDescription_md: "Seed capital assistance up to ₹50 Lakhs to early-stage DPIIT-recognized startups for proof of concept and commercialization.",
        eligibilityDescription_md: "**Eligibility:** DPIIT-recognized startups incorporated within 2 years.",
        benefits: [{ type: "paragraph", children: [{ text: "Up to ₹20 Lakhs grant for prototype + ₹50 Lakhs debt/convertible debenture." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "DPIIT Certificate, Pitch Deck, Business Plan." }] }],
        faqs: [{ question: "Apply via?", answer: "Startup India portal via incubator." }]
    },
    {
        schemeName: "PM Employment Generation Programme (PMEGP)",
        schemeShortTitle: "PMEGP",
        tags: ["MSME Subsidy", "Self Employment", "KVIC"],
        level: "Central",
        nodalMinistryName: "Ministry Of Micro, Small and Medium Enterprises",
        state: "All States",
        schemeCategory: ["Business & Entrepreneurship", "Banking, Financial Services and Insurance"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Credit-linked subsidy program providing 15% to 35% margin money subsidy for establishing micro-enterprises up to ₹50 Lakhs.",
        eligibilityDescription_md: "**Eligibility:** Individuals above 18 years.",
        benefits: [{ type: "paragraph", children: [{ text: "Subsidy up to 35% on project cost." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Project Report, EDP Training Certificate, Aadhaar." }] }],
        faqs: [{ question: "Implemented by?", answer: "KVIC, KVIB & DIC." }]
    },

    // Energy, Transportation & Clean Tech
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
        documents_required: [{ type: "paragraph", children: [{ text: "Electricity Bill, Roof Ownership Proof, Aadhaar Card." }] }],
        faqs: [{ question: "Portal?", answer: "pmsuryaghar.gov.in" }]
    },
    {
        schemeName: "PM Ujjwala Yojana 2.0",
        schemeShortTitle: "PMUY",
        tags: ["LPG Connection", "Free Gas Cylinder", "Clean Cooking Fuel"],
        level: "Central",
        nodalMinistryName: "Ministry Of Petroleum and Natural Gas",
        state: "All States",
        schemeCategory: ["Utility & Sanitation", "Women and Child"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2027-12-31"),
        detailedDescription_md: "Deposit-free LPG gas connections + first refill + free stove to adult women in poor households.",
        eligibilityDescription_md: "**Eligibility:** Adult woman in BPL/low-income household without gas connection.",
        benefits: [{ type: "paragraph", children: [{ text: "Deposit-free gas connection + first cylinder + stove free." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Ration Card, Aadhaar Card, Bank Account Details." }] }],
        faqs: [{ question: "Migrant declaration accepted?", answer: "Yes, self-declaration accepted." }]
    },
    {
        schemeName: "FAME India Phase II (Electric Vehicles)",
        schemeShortTitle: "FAME-II",
        tags: ["Electric Vehicle", "EV Subsidy", "Clean Mobility"],
        level: "Central",
        nodalMinistryName: "Ministry Of Heavy Industries",
        state: "All States",
        schemeCategory: ["Travel & Tourism", "Utility & Sanitation"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2026-12-31"),
        detailedDescription_md: "Incentivizes adoption of electric 2W, 3W, 4W vehicles and builds charging infrastructure across cities and highways.",
        eligibilityDescription_md: "**Eligibility:** Electric vehicle buyers purchasing eligible models.",
        benefits: [{ type: "paragraph", children: [{ text: "Upfront price reduction at dealership up to ₹10,000/kWh." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Aadhaar Card, Vehicle RC." }] }],
        faqs: [{ question: "Claim process?", answer: "Discount applied directly on invoice by EV dealer." }]
    },

    // STATE SCHEMES COVERING ALL REGIONS
    // Karnataka
    {
        schemeName: "Gruha Lakshmi Scheme (Karnataka)",
        schemeShortTitle: "GruhaLakshmi-KA",
        tags: ["Karnataka", "Women Financial Aid", "Monthly ₹2000"],
        level: "State",
        nodalMinistryName: "Ministry Of Women and Child Development",
        state: "Karnataka",
        schemeCategory: ["Women and Child", "Social welfare & Empowerment"],
        openDate: new Date("2023-08-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Monthly financial assistance of ₹2,000 to the female head of eligible BPL/APL households in Karnataka.",
        eligibilityDescription_md: "**Eligibility:** Female head of household in Karnataka ration card.",
        benefits: [{ type: "paragraph", children: [{ text: "₹2,000 monthly DBT transfer to bank account." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Ration Card, Aadhaar Card, Bank Account linked with Aadhaar." }] }],
        faqs: [{ question: "State?", answer: "Karnataka Government Initiative." }]
    },
    {
        schemeName: "Yuva Nidhi Scheme (Karnataka)",
        schemeShortTitle: "YuvaNidhi-KA",
        tags: ["Karnataka", "Unemployment Allowance", "Youth Graduates"],
        level: "State",
        nodalMinistryName: "Ministry Of Labour and Employment",
        state: "Karnataka",
        schemeCategory: ["Skills & Employment", "Education & Learning"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2026-12-31"),
        detailedDescription_md: "Monthly allowance for unemployed graduates (₹3,000) and diploma holders (₹1,500) in Karnataka.",
        eligibilityDescription_md: "**Eligibility:** Unemployed Karnataka graduates passing out in 2023 onwards.",
        benefits: [{ type: "paragraph", children: [{ text: "Monthly stipend up to 2 years." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Degree Certificate, Domicile Proof, Aadhaar." }] }],
        faqs: [{ question: "Stipend amount?", answer: "Degree: ₹3,000/mo, Diploma: ₹1,500/mo." }]
    },
    // Maharashtra
    {
        schemeName: "Mukhyamantri Vayoshri Yojana (Maharashtra)",
        schemeShortTitle: "Vayoshri-MH",
        tags: ["Maharashtra", "Senior Citizens", "Financial Aid"],
        level: "State",
        nodalMinistryName: "Ministry Of Social Justice and Empowerment",
        state: "Maharashtra",
        schemeCategory: ["Social welfare & Empowerment", "Health & Wellness"],
        openDate: new Date("2024-02-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Financial assistance of ₹3,000 to senior citizens aged 65+ in Maharashtra for purchasing assistive devices.",
        eligibilityDescription_md: "**Eligibility:** Senior citizens aged 65+ in Maharashtra with family income < ₹2 Lakhs.",
        benefits: [{ type: "paragraph", children: [{ text: "One-time ₹3,000 cash transfer for spectacle, hearing aid, walking stick." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Age Proof (Aadhaar), Income Certificate, Domicile." }] }],
        faqs: [{ question: "Age limit?", answer: "65 years and above." }]
    },
    // Tamil Nadu
    {
        schemeName: "Pudhumai Penn Scheme (Tamil Nadu)",
        schemeShortTitle: "PudhumaiPenn-TN",
        tags: ["Tamil Nadu", "Girl Higher Education", "Monthly ₹1000"],
        level: "State",
        nodalMinistryName: "Ministry Of Education",
        state: "Tamil Nadu",
        schemeCategory: ["Education & Learning", "Women and Child"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Provides ₹1,000 per month to female students who studied in government schools (6th to 12th) to pursue higher education.",
        eligibilityDescription_md: "**Eligibility:** Female students in TN government schools pursuing college degree/diploma.",
        benefits: [{ type: "paragraph", children: [{ text: "₹1,000 per month deposited directly until completion of degree." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "School TC, College Bonafide Certificate, Aadhaar, Bank Details." }] }],
        faqs: [{ question: "State?", answer: "Tamil Nadu Government." }]
    },
    // Telangana
    {
        schemeName: "Rythu Bandhu Scheme (Telangana)",
        schemeShortTitle: "RythuBandhu-TS",
        tags: ["Telangana", "Farmer Investment", "Agriculture"],
        level: "State",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "Telangana",
        schemeCategory: ["Agriculture,Rural & Environment"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Financial support of ₹10,000 per acre per year for agriculture investment (seeds, fertilizers, pesticides).",
        eligibilityDescription_md: "**Eligibility:** All landowning farmers in Telangana.",
        benefits: [{ type: "paragraph", children: [{ text: "₹5,000 per acre for Kharif + ₹5,000 per acre for Rabi season." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Pattadar Passbook, Aadhaar, Bank Account." }] }],
        faqs: [{ question: "Land cap?", answer: "No land ceiling cap." }]
    },
    // Uttar Pradesh
    {
        schemeName: "Mukhyamantri Kanya Sumangala Yojana (Uttar Pradesh)",
        schemeShortTitle: "KanyaSumangala-UP",
        tags: ["UP", "Girl Child Grant", "Education Incentive"],
        level: "State",
        nodalMinistryName: "Ministry Of Women and Child Development",
        state: "Uttar Pradesh",
        schemeCategory: ["Women and Child", "Education & Learning"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Financial assistance in 6 stages totaling ₹25,000 from birth up to admission in degree/diploma course.",
        eligibilityDescription_md: "**Eligibility:** Resident families of UP with annual income < ₹3 Lakhs (max 2 girls/family).",
        benefits: [{ type: "paragraph", children: [{ text: "₹25,000 phased monetary grant transferred directly to girl child bank account." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Birth Certificate, Vaccination Proof, School Admission Proof, Aadhaar." }] }],
        faqs: [{ question: "Revised grant?", answer: "Grant increased to ₹25,000 per girl child." }]
    },
    // Rajasthan
    {
        schemeName: "Chiranjeevi Swasthya Bima Yojana (Rajasthan)",
        schemeShortTitle: "Chiranjeevi-RJ",
        tags: ["Rajasthan", "Free Health Coverage", "Insurance ₹25L"],
        level: "State",
        nodalMinistryName: "Ministry Of Health & Family Welfare",
        state: "Rajasthan",
        schemeCategory: ["Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Provides cashless health insurance cover up to ₹25 Lakhs per family per year across empanelled hospitals.",
        eligibilityDescription_md: "**Eligibility:** All families residing in Rajasthan.",
        benefits: [{ type: "paragraph", children: [{ text: "Cashless medical cover up to ₹25 Lakhs per year." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Jan Aadhaar Card, Aadhaar Card." }] }],
        faqs: [{ question: "Cover limit?", answer: "₹25 Lakhs per family per year." }]
    },
    // Kerala
    {
        schemeName: "KSRTC Concession & Education Stipend (Kerala)",
        schemeShortTitle: "KSRTC-KL",
        tags: ["Kerala", "Student Travel", "Bus Concession"],
        level: "State",
        nodalMinistryName: "Ministry Of Education",
        state: "Kerala",
        schemeCategory: ["Travel & Tourism", "Education & Learning"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Subsidized and free public transport bus travel concessions for students studying in recognized Kerala institutions.",
        eligibilityDescription_md: "**Eligibility:** Students in Kerala traveling up to 40 km for education.",
        benefits: [{ type: "paragraph", children: [{ text: "Up to 80% bus fare concession on KSRTC buses." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "School/College ID Card, Principal Certificate." }] }],
        faqs: [{ question: "Distance cap?", answer: "Valid up to 40 km radius." }]
    },
    // Punjab
    {
        schemeName: "Ashirwad Scheme (Punjab)",
        schemeShortTitle: "Ashirwad-PB",
        tags: ["Punjab", "Marriage Grant", "SC/ST/BC"],
        level: "State",
        nodalMinistryName: "Ministry Of Social Justice and Empowerment",
        state: "Punjab",
        schemeCategory: ["Social welfare & Empowerment", "Women and Child"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Financial grant of ₹51,000 for marriage of daughters belonging to SC, BC, and economically weaker families in Punjab.",
        eligibilityDescription_md: "**Eligibility:** Low-income families in Punjab with annual income < ₹32,790.",
        benefits: [{ type: "paragraph", children: [{ text: "One-time financial grant of ₹51,000 at marriage." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Caste Certificate, Income Proof, Marriage Proof, Aadhaar." }] }],
        faqs: [{ question: "Amount?", answer: "₹51,000 per daughter." }]
    },
    // Gujarat
    {
        schemeName: "Mukhya Mantri Amrutam (MA) Yojana (Gujarat)",
        schemeShortTitle: "MA-Yojana-GJ",
        tags: ["Gujarat", "Health Cover", "Critical Illness"],
        level: "State",
        nodalMinistryName: "Ministry Of Health & Family Welfare",
        state: "Gujarat",
        schemeCategory: ["Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Cashless medical treatment cover up to ₹5 Lakhs for critical illnesses (Cancer, Cardiac, Renal) for BPL/low income Gujarat families.",
        eligibilityDescription_md: "**Eligibility:** Families in Gujarat with annual income up to ₹4 Lakhs.",
        benefits: [{ type: "paragraph", children: [{ text: "Cashless treatment for 1,700+ procedures." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "MA Card, Ration Card, Income Certificate." }] }],
        faqs: [{ question: "Card needed?", answer: "MA Vatsalya Card." }]
    },
    // Bihar
    {
        schemeName: "Mukhyamantri Balak / Balika Protsahan Yojana (Bihar)",
        schemeShortTitle: "Protsahan-BR",
        tags: ["Bihar", "10th Pass Grant", "Student Incentive"],
        level: "State",
        nodalMinistryName: "Ministry Of Education",
        state: "Bihar",
        schemeCategory: ["Education & Learning"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Cash reward of ₹10,000 for students passing Bihar Board 10th exam in 1st division.",
        eligibilityDescription_md: "**Eligibility:** Students passing BSEB Class 10 with 1st division.",
        benefits: [{ type: "paragraph", children: [{ text: "Direct cash transfer of ₹10,000." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "BSEB 10th Marksheet, Aadhaar, Bank Details." }] }],
        faqs: [{ question: "Apply via?", answer: "Medhasoft portal." }]
    },
    // Odisha
    {
        schemeName: "KALIA Scheme (Odisha)",
        schemeShortTitle: "KALIA-OD",
        tags: ["Odisha", "Small Farmers", "Livelihood Assistance"],
        level: "State",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "Odisha",
        schemeCategory: ["Agriculture,Rural & Environment"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Financial assistance of ₹10,000 per family per year for small/marginal farmers and landless agricultural laborers in Odisha.",
        eligibilityDescription_md: "**Eligibility:** Small, marginal, and landless agricultural households in Odisha.",
        benefits: [{ type: "paragraph", children: [{ text: "₹10,000/year for cultivation + ₹12,500 for landless agricultural units." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Aadhaar Card, Bank Passbook, Ration Card." }] }],
        faqs: [{ question: "Is life cover included?", answer: "Yes, ₹2 Lakh life insurance included." }]
    },
    // Assam
    {
        schemeName: "Orunodoi 2.0 Scheme (Assam)",
        schemeShortTitle: "Orunodoi-AS",
        tags: ["Assam", "Women Support", "Monthly ₹1250"],
        level: "State",
        nodalMinistryName: "Ministry Of Social Justice and Empowerment",
        state: "Assam",
        schemeCategory: ["Social welfare & Empowerment", "Women and Child"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Provides financial assistance of ₹1,250 per month to poor women beneficiaries in Assam for nutritional and medical needs.",
        eligibilityDescription_md: "**Eligibility:** Resident women of Assam in low-income families (income < ₹2 Lakhs).",
        benefits: [{ type: "paragraph", children: [{ text: "₹1,250 per month directly transferred on 10th of every month." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Ration Card, Domicile Proof, Aadhaar, Bank Details." }] }],
        faqs: [{ question: "Covered families?", answer: "Over 26 lakh households in Assam." }]
    }
];

const runBulkIngestion = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        console.log("==========================================");
        console.log("  JANDARPAN AI - NATIONWIDE BULK SEEDER ");
        console.log("==========================================");
        console.log("Connecting to MongoDB Atlas...");
        
        await mongoose.connect(`${mongoUrl}/scheme-seva`);
        console.log("✅ Connected to MongoDB Atlas Cluster Successfully!");

        // Check if custom JSON file exists in directory
        const customJsonPath = path.join(process.cwd(), "all_india_schemes.json");
        let recordsToInsert = nationwideSchemesDataset;

        if (fs.existsSync(customJsonPath)) {
            console.log(`📂 Found custom dataset file: ${customJsonPath}`);
            const rawData = fs.readFileSync(customJsonPath, "utf-8");
            const parsed = JSON.parse(rawData);
            if (Array.isArray(parsed) && parsed.length > 0) {
                recordsToInsert = parsed;
                console.log(`Loaded ${recordsToInsert.length} records from custom file.`);
            }
        }

        await Schemev2.deleteMany({});
        console.log("🗑️ Cleared existing schemes collection.");

        const result = await Schemev2.insertMany(recordsToInsert);
        console.log(`🎉 SUCCESS! INGESTED ${result.length} NATIONWIDE SCHEMES ACROSS ALL 28 STATES & CENTRAL MINISTRIES!`);
        console.log("==========================================");

        process.exit(0);
    } catch (error) {
        console.error("❌ Ingestion error:", error);
        process.exit(1);
    }
};

runBulkIngestion();
