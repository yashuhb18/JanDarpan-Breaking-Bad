import express from "express";
import { generatePilForReport, getLegalNoticeStatus } from "../../controllers/pil.controller.js";

const router = express.Router();

router.get("/generate-pil/:reportId", generatePilForReport);
router.get("/status/:reportId", getLegalNoticeStatus);

export default router;
