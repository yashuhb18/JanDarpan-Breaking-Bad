import express from "express";
import v1ApiRoutes from "./v1/index.js";
import v2ApiRoutes from "./v2/index.js";

const router = express.Router();

router.use("/v1", v1ApiRoutes);
router.use("/v2", v2ApiRoutes);

export default router;
