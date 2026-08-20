import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Schemev2 from "./models/schemev2.model.js";

// Fix Windows Node.js SRV DNS lookup issues
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const baseSchemes = [
    // Education & Learning
    {
        schemeName: "PM POSHAN (Mid Day Meal Scheme)",
        schemeShortTitle: "PM-POSHAN",
        tags: ["Education", "Nutrition", "Children", "School"],
        level: "Central",
        nodalMinistryName: "Ministry Of Education",
        state: "All States",
        schemeCategory: ["Education & Learning", "Women and Child"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "PM POSHAN provides one hot cooked meal to children studying in classes I to VIII in government and government-aided schools to improve nutritional status and school enrollment.",
        eligibilityDescription_md: "**Eligibility:** All students enrolled in primary and upper primary classes in eligible schools.",
        benefits: [{ type: "paragraph", children: [{ text: "Free nutritious cooked meals on every school day." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "School Enrollment / ID Proof." }] }],
        faqs: [{ question: "Who is covered?", answer: "Over 12 crore children across India." }]
    },
    {
        schemeName: "PM Vidya Lakshmi Higher Education Loan Scheme",
        schemeShortTitle: "PM-VidyaLakshmi",
        tags: ["Education", "Education Loan", "Higher Education", "Students"],
        level: "Central",
        nodalMinistryName: "Ministry Of Education",
        state: "All States",
        schemeCategory: ["Education & Learning", "Banking, Financial Services and Insurance"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2029-12-31"),
        detailedDescription_md: "A single window portal for students to seek educational loans and scholarships provided by banks.",
        eligibilityDescription_md: "**Eligibility:** Students pursuing higher education in recognized Indian institutions.",
        benefits: [{ type: "paragraph", children: [{ text: "Collateral-free education loans up to ₹7.5 Lakhs with interest subvention." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Admission Letter, Marksheets, Aadhaar, Bank Details." }] }],
        faqs: [{ question: "How to apply?", answer: "Apply directly on Vidya Lakshmi portal." }]
    },
    {
        schemeName: "Pradhan Mantri Research Fellowship (PMRF)",
        schemeShortTitle: "PMRF",
        tags: ["Research", "PhD", "Science", "Fellowship"],
        level: "Central",
        nodalMinistryName: "Ministry Of Education",
        state: "All States",
        schemeCategory: ["Education & Learning", "Science, IT & Communications"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2027-12-31"),
        detailedDescription_md: "PMRF offers direct admission to PhD programs in premier institutions (IITs, IISc, IISERs) with attractive fellowship amounts.",
        eligibilityDescription_md: "**Eligibility:** Top performing GATE or CGPA graduates in science and technology streams.",
        benefits: [{ type: "paragraph", children: [{ text: "Monthly fellowship of ₹70,000 to ₹80,000 plus ₹2 Lakh annual research grant." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "GATE Scorecard, Degree Certificate, Research Proposal." }] }],
        faqs: [{ question: "Duration?", answer: "Up to 5 years." }]
    },
    {
        schemeName: "PM Shri Schools Scheme",
        schemeShortTitle: "PM-SHRI",
        tags: ["Education", "School Infrastructure", "NEP 2020"],
        level: "Central",
        nodalMinistryName: "Ministry Of Education",
        state: "All States",
        schemeCategory: ["Education & Learning", "Transport & Infrastructure Sports & Culture"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Upgrades 14,500 schools across India to showcase the implementation of the National Education Policy 2020.",
        eligibilityDescription_md: "**Eligibility:** Government and local body schools across states.",
        benefits: [{ type: "paragraph", children: [{ text: "Modern labs, smart classrooms, green infrastructure, and digital learning tools." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Schooludise Code, State Approval." }] }],
        faqs: [{ question: "Goal?", answer: "Exemplar schools for NEP 2020." }]
    },

    // Healthcare & Wellness
    {
        schemeName: "Pradhan Mantri National Dialysis Program (PMNDP)",
        schemeShortTitle: "PMNDP",
        tags: ["Healthcare", "Dialysis", "Kidney Care", "BPL"],
        level: "Central",
        nodalMinistryName: "Ministry Of Health & Family Welfare",
        state: "All States",
        schemeCategory: ["Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Provides free hemodialysis services to BPL patients across district hospitals in India.",
        eligibilityDescription_md: "**Eligibility:** BPL patients requiring renal replacement therapy.",
        benefits: [{ type: "paragraph", children: [{ text: "100% free dialysis services at district hospital dialysis centers." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "BPL Card, Doctor Prescription, Aadhaar." }] }],
        faqs: [{ question: "Cost?", answer: "Free for BPL, subsidized for non-BPL." }]
    },
    {
        schemeName: "PM Bharatiya Janaushadhi Pariyojana (PMBJP)",
        schemeShortTitle: "PMBJP",
        tags: ["Medicine", "Generic Drugs", "Healthcare", "Affordable"],
        level: "Central",
        nodalMinistryName: "Ministry Of Health & Family Welfare",
        state: "All States",
        schemeCategory: ["Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Provides quality generic medicines at affordable prices (50% to 90% cheaper than branded drugs) through Jan Aushadhi Kendras.",
        eligibilityDescription_md: "**Eligibility:** Open to all citizens of India.",
        benefits: [{ type: "paragraph", children: [{ text: "High quality generic drugs and surgical items at up to 90% discount." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Doctor's Prescription." }] }],
        faqs: [{ question: "How many kendras exist?", answer: "Over 10,000 centers across India." }]
    },
    {
        schemeName: "PM Matru Vandana Yojana (PMMVY)",
        schemeShortTitle: "PMMVY",
        tags: ["Maternal Health", "Women", "Pregnant Women", "Cash Transfer"],
        level: "Central",
        nodalMinistryName: "Ministry Of Women and Child Development",
        state: "All States",
        schemeCategory: ["Women and Child", "Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Maternity benefit cash incentive program for pregnant women and lactating mothers for first and second live child.",
        eligibilityDescription_md: "**Eligibility:** Pregnant women & lactating mothers excluding government employees.",
        benefits: [{ type: "paragraph", children: [{ text: "Financial incentive of ₹5,000 in direct bank transfers for first child, ₹6,000 for second girl child." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "MCP Card, Aadhaar Card, Bank Passbook." }] }],
        faqs: [{ question: "Mode of transfer?", answer: "Direct Benefit Transfer (DBT)." }]
    },

    // Agriculture, Rural & Environment
    {
        schemeName: "PM Fasal Bima Yojana (PMFBY)",
        schemeShortTitle: "PMFBY",
        tags: ["Crop Insurance", "Agriculture", "Farmers", "Weather Protection"],
        level: "Central",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "All States",
        schemeCategory: ["Agriculture,Rural & Environment"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Comprehensive crop insurance scheme protecting farmers against non-preventable natural risks from pre-sowing to post-harvest.",
        eligibilityDescription_md: "**Eligibility:** All farmers growing notified crops in notified areas including sharecroppers.",
        benefits: [{ type: "paragraph", children: [{ text: "Lowest premium rates (1.5% for Rabi, 2.0% for Kharif) with full sum insured payout for crop damage." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Land Sowing Certificate, Land Records, Aadhaar, Bank Details." }] }],
        faqs: [{ question: "How to claim?", answer: "Notify within 72 hours of localized calamity on PMFBY portal." }]
    },
    {
        schemeName: "PM Krishi Sinchayee Yojana (PMKSY)",
        schemeShortTitle: "PMKSY",
        tags: ["Irrigation", "Per Drop More Crop", "Agriculture", "Drip Irrigation"],
        level: "Central",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "All States",
        schemeCategory: ["Agriculture,Rural & Environment"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Enhance physical access of water on farm and expand cultivable area under assured irrigation (Har Khet Ko Pani).",
        eligibilityDescription_md: "**Eligibility:** Farmers possessing cultivable agricultural land.",
        benefits: [{ type: "paragraph", children: [{ text: "Up to 55% subsidy on drip and sprinkler micro-irrigation systems." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Land Ownership Proof, Soil Test Report, Aadhaar." }] }],
        faqs: [{ question: "What is Per Drop More Crop?", answer: "Promoting precision water management technology." }]
    },
    {
        schemeName: "Kisan Credit Card (KCC) Scheme",
        schemeShortTitle: "KCC",
        tags: ["Agriculture Credit", "Farmers Loan", "Subsidized Interest"],
        level: "Central",
        nodalMinistryName: "Ministry Of Agriculture and Farmers Welfare",
        state: "All States",
        schemeCategory: ["Agriculture,Rural & Environment", "Banking, Financial Services and Insurance"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Provides adequate and timely credit to farmers for agricultural requirements and allied activities at subsidized interest rates.",
        eligibilityDescription_md: "**Eligibility:** Farmers, tenant farmers, sharecroppers, and SHGs.",
        benefits: [{ type: "paragraph", children: [{ text: "Revolving credit line up to ₹3 Lakhs at effective interest rate of 4% per annum." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Land Documents, Crop Plan, Aadhaar, PAN Card." }] }],
        faqs: [{ question: "Is collateral required up to ₹1.6 Lakhs?", answer: "No collateral required up to ₹1.6 Lakhs." }]
    },

    // Employment & Skills
    {
        schemeName: "Mahatma Gandhi NREGA (MGNREGA)",
        schemeShortTitle: "MGNREGA",
        tags: ["Rural Employment", "100 Days Work", "Wages", "Manual Work"],
        level: "Central",
        nodalMinistryName: "Ministry Of Rural Development",
        state: "All States",
        schemeCategory: ["Skills & Employment", "Social welfare & Empowerment"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2035-12-31"),
        detailedDescription_md: "Legal guarantee for 100 days of employment in a financial year to adult members of any rural household willing to do public work-related unskilled manual work.",
        eligibilityDescription_md: "**Eligibility:** Rural households holding valid MGNREGA Job Card.",
        benefits: [{ type: "paragraph", children: [{ text: "Guaranteed 100 days wage employment per year paid directly to bank account within 15 days." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Job Card, Aadhaar Card, Bank Account Details." }] }],
        faqs: [{ question: "What if work is not provided?", answer: "Unemployment allowance is payable by the state government." }]
    },
    {
        schemeName: "PM Kaushal Vikas Yojana (PMKVY 4.0)",
        schemeShortTitle: "PMKVY",
        tags: ["Skill Training", "Youth", "Certification", "Industry Skills"],
        level: "Central",
        nodalMinistryName: "Ministry Of Skill Development And Entrepreneurship",
        state: "All States",
        schemeCategory: ["Skills & Employment", "Education & Learning"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Flagship skill certification scheme encouraging youth to take up industry-relevant skill training for better livelihoods.",
        eligibilityDescription_md: "**Eligibility:** Indian youth aged 15 to 45 years seeking skill training.",
        benefits: [{ type: "paragraph", children: [{ text: "Free skill training, assessment, certification, and placement assistance." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Aadhaar Card, Educational Proof." }] }],
        faqs: [{ question: "Are courses online or offline?", answer: "Both classroom training and Industry 4.0 online modules." }]
    },

    // Business & Entrepreneurship
    {
        schemeName: "PM Employment Generation Programme (PMEGP)",
        schemeShortTitle: "PMEGP",
        tags: ["MSME Loan", "Subsidy", "Self Employment", "New Enterprise"],
        level: "Central",
        nodalMinistryName: "Ministry Of Micro, Small and Medium Enterprises",
        state: "All States",
        schemeCategory: ["Business & Entrepreneurship", "Banking, Financial Services and Insurance"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Credit-linked subsidy program aimed at generating self-employment opportunities through establishment of micro-enterprises.",
        eligibilityDescription_md: "**Eligibility:** Individuals above 18 years. Project cost up to ₹50 Lakhs for manufacturing and ₹20 Lakhs for service sector.",
        benefits: [{ type: "paragraph", children: [{ text: "Margin money subsidy ranging from 15% to 35% of project cost." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Project Report, EDP Training Certificate, Caste Certificate, Aadhaar." }] }],
        faqs: [{ question: "Who administers PMEGP?", answer: "KVIC at national level and KVIB/DIC at state level." }]
    },
    {
        schemeName: "Startup India Seed Fund Scheme (SISFS)",
        schemeShortTitle: "SISFS",
        tags: ["Startup", "Seed Capital", "Funding", "Innovation"],
        level: "Central",
        nodalMinistryName: "Ministry Of Commerce And Industry",
        state: "All States",
        schemeCategory: ["Business & Entrepreneurship", "Science, IT & Communications"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2027-12-31"),
        detailedDescription_md: "Provides financial assistance to early-stage startups for proof of concept, prototype development, product trials, and market entry.",
        eligibilityDescription_md: "**Eligibility:** DPIIT-recognized startups incorporated not more than 2 years ago.",
        benefits: [{ type: "paragraph", children: [{ text: "Grants up to ₹20 Lakhs for proof of concept & debt financing up to ₹50 Lakhs for commercialization." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "DPIIT Recognition Certificate, Pitch Deck, Financial Projections." }] }],
        faqs: [{ question: "How are funds disbursed?", answer: "Disbursed via selected empanelled incubators across India." }]
    },

    // Energy, Transportation & Digital India
    {
        schemeName: "FAME India Phase II (Electric Vehicles)",
        schemeShortTitle: "FAME-II",
        tags: ["EV Subsidy", "Electric Vehicle", "Clean Energy", "Transport"],
        level: "Central",
        nodalMinistryName: "Ministry Of Heavy Industries",
        state: "All States",
        schemeCategory: ["Travel & Tourism", "Energy", "Utility & Sanitation"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2026-12-31"),
        detailedDescription_md: "Encourages adoption of electric and hybrid vehicles by offering upfront purchase incentives and building EV charging infrastructure.",
        eligibilityDescription_md: "**Eligibility:** Buyers purchasing eligible 2W, 3W, 4W electric vehicles.",
        benefits: [{ type: "paragraph", children: [{ text: "Direct price discount at dealership up to ₹10,000 per kWh of battery capacity." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Aadhaar Card, Vehicle Registration Proof." }] }],
        faqs: [{ question: "Is discount automatic?", answer: "Yes, deducted directly on invoice by OEM dealer." }]
    },
    {
        schemeName: "Digital India Bhashini Mission",
        schemeShortTitle: "BHASHINI",
        tags: ["AI", "Regional Languages", "Digital India", "Translation"],
        level: "Central",
        nodalMinistryName: "Ministry Of Science And Technology",
        state: "All States",
        schemeCategory: ["Science, IT & Communications", "Digital India"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "National Language Translation Mission enabling citizens to access digital services and internet content in 22 official Indian languages.",
        eligibilityDescription_md: "**Eligibility:** Developers, citizens, startups, and government entities.",
        benefits: [{ type: "paragraph", children: [{ text: "Open AI models, speech-to-text, translation APIs in Kannada, Hindi, Tamil, Telugu, etc." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Developer registration on Bhashini Portal." }] }],
        faqs: [{ question: "Languages supported?", answer: "22 scheduled Indian languages." }]
    },

    // Social Welfare & Public Safety
    {
        schemeName: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
        schemeShortTitle: "PMJJBY",
        tags: ["Life Insurance", "Term Insurance", "Social Security"],
        level: "Central",
        nodalMinistryName: "Ministry Of Finance",
        state: "All States",
        schemeCategory: ["Banking, Financial Services and Insurance", "Social welfare & Empowerment"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2035-12-31"),
        detailedDescription_md: "One-year renewable life insurance scheme offering ₹2 Lakh cover for death due to any reason at a low premium of ₹436/year.",
        eligibilityDescription_md: "**Eligibility:** Bank account holders aged 18 to 50 years.",
        benefits: [{ type: "paragraph", children: [{ text: "₹2,000,000 paid to nominee in event of death of insured person." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Savings Bank Account, Consent for auto-debit." }] }],
        faqs: [{ question: "Is medical exam required?", answer: "No medical examination needed." }]
    },
    {
        schemeName: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
        schemeShortTitle: "PMSBY",
        tags: ["Accident Insurance", "Disability Insurance", "Low Cost"],
        level: "Central",
        nodalMinistryName: "Ministry Of Finance",
        state: "All States",
        schemeCategory: ["Banking, Financial Services and Insurance", "Public Safety,Law & Justice"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2035-12-31"),
        detailedDescription_md: "Accidental insurance scheme offering ₹2 Lakh cover for accidental death or permanent disability for just ₹20 per year.",
        eligibilityDescription_md: "**Eligibility:** Bank account holders aged 18 to 70 years.",
        benefits: [{ type: "paragraph", children: [{ text: "₹2 Lakh for accidental death / total disability, ₹1 Lakh for partial disability." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Bank Savings Account with auto-debit consent." }] }],
        faqs: [{ question: "Annual premium?", answer: "₹20 per year auto-debited in May." }]
    },

    // State Schemes (Karnataka, Maharashtra, UP, Delhi, Tamil Nadu)
    {
        schemeName: "Gruha Lakshmi Scheme (Karnataka)",
        schemeShortTitle: "GruhaLakshmi-KA",
        tags: ["Karnataka", "Women", "Monthly Financial Support"],
        level: "State",
        nodalMinistryName: "Ministry Of Women and Child Development",
        state: "Karnataka",
        schemeCategory: ["Women and Child", "Social welfare & Empowerment"],
        openDate: new Date("2023-08-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Provides financial assistance of ₹2,000 per month to the female head of eligible households in Karnataka.",
        eligibilityDescription_md: "**Eligibility:** Woman designated as head of household in BPL/APL Antyodaya ration card in Karnataka.",
        benefits: [{ type: "paragraph", children: [{ text: "₹2,000 transferred monthly via DBT to bank account." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Ration Card, Aadhaar Card, Bank Account Details linked with Aadhaar." }] }],
        faqs: [{ question: "State?", answer: "Karnataka Government Initiative." }]
    },
    {
        schemeName: "Yuva Nidhi Scheme (Karnataka)",
        schemeShortTitle: "YuvaNidhi-KA",
        tags: ["Unemployment Allowance", "Karnataka", "Graduates", "Diploma"],
        level: "State",
        nodalMinistryName: "Ministry Of Labour and Employment",
        state: "Karnataka",
        schemeCategory: ["Skills & Employment", "Education & Learning"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2026-12-31"),
        detailedDescription_md: "Unemployment financial assistance for degree and diploma holders in Karnataka who remain unemployed after graduation.",
        eligibilityDescription_md: "**Eligibility:** Graduates (₹3,000/mo) & Diploma holders (₹1,500/mo) passing out in 2023 onwards, unemployed for 6 months.",
        benefits: [{ type: "paragraph", children: [{ text: "Monthly stipend up to 2 years or until getting employed." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Degree/Diploma Certificate, Domicile Proof, Aadhaar." }] }],
        faqs: [{ question: "Duration?", answer: "Maximum 24 months." }]
    },
    {
        schemeName: "Ladli Behna Yojana (Madhya Pradesh)",
        schemeShortTitle: "LadliBehna-MP",
        tags: ["Madhya Pradesh", "Women", "Monthly Support"],
        level: "State",
        nodalMinistryName: "Ministry Of Women and Child Development",
        state: "Madhya Pradesh",
        schemeCategory: ["Women and Child", "Social welfare & Empowerment"],
        openDate: new Date("2023-03-01"),
        closeDate: new Date("2028-12-31"),
        detailedDescription_md: "Financial empowerment program providing ₹1,250 per month to married/widowed/destitute women in MP.",
        eligibilityDescription_md: "**Eligibility:** Women aged 21-60 years residing in MP with family income < ₹2.5 Lakhs.",
        benefits: [{ type: "paragraph", children: [{ text: "₹1,250 monthly DBT assistance." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Samagra ID, Aadhaar Card, Bank Account Details." }] }],
        faqs: [{ question: "Is eKYC mandatory?", answer: "Yes, Samagra eKYC is mandatory." }]
    },
    {
        schemeName: "Kanyashree Prakalpa (West Bengal)",
        schemeShortTitle: "Kanyashree-WB",
        tags: ["West Bengal", "Girl Education", "Conditional Cash"],
        level: "State",
        nodalMinistryName: "Ministry Of Women and Child Development",
        state: "West Bengal",
        schemeCategory: ["Women and Child", "Education & Learning"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Improves status and wellbeing of girls by incentivizing higher education and delaying child marriage.",
        eligibilityDescription_md: "**Eligibility:** Girls aged 13-18 enrolled in classes VIII-XII in West Bengal.",
        benefits: [{ type: "paragraph", children: [{ text: "Annual scholarship K1 ₹1,000 + one-time grant K2 ₹25,000 at age 18." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Unmarried Declaration, School Certificate, Bank Account." }] }],
        faqs: [{ question: "UN Award winner?", answer: "Yes, awarded 1st Prize in UN Public Service Award 2017." }]
    },
    {
        schemeName: "Chief Minister Comprehensive Health Insurance (Tamil Nadu)",
        schemeShortTitle: "CMCHIS-TN",
        tags: ["Tamil Nadu", "Health Insurance", "Family Protection"],
        level: "State",
        nodalMinistryName: "Ministry Of Health & Family Welfare",
        state: "Tamil Nadu",
        schemeCategory: ["Health & Wellness"],
        openDate: new Date("2023-01-01"),
        closeDate: new Date("2030-12-31"),
        detailedDescription_md: "Provides cashless health coverage up to ₹5 Lakhs per family per year for empanelled treatments in Tamil Nadu.",
        eligibilityDescription_md: "**Eligibility:** Resident families of Tamil Nadu with annual income below ₹1.2 Lakhs.",
        benefits: [{ type: "paragraph", children: [{ text: "Cashless medical and surgical treatments across 1,000+ hospitals." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Smart Ration Card, Income Certificate, Aadhaar." }] }],
        faqs: [{ question: "Toll free number?", answer: "1800 425 3993." }]
    },
    {
        schemeName: "Mukhyamantri Abhyudaya Yojana (Uttar Pradesh)",
        schemeShortTitle: "Abhyudaya-UP",
        tags: ["Free Coaching", "UP", "UPSC", "JEE", "NEET"],
        level: "State",
        nodalMinistryName: "Ministry Of Education",
        state: "Uttar Pradesh",
        schemeCategory: ["Education & Learning", "Skills & Employment"],
        openDate: new Date("2024-01-01"),
        closeDate: new Date("2027-12-31"),
        detailedDescription_md: "Free coaching classes by IAS/IPS/PCS officers for competitive exams (UPSC, NEET, JEE, NDA, CDS) for underprivileged students.",
        eligibilityDescription_md: "**Eligibility:** Permanent residents of UP appearing for competitive exams.",
        benefits: [{ type: "paragraph", children: [{ text: "Free offline/online coaching, study material, tablet distribution to meritorious students." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Aadhaar Card, Domicile Proof, Educational Certificates." }] }],
        faqs: [{ question: "Is entrance exam required?", answer: "Yes, selection via online entrance test." }]
    },
    {
        schemeName: "Delhi Solar Policy 2024 (Zero Electricity Bill)",
        schemeShortTitle: "DelhiSolarPolicy",
        tags: ["Delhi", "Rooftop Solar", "Zero Bill", "Generation Support"],
        level: "State",
        nodalMinistryName: "Ministry Of New and Renewable Energy",
        state: "Delhi",
        schemeCategory: ["Utility & Sanitation", "Science, IT & Communications"],
        openDate: new Date("2024-03-01"),
        closeDate: new Date("2027-12-31"),
        detailedDescription_md: "Delhi state policy aiming to achieve zero electricity bills for residential consumers installing rooftop solar panels while earning ₹3/unit generated.",
        eligibilityDescription_md: "**Eligibility:** Domestic electricity consumers in NCT of Delhi.",
        benefits: [{ type: "paragraph", children: [{ text: "Generation Based Incentive (GBI) of ₹3/unit for 5 years + 100% electricity bill waiver." }] }],
        documents_required: [{ type: "paragraph", children: [{ text: "Delhi Discom CA Number, Ownership Proof, Aadhaar Card." }] }],
        faqs: [{ question: "Payback period?", answer: "Approximately 3.5 years." }]
    }
];

const seedAll = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(`${mongoUrl}/scheme-seva`);
        console.log("Connected to MongoDB Atlas successfully!");

        await Schemev2.deleteMany({});
        console.log("Cleared existing schemes collection...");

        const inserted = await Schemev2.insertMany(baseSchemes);
        console.log(`🚀 SUCCESSFULLY SEEDED ${inserted.length} REAL GOVERNMENT SCHEMES INTO MONGO DB ATLAS!`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedAll();
