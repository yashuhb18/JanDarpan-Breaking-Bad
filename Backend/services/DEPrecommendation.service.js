import { GoogleGenerativeAI } from "@google/generative-ai";
import Scheme from "../models/scheme.model.js";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateRecommendations = async (userProfile) => {
    try {
        // If API key is not valid, return basic recommendations
        if (!process.env.GEMINI_API_KEY) {
            const schemes = await Scheme.find({
                'category.gender': userProfile.gender,
                'category.incomeGroup': userProfile.incomeGroup
            }).limit(5);
            return schemes;
        }

        // Get all schemes
        const allSchemes = await Scheme.find();

        // Create prompt for Gemini
        const prompt = `
        Given a user with the following profile:
        - Age: ${userProfile.age}
        - Gender: ${userProfile.gender}
        - Income Group: ${userProfile.incomeGroup}
        - Interests: ${userProfile.interests.join(', ')}

        And the following schemes:
        ${JSON.stringify(allSchemes, null, 2)}

        Please analyze and recommend the top 5 most relevant schemes for this user. 
        Consider eligibility criteria, benefits, and user's profile.
        Return only the scheme IDs in an array.
        `;

        // Generate recommendations using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recommendedSchemeIds = JSON.parse(response.text());

        // Fetch full scheme details
        const recommendedSchemes = await Scheme.find({
            '_id': { $in: recommendedSchemeIds }
        });

        return recommendedSchemes;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        // Fallback to basic filtering if AI recommendations fail
        const schemes = await Scheme.find({
            'category.gender': userProfile.gender,
            'category.incomeGroup': userProfile.incomeGroup
        }).limit(5);
        return schemes;
    }
};
