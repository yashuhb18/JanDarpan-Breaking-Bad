import express from "express";
import { getAllProjects, getProjectById, createProject } from "../../controllers/project.controller.js";

const router = express.Router();

router.get("/get-all-projects", getAllProjects);
router.post("/create-project", createProject);
router.get("/get-project-by-id/:id", getProjectById);

export default router;
