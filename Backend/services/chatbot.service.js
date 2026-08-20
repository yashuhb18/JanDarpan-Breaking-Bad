import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mock_key'
    ? process.env.GEMINI_API_KEY
    : null;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * JanDarpan Pure LLM AI Service (Local Ollama GLM-4 & Llama-3 Priority)
 * Combines Universal Knowledge with Platform-Specific JanDarpan Capabilities
 */
export const generateSchemeResponse = async (scheme, question, language = 'en') => {
    const langFull = language === 'hi' ? 'Hindi (हिंदी)'
        : language === 'kn' ? 'Kannada (ಕನ್ನಡ)'
        : language === 'ta' ? 'Tamil (தமிழ்)'
        : language === 'te' ? 'Telugu (తెలుగు)'
        : language === 'pa' ? 'Punjabi (ਪੰਜਾਬੀ)'
        : language === 'mr' ? 'Marathi (मराठी)'
        : 'English';

    const prompt = `You are JanDarpan AI, the official AI assistant for the JanDarpan Civic Audit & Scheme Discovery Portal.

JanDarpan Platform Features:
1. Scheme Discovery ('SCHEMES' page): 2,000+ Central and State welfare schemes matched by age, income, and category.
2. Civic Issue Auditing ('REPORT CIVIC ISSUE' page): Citizens upload photo proof of damaged roads, potholes, or drainage leaks with city tagging.
3. Auto-PIL Legal Notice Engine: If a civic complaint remains unresolved for 7 days, JanDarpan automatically drafts a High Court Pre-Litigation Notice under Article 226 of the Constitution of India with IPC and Municipal Act citations.
4. Infrastructure Transparency ('PROJECT MAP' page): View live government project budgets, deadlines, and contractor delay alerts.

User Question: "${question}"
Target Language: ${langFull}

Instructions:
1. Respond ONLY in ${langFull}.
2. Provide a specific answer combining universal knowledge with relevant JanDarpan features (2-3 concise sentences).
3. Do NOT use generic placeholder text. Be conversational and empathetic.`;

    // 1. Local Ollama (GLM-4 / Llama-3) Priority
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

        console.log(`[JanDarpan AI] Querying local model: ${targetModel}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 55000);

        const ollamaRes = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: targetModel,
                prompt: prompt,
                stream: false,
                options: {
                    num_predict: 100,
                    temperature: 0.3
                }
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (ollamaRes.ok) {
            const data = await ollamaRes.json();
            if (data.response && data.response.trim().length > 5) {
                console.log(`[JanDarpan AI] Success from ${targetModel}`);
                return data.response.trim();
            }
        }
    } catch (ollamaErr) {
        console.warn("[JanDarpan AI] Ollama call warning:", ollamaErr.message);
    }

    // 2. Google Gemini Pro
    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            if (response.text()) return response.text().trim();
        } catch (geminiErr) {
            console.warn("[JanDarpan AI] Gemini API skipped:", geminiErr.message);
        }
    }

    // 3. Factual Platform Contextual Engine
    const q = question.toLowerCase().trim();

    if (q.includes("complain") || q.includes("report") || q.includes("pothole") || q.includes("road") || q.includes("water") || q.includes("issue") || q.includes("work")) {
        const complaintMap = {
            hi: "जनदर्पण पर शिकायत दर्ज करने के लिए 'REPORT CIVIC ISSUE' पृष्ठ पर जाएं और फोटो के साथ विवरण दर्ज करें। यदि 7 दिनों में कार्रवाई नहीं होती है, तो हमारी प्रणाली स्वतः हाई कोर्ट प्री-लिटिगेशन ई-नोटिस जारी कर देती है!",
            kn: "ಜನದರ್ಪಣದಲ್ಲಿ ದೂರು ಸಲ್ಲಿಸಲು 'REPORT CIVIC ISSUE' ಪುಟಕ್ಕೆ ಹೋಗಿ ಫೋಟೋದೊಂದಿಗೆ ದೂರು ಸಲ್ಲಿಸಿ. 7 ದಿನಗಳಲ್ಲಿ ಪರಿಹಾರ ಸಿಗದಿದ್ದರೆ, ನಮ್ಮ ವ್ಯವಸ್ಥೆಯು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಹೈಕೋರ್ಟ್ ಲೀಗಲ್ ನೋಟಿಸ್ ಸಿದ್ಧಪಡಿಸುತ್ತದೆ!",
            ta: "புகார் பதிவு செய்ய 'REPORT CIVIC ISSUE' பக்கத்திற்கு சென்று புகைப்படத்துடன் புகாரளிக்கவும். 7 நாட்களில் நடவடிக்கை எடுக்கப்படவில்லை என்றால், உயர் நீதிமன்ற சட்டப்பூர்வ நோட்டீஸ் தயாரிக்கப்படும்!",
            te: "ఫిర్యాదు నమోదు చేయడానికి 'REPORT CIVIC ISSUE' పేజీకి వెళ్లి సమస్య ఫోటో అప్‌లోడ్ చేయండి. 7 రోజుల్లో పరిష్కరించకపోతే లీగಲ್ నోటీస్ జనరేట్ అవుతుంది!",
            en: "To file a complaint on JanDarpan: Go to 'REPORT CIVIC ISSUE', upload photo proof of the damaged road or facility, and submit. If unresolved in 7 days, JanDarpan auto-drafts a High Court Pre-Litigation Legal Notice under Article 226!"
        };
        return complaintMap[language] || complaintMap.en;
    }

    if (q.includes("farmer") || q.includes("kisan") || q.includes(" किसान") || q.includes("ರೈತ") || q.includes("விவசாயி")) {
        const farmerMap = {
            hi: "किसानों के लिए मुख्य योजनाएं हैं: PM-KISAN (₹6,000 वार्षिक सम्मान निधि), किसान क्रेडिट कार्ड (KCC - 4% कम ब्याज ऋण), और फसल बीमा योजना। 'SCHEMES' पृष्ठ पर विवरण देखें!",
            kn: "ರೈತರಿಗಾಗಿ ಪ್ರಮುಖ ಯೋಜನೆಗಳು: PM-KISAN (ವರ್ಷಕ್ಕೆ ₹6,000), ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (ಕಡಿಮೆ ಬಡ್ಡಿದರದ ಸಾಲ), ಮತ್ತು ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ. 'SCHEMES' ಪುಟ ಪರಿಶೀಲಿಸಿ!",
            ta: "விவசாயிகளுக்கான திட்டங்கள்: PM-KISAN (ஆண்டுக்கு ₹6,000), கிசான் கிரெடிட் கார்டு, மற்றும் பயிர் காப்பீட்டு திட்டம். SCHEMES பக்கத்தில் பார்க்கவும்!",
            te: "రైతుల కోసం పథకాలు: PM-KISAN (సంవత్సరానికి ₹6,000), కిసాన్ క్రెడిట్ కార్డ్, మరియు పంట భీమా. SCHEMES పేజీ చూడండి!",
            en: "Top farmer welfare schemes available on JanDarpan: 1) PM-KISAN (₹6,000 direct cash transfer), 2) Kisan Credit Card (4% interest loan), 3) PM Fasal Bima Crop Insurance. Head to the 'SCHEMES' page to apply!"
        };
        return farmerMap[language] || farmerMap.en;
    }

    const universalResponse = {
        hi: `जनदर्पण AI पर आप 2,000+ सरकारी योजनाओं की खोज कर सकते हैं और नागरिक शिकायतों की लाइव फोटो रिपोर्ट दर्ज कर सकते हैं!`,
        kn: `ಜನದರ್ಪಣ AI ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೀವು 2,000+ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಬಹುದು ಮತ್ತು ದೂರುಗಳನ್ನು ಸಲ್ಲಿಸಬಹುದು!`,
        ta: `ஜனதர்பன் AI போர்ட்டலில் 2,000+ அரசு திட்டங்களை கண்டறியலாம் மற்றும் புகார்களை பதிவு செய்யலாம்!`,
        te: `జన్‌దర్పణ్ AI పోర్టల్‌లో 2,000+ ప్రభుత్వ పథకాలను శోధించవచ్చు!`,
        en: `On JanDarpan AI, you can discover 2,000+ government welfare schemes matched to your age and income, or submit geo-tagged civic complaint reports.`
    };

    return universalResponse[language] || universalResponse.en;
};
