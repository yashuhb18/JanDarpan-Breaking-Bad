import { getStatutoryCitations } from "./legalNlpService.js";

/**
 * Local Ollama Model Provider (GLM-4 / Llama-3 / Phi-3)
 * Connects to local Ollama instance running at http://localhost:11434
 */
export const generateOllamaLegalPil = async (report, upvoteCount = 52, modelName = "glm4") => {
    const fallbackCitations = getStatutoryCitations(report.category);

    try {
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

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: modelName,
                prompt: prompt,
                stream: false
            })
        });

        if (response.ok) {
            const data = await response.json();
            const text = data.response;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    isAiGenerated: true,
                    modelName: `Local ${modelName.toUpperCase()} AI Engine (Ollama)`,
                    citations: {
                        ...fallbackCitations,
                        ...parsed
                    }
                };
            }
        }
    } catch (err) {
        console.warn("Local Ollama API unavailable, falling back to Legislative NLP Engine:", err.message);
    }

    return {
        isAiGenerated: false,
        modelName: "Legislative-BERT Rule Engine",
        citations: fallbackCitations
    };
};
