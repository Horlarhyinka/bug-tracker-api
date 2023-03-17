import express, { Application } from "express";
import errorHandlers from "./config/errors";
import log from "./utils/logger";
errorHandlers()
import {connect} from "mongoose";
import dotenv from "dotenv";
import useMiddleWares from "./startup/middlewares";
import useRouters from "./startup/routes";

dotenv.config()
const app: Application = express()
const port: number = Number(process.env.PORT!)

useMiddleWares(app)
useRouters(app)

const start = async() =>{
    try {
        await connect(process.env.DB_URI!)
        log("info","connected to db")
        app.listen(port,()=>log("info","app running " + process.env.NODE_ENV + " mode on port " + port))
    } catch (error) {
        log("error","application failed to start: "+ error)
        process.exit(1)
    }
}

start()
