import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import Sesssion from "express-session";
import MongoStore from "connect-mongo";
dotenv.config()


export default (app: Application) =>{
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(Sesssion({
    store: MongoStore.create({mongoUrl: process.env.DB_URI!}),
    secret: process.env.APP_SECRET!,
    resave: true,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session()) 
}
