import express from "express";
import usersRoutes from "./users.routes.js";
import schemesRoutes from "./schemes.routes.js";
import recommendRoutes from "./recommendations.routes.js";
import chatbotRoutes from "./chatbot.routes.js";
import whatsappRoutes from "../whatsappRoutes.js";
import voiceRoutes from "./voiceRoutes.js";

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/schemes", schemesRoutes);
router.use("/recommendations", recommendRoutes);
router.use("/chatbot", chatbotRoutes);
router.use("/whatsapp", whatsappRoutes);
router.use("/voice", voiceRoutes);
router.use("/", (req, res) => {
    res.send("API V1 Running");
});

export default router;
