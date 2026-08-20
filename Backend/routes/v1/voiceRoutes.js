import express from "express";
import https from "https";

const router = express.Router();

// Helper to fetch a single TTS audio chunk as a Buffer
const fetchAudioChunk = (textChunk, lang) => {
    return new Promise((resolve, reject) => {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textChunk)}&tl=${lang}&client=tw-ob`;
        const options = {
            headers: {
                'User-Agent': 'Stagefright/1.2 (Linux;Android 5.0)'
            }
        };

        https.get(url, options, (res) => {
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', err => reject(err));
        }).on('error', err => reject(err));
    });
};

router.get("/tts", async (req, res) => {
    try {
        const text = req.query.text || "Namaskara";
        const lang = req.query.lang || "kn";

        // Split text into chunks of max 150 characters to stay safely within Google TTS limits
        const sentences = text.split(/(?<=[.!?,|;\n])/g).map(s => s.trim()).filter(Boolean);
        let chunks = [];
        let currentChunk = "";

        for (const sentence of sentences) {
            if ((currentChunk + " " + sentence).length > 140) {
                if (currentChunk) chunks.push(currentChunk);
                currentChunk = sentence;
            } else {
                currentChunk = currentChunk ? currentChunk + " " + sentence : sentence;
            }
        }
        if (currentChunk) chunks.push(currentChunk);

        if (chunks.length === 0) chunks = [text.slice(0, 140)];

        console.log(`[VOICE TTS] Generating ${chunks.length} audio chunks for lang=${lang}...`);

        res.setHeader("Content-Type", "audio/mpeg");

        for (const chunk of chunks) {
            try {
                const buffer = await fetchAudioChunk(chunk, lang);
                res.write(buffer);
            } catch (chunkErr) {
                console.error("Chunk fetch error:", chunkErr);
            }
        }

        res.end();
    } catch (err) {
        console.error("Voice Proxy Error:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
});

export default router;
