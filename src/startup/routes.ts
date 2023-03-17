import { Application } from "express";
import userRouter from "../routes/user"
import authMiddleware from "../middlewares/auth";
import projectRouter from "../routes/project";
import notFound from "../routes/not-found";

export default (app: Application) =>{
    app.use("/api/v1/auth", userRouter)
    app.use(authMiddleware)
    app.use("/api/v1/projects", projectRouter)
    app.use(notFound)
}

