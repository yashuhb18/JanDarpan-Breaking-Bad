import express from "express";
import { getSchemeResponse, getTtsAudio } from "../../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/scheme-response", getSchemeResponse);
router.post("/chat", getSchemeResponse);
router.get("/tts", getTtsAudio);

export default router;
