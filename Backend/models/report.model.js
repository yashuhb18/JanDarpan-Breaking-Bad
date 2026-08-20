import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            enum: [
                "Substandard Public Construction",
                "Delayed Roadwork & Potholes",
                "Water Supply / Drainage Leakage",
                "Street Light / Energy Issue",
                "School / Hospital Facility Maintenance",
                "Duplicate Beneficiary / Welfare Fraud",
                "General Civic Complaint"
            ]
        },
        description: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            default: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=800"
        },
        cityName: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            default: 12.9716
        },
        longitude: {
            type: Number,
            default: 77.5946
        },
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        upvotesCount: {
            type: Number,
            default: 1
        },
        status: {
            type: String,
            enum: ["SUBMITTED", "UNDER_INVESTIGATION", "VERIFIED", "ENOTICE_ISSUED", "RESOLVED"],
            default: "SUBMITTED"
        }
    },
    { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
