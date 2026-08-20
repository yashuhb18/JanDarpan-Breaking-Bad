import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schemeSchema = new Schema({
    openDate: {
        type: Date,
        default: null
    },
    closeDate: {
        type: Date,
        default: null
    },
    state: {
        type: String,
        default: null
    },
    nodalMinistryName: {
        type: Object,  // Since it can be null or {label: "string"}
        default: null
    },
    schemeName: {
        type: String,
        required: true
    },
    schemeShortTitle: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    level: {
        type: String,
        enum: ['Central', 'State', 'State/ UT']
    },
    schemeCategory: [{
        type: String
    }],
    references: [{
        title: String,
        url: String
    }],
    detailedDescription_md: {
        type: String,
        default: ""
    },
    applicationProcess: [{
        type: Object  // Keeping it flexible as per original structure
    }],
    eligibilityDescription_md: {
        type: String,
        default: ""
    },
    benefits: [{
        type: Object  // Keeping it flexible as per original structure
    }],
    faqs: [{
        question: String,
        answer: String
    }],
    documents_required: [{
        type: Object
    }]
}, {
    timestamps: true
});

// Add pagination plugin
schemeSchema.plugin(mongoosePaginate);

// Create indexes for common queries
schemeSchema.index({ schemeName: 'text', schemeShortTitle: 'text' });
schemeSchema.index({ state: 1, level: 1 });
schemeSchema.index({ tags: 1 });
schemeSchema.index({ schemeCategory: 1 });

const Schemev2 = model('Schemesv2', schemeSchema);

export default Schemev2;
