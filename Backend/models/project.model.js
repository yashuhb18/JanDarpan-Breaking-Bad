import mongoose from "mongoose";

const spendingEntrySchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ["Cement", "Steel", "Labor", "Machinery & Equipment", "Asphalt & Paving", "Sanitary & Piping", "Other"],
        required: true
    },
    itemName: { type: String, required: true },
    amount: { type: Number, required: true },
    invoicePhoto: { type: String, default: "" },
    date: { type: Date, default: Date.now }
});

const milestoneSchema = new mongoose.Schema({
    milestoneTitle: { type: String, required: true },
    claimedAmount: { type: Number, required: true },
    contractorPhoto: { type: String, required: true },
    contractorClaimDate: { type: Date, default: Date.now },
    aiVerdict: {
        type: String,
        enum: ["MATCH", "PARTIAL MATCH", "MISMATCH", "PENDING_AUDIT"],
        default: "PENDING_AUDIT"
    },
    aiPercentageDone: { type: Number, default: 0 },
    aiExplanation: { type: String, default: "" },
    citizenPhotoMatched: { type: String, default: "" },
    paymentStatus: {
        type: String,
        enum: ["PENDING_REVIEW", "BLOCKED_BY_AI", "APPROVED", "REJECTED"],
        default: "PENDING_REVIEW"
    },
    officerDecisionDate: { type: Date },
    officerOverrideReason: { type: String, default: "" }
});

const trancheReleaseSchema = new mongoose.Schema({
    trancheNumber: { type: Number, required: true },
    amountReleased: { type: Number, required: true },
    dateReleased: { type: Date, default: Date.now },
    releasedByOfficer: { type: String, default: "Officer R. Patel" },
    note: { type: String, default: "" }
});

const auditLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    actor: { type: String, required: true }, // "CONTRACTOR", "CITIZEN", "AI_AUDITOR", "GOVT_OFFICER"
    actionText: { type: String, required: true },
    statusType: { type: String, enum: ["INFO", "SUCCESS", "WARNING", "DANGER"], default: "INFO" }
});

// ⛓️ Blockchain Immutable Hash Chain Entry
const blockchainHashSchema = new mongoose.Schema({
    txType: {
        type: String,
        enum: ["SANCTION", "TRANCHE_RELEASE", "SPENDING", "AI_AUDIT", "FUND_FREEZE", "MILESTONE_CLAIM"],
        required: true
    },
    dataHash: { type: String, required: true },         // SHA-256 hash of transaction data
    previousHash: { type: String, required: true },     // Previous hash in chain (genesis for first)
    timestamp: { type: Date, default: Date.now },
    blockNumber: { type: Number, required: true },       // Sequential block number in chain
    rawDataSnapshot: { type: String, default: "" },      // First 200 chars of hashed data
    polygonTxHash: { type: String, default: null },      // Polygon Amoy testnet tx hash (if on-chain)
    isOnChain: { type: Boolean, default: false }         // Whether hash was submitted to Polygon
});

const projectSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: true,
            trim: true
        },
        department: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        budgetAllocated: {
            type: Number,
            required: true
        },
        budgetSpent: {
            type: Number,
            default: 0
        },
        progressPercentage: {
            type: Number,
            default: 0
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        targetCompletionDate: {
            type: Date,
            default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        status: {
            type: String,
            enum: ["ON_TRACK", "DELAYED", "CRITICAL_DELAY", "COMPLETED", "FUND_FROZEN_AI_AUDIT"],
            default: "ON_TRACK"
        },
        contractorName: {
            type: String,
            default: "Sharma Infratech Pvt Ltd"
        },
        contractorScore: {
            type: Number,
            default: 85 // Honesty Score Percentage (0-100%)
        },
        officerName: {
            type: String,
            default: "Officer R. Patel (Executive Engineer)"
        },
        officerScore: {
            type: Number,
            default: 92 // Transparency Rating (0-100%)
        },
        description: {
            type: String,
            default: ""
        },

        // 💰 MONEY TRAIL METRICS & LEDGER
        totalReleasedToAgent: { type: Number, default: 0 },
        totalClaimedSpent: { type: Number, default: 0 },
        citizenVerifiedWorkPercent: { type: Number, default: 100 },
        financialGapAmount: { type: Number, default: 0 },
        financialGapPercent: { type: Number, default: 0 },
        isFundFrozen: { type: Boolean, default: false },
        legalNoticeIssued: { type: Boolean, default: false },

        trancheReleases: [trancheReleaseSchema],
        spendingLedger: [spendingEntrySchema],
        milestones: [milestoneSchema],
        auditLogs: [auditLogSchema],
        blockchainHashes: [blockchainHashSchema]  // ⛓️ Immutable hash chain
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
