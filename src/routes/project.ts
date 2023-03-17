import { Router } from "express";
const router = Router();
import ObjectId from "../middlewares/objectid";
import * as projects from "../controllers/project";


router.get("/", projects.getProjects)
router.post("/", projects.addProject)
router.use("/:id", ObjectId)
router.use("/:projectId", ObjectId)
router.delete("/:id", projects.removeProject)
router.get("/:id", projects.getProject)
router.patch("/:id", projects.updateProject)
router.put("/:id/bugs/", projects.addBug)
router.get("/:id/bugs/", projects.getBugs)
router.get("/:projectId/bugs/:id",projects.getBug)
router.patch("/:projectId/bugs/:id", projects.updateBug)
router.put("/:projectId/bugs/:id", projects.resolveBug)
router.delete("/:projectId/bugs/:id", projects.removeBug)




export default router