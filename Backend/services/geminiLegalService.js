import { GoogleGenerativeAI } from "@google/generative-ai";
import { getStatutoryCitations } from "./legalNlpService.js";

const apiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mock_key'
    ? process.env.GEMINI_API_KEY
    : null;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Uses Google Gemini LLM (gemini-pro) to generate dynamic, court-admissible PIL arguments and legal notices
 */
export const generateGeminiLegalPil = async (report, upvoteCount = 52) => {
    const fallbackCitations = getStatutoryCitations(report.category);

    if (!genAI) {
        return {
            isAiGenerated: false,
            modelName: "Legislative-BERT Rule Engine",
            citations: fallbackCitations
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
You are a senior Constitutional & Administrative Law Advocate in India drafting a Public Interest Litigation (PIL) Petition under Article 226 for the High Court.
Civic Complaint Details:
- Issue Title: ${report.title}
- Category: ${report.category}
- City: ${report.cityName}
- Description: ${report.description}
- Community Support: ${upvoteCount} verified citizen upvotes

Tasks:
1. Identify exact Indian Penal Code (IPC) sections, Municipal Corporation Act provisions, and Supreme Court precedent citations.
2. Formulate 3 distinct legal grounds under Article 21 (Right to Life / Safe Environment).
3. Draft a formal Prayer for a Writ of Mandamus.

Return ONLY a JSON object formatted exactly as:
{
    "primaryAct": "Act & Section",
    "constitutionalArticle": "Article name",
    "ipcSections": ["Sec 1", "Sec 2"],
    "municipalAct": "Act provision",
    "precedents": ["Precedent 1", "Precedent 2"],
    "legalNoticeTitle": "Title of Pre-Litigation e-Notice",
    "mandamusWritGround": "Core Mandamus argument",
    "aiLegalSummary": "2-sentence legal opinion"
}
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                isAiGenerated: true,
                modelName: "Google Gemini Legal-Pro LLM",
                citations: {
                    ...fallbackCitations,
                    ...parsed
                }
            };
        }
    } catch (err) {
        console.warn("Gemini Legal LLM Error, falling back to Statutory Engine:", err.message);
    }

    return {
        isAiGenerated: false,
        modelName: "Legislative-BERT Rule Engine",
        citations: fallbackCitations
    };
};
