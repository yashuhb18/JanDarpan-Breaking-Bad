import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mock_key'
    ? process.env.GEMINI_API_KEY
    : null;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * GLM-4 Conversational Scheme Discovery & Checklist Parser
 */
export const parseConversationalSchemeSearch = async (userQuery) => {
    const prompt = `You are GLM-4 AI parsing an Indian citizen's conversational query into a structured JSON filter object for government schemes.

User Query: "${userQuery}"

Available Categories:
["Women and Child", "Utility & Sanitation", "Social welfare & Empowerment", "Skills & Employment", "Housing & Shelter", "Health & Wellness", "Education & Learning", "Business & Entrepreneurship", "Banking, Financial Services and Insurance", "Agriculture,Rural & Environment"]

Return ONLY a valid raw JSON object formatted exactly as:
{
    "state": "State Name if mentioned, else empty string",
    "category": "One exact category from list above if matched, else empty string",
    "searchKeyword": "1-2 keywords like farmer, scholarship, pension",
    "gender": "Male or Female or empty string",
    "incomeGroup": "EWS or General or OBC or SC or ST or empty string",
    "summaryText": "1 short sentence explaining extracted profile"
}`;

    // 1. Local Ollama GLM-4 / Llama-3 Execution
    try {
        let targetModel = "glm4:latest";
        const tagsRes = await fetch("http://localhost:11434/api/tags");
        if (tagsRes.ok) {
            const tagsData = await tagsRes.json();
            if (tagsData.models && tagsData.models.length > 0) {
                const foundGlm = tagsData.models.find(m => m.name.includes("glm4"));
                const foundLlama = tagsData.models.find(m => m.name.includes("llama3"));
                targetModel = foundGlm ? foundGlm.name : (foundLlama ? foundLlama.name : tagsData.models[0].name);
            }
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 45000);

        const ollamaRes = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: targetModel,
                prompt: prompt,
                stream: false,
                options: { num_predict: 120, temperature: 0.1 }
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (ollamaRes.ok) {
            const data = await ollamaRes.json();
            const rawText = data.response?.trim();
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
    } catch (e) {
        console.warn("Local Ollama parse error, fallback to Rule Parser:", e.message);
    }

    // Rule-based NLP Parser Fallback
    const q = userQuery.toLowerCase();
    let category = "";
    if (q.includes("farm") || q.includes("kisan") || q.includes("crop") || q.includes("agri") || q.includes("रैत")) {
        category = "Agriculture,Rural & Environment";
    } else if (q.includes("student") || q.includes("school") || q.includes("college") || q.includes("study") || q.includes("scholarship")) {
        category = "Education & Learning";
    } else if (q.includes("women") || q.includes("mother") || q.includes("girl") || q.includes("maternity")) {
        category = "Women and Child";
    } else if (q.includes("health") || q.includes("hospital") || q.includes("medical") || q.includes("insurance")) {
        category = "Health & Wellness";
    } else if (q.includes("house") || q.includes("home") || q.includes("shelter")) {
        category = "Housing & Shelter";
    }

    let state = "";
    const statesList = ["Karnataka", "Tamil Nadu", "Maharashtra", "Uttar Pradesh", "Bihar", "Kerala", "Punjab", "Gujarat", "Delhi", "Telangana", "Andhra Pradesh"];
    for (const s of statesList) {
        if (q.includes(s.toLowerCase())) {
            state = s;
            break;
        }
    }

    return {
        state: state,
        category: category,
        searchKeyword: userQuery.split(" ")[0] || "",
        gender: q.includes("female") || q.includes("woman") ? "Female" : "",
        incomeGroup: "",
        summaryText: `Parsed profile for query: "${userQuery}"`
    };
};

/**
 * Generate Step-by-Step Native Application Checklist
 */
export const generateSchemeChecklist = async (scheme, language = 'en') => {
    const langFull = language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'ta' ? 'Tamil' : 'English';

    return {
        schemeName: scheme?.schemeName || "Welfare Initiative",
        documentsRequired: [
            "Aadhaar Card (Linked with Bank Account)",
            "Income Certificate / Ration Card",
            "Domicile / Resident Certificate",
            "Recent Passport Size Photograph",
            "Bank Passbook with IFSC Code"
        ],
        stepByStepGuide: [
            `1. Visit the official portal or your local Gram Panchayat / CSC Kendra.`,
            `2. Verify your age and income eligibility matching criteria.`,
            `3. Fill out the application form with your Aadhaar and Bank account details.`,
            `4. Upload required documents and note down your Application Reference Number.`,
            `5. Track your Direct Benefit Transfer (DBT) status on JanDarpan.`
        ],
        officialPortalUrl: scheme?.officialWebsite || "https://myscheme.gov.in"
    };
};
