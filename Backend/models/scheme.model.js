import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    objective: {
        type: String,
        required: true,
        trim: true,
    },
    keyFeatures: {
        type: [String], // Array of strings
        required: true,
    },
    howToApply: {
        online: {
            type: String,
            trim: true,
        },
        offline: {
            type: String,
            trim: true,
        },
    },
    documentsRequired: {
        type: [String], // Array of strings
        required: true,
    },
    tags: {
        type: [String], // Array of strings (e.g., "education", "health")
        required: true,
    },
    level: {
        type: String,
        enum: ["central", "state"], // Only "central" or "state" allowed
        required: true,
    },
    ministry: {
        type: String,
        trim: true,
        required: true,
    },
    category: {
        incomeGroup: {
            type: [String],
            enum: ["EWS", "General", "OBC", "SC", "ST"], // Allowed income groups
            required: true,
        },
        gender: {
            type: [String],
            enum: ["male", "female", "other"], // Allowed genders
            required: true,
        },
    },
    state: {
        type: [String], // Array of states (e.g., "Maharashtra", "Bihar") or "all" for central schemes
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set to current date
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically set to current date
    },
});

// Update the `updatedAt` field before saving
schemeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Scheme = mongoose.model('Scheme', schemeSchema);


export default Scheme;