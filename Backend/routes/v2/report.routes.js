import express from "express";
import { submitReport, getAllReports, upvoteReport, updateReportStatus } from "../../controllers/report.controller.js";
import { uploadImageToCloudinary } from "../../controllers/upload.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { verifyJWT, optionalVerifyJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/upload-photo", upload.single("photo"), uploadImageToCloudinary);
router.post("/submit-report", optionalVerifyJWT, submitReport);
router.get("/get-all-reports", getAllReports);
router.post("/upvote-report/:id", upvoteReport);
router.patch("/update-report-status/:id", verifyJWT, updateReportStatus);

export default router;
