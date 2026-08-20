import { generateSchemeResponse } from "../services/chatbot.service.js";
import Schemev2 from "../models/schemev2.model.js";

export const getSchemeResponse = async (req, res) => {
    try {
        const { schemeId, question, language = 'en' } = req.body;

        if (!question) {
            return res.status(400).json({ 
                message: 'Question is required' 
            });
        }

        let scheme = null;
        if (schemeId && schemeId !== 'general') {
            try {
                scheme = await Schemev2.findById(schemeId);
            } catch (err) {
                console.warn("Invalid Scheme ID format, proceeding with general context");
            }
        }

        if (!scheme) {
            scheme = {
                schemeName: "JanDarpan Civic & Government Welfare Assistant",
                schemeShortTitle: "JanDarpan AI",
                state: "All India",
                detailedDescription_md: "JanDarpan AI provides scheme discovery, civic issue auditing, and pre-litigation High Court PIL notice generation.",
                eligibilityDescription_md: "Available for all citizens of India seeking government welfare schemes or civic transparency."
            };
        }

        const response = await generateSchemeResponse(scheme, question, language);
        res.status(200).json({ response });
    } catch (error) {
        console.error('Error in chatbot response:', error);
        res.status(500).json({ 
            message: 'Error generating response' 
        });
    }
};

/**
 * Universal Multilingual TTS Audio Stream Controller
 * Generates and streams native MP3 audio for Kannada, Tamil, Hindi, Telugu, Punjabi, Marathi, English
 */
export const getTtsAudio = async (req, res) => {
    try {
        const text = req.query.text || "Namaste";
        const lang = req.query.lang || "en";

        // Strip emojis and symbols
        const cleanText = text
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
            .replace(/\[.*?\]/g, '')
            .replace(/[""''`]/g, '')
            .trim()
            .substring(0, 200);

        const encodedText = encodeURIComponent(cleanText);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${lang}&client=tw-ob`;

        const audioRes = await fetch(ttsUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!audioRes.ok) {
            return res.status(500).send("TTS audio stream error");
        }

        const arrayBuffer = await audioRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.set({
            "Content-Type": "audio/mpeg",
            "Content-Length": buffer.length,
            "Cache-Control": "public, max-age=86400"
        });

        res.send(buffer);
    } catch (err) {
        console.error("Backend TTS proxy error:", err);
        res.status(500).send("Error streaming TTS audio");
    }
};
