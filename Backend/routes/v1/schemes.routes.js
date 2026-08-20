import express from "express";
const router = express.Router();
import { createScheme, getAllSchemes, getSchemeFiltered, getSchemeById } from "../../controllers/scheme.controller.js";


// Example product routes

router.route("/create-scheme").post(createScheme);
router.route("/get-all-schemes").get(getAllSchemes);
router.route("/get-scheme-filtered").get(getSchemeFiltered);
router.route("/get-scheme-by-id/:id").get(getSchemeById);


export default router;
