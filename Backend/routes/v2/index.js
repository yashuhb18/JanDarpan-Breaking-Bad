import express from "express";
import schemesRoutes from "./schemes.routes.js";
import schemeAiRoutes from "./schemev2.ai.routes.js";
import projectRoutes from "./project.routes.js";
import reportRoutes from "./report.routes.js";
import pilRoutes from "./pil.routes.js";
import fraudRoutes from "./fraudEngine.routes.js";
import blockchainRoutes from "./blockchain.routes.js";

const router = express.Router();

router.use("/fraud", fraudRoutes);
router.use("/schemes", schemeAiRoutes);
router.use("/schemes", schemesRoutes);
router.use("/projects", projectRoutes);
router.use("/reports", reportRoutes);
router.use("/pil", pilRoutes);
router.use("/blockchain", blockchainRoutes);

router.use("/", (req, res) => {
    res.send("API V2 Running");
});

export default router;
