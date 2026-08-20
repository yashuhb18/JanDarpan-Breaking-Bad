import express from "express";
import { getPersonalizedRecommendations } from "../../controllers/recommendation.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/personalized", verifyJWT, getPersonalizedRecommendations);

export default router;
