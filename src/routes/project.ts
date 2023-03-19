import { Router } from "express";
const router = Router();
import ObjectId from "../middlewares/objectid";
import * as projects from "../controllers/project";


router.get("/", projects.getProjects)
router.post("/", projects.addProject)
router.use("/:id", ObjectId)
router.delete("/:id", projects.removeProject)
router.get("/:id", projects.getProject)
router.put("/:id", projects.updateProject)
router.put("/:id/bugs/", projects.addBug)
router.get("/:id/bugs/", projects.getBugs)
router.get("/:projectId/bugs/:id", ObjectId, projects.getBug)
router.put("/:projectId/bugs/:id", ObjectId, projects.updateBug)
router.patch("/:projectId/bugs/:id", ObjectId, projects.resolveBug)
router.delete("/:projectId/bugs/:id", ObjectId, projects.removeBug)




export default router