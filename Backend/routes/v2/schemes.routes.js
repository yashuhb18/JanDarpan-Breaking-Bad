import express from "express";
const router = express.Router();
import { getAllSchemes, getSchemeById, getSchemeByCategory, getFilteredSchemes, saveFavoriteSchemes, removeFavoriteSchemes, getFavoriteSchemes } from "../../controllers/schemev2.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

router.get("/get-all-schemes", getAllSchemes);
router.get("/get-scheme-by-id/:id", getSchemeById);
router.get("/get-scheme-by-category/:category", getSchemeByCategory);
router.get("/get-filtered-schemes", getFilteredSchemes);
router.post("/save-favorite-schemes", verifyJWT, saveFavoriteSchemes);
router.delete("/remove-favorite-schemes/:id", verifyJWT, removeFavoriteSchemes);
router.get("/get-favorite-schemes", verifyJWT, getFavoriteSchemes);

export default router;
