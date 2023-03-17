import User, { User_int } from "../models/user";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchasync";
import {MongooseError} from "mongoose";
import { validateUser } from "../utils/validators";
import * as responseHandler from "../utils/response-handlers";

export const login = catchAsync(async(req: Request, res: Response) =>{
    const {email, password} = req.body
    if(!email || !password) return responseHandler.sendDepencyRequired(res, "email and password")
        //api level validation
        const validated = validateUser({...req.body})
        let returnString: string = ""

    if(validated.error){
        validated.error.details.forEach((details:{message: string}) =>{
            let message = details.message
            message = message.slice(0, message.indexOf(":"))
            returnString += ` ${message} `
        })
        return res.status(400).json({message: returnString})
    }

    const user = await User.findOne({email}).populate("projects")
    if(!user) return responseHandler.sendResourceNotFound(res, "user")
    const verifiedPassword = await user.verifyPassword(password)
    if(!verifiedPassword)return res.status(401).json({message: "incorrect password"})
    const token = user.genToken()
    res.status(200).json({user: {user: user.email, projects: user.projects}, token: token})
})

export const register = catchAsync(async(req: Request, res: Response) =>{
    const {email, password} = req.body
    //api level validation
    const validated = validateUser({...req.body})
        let returnString: string = ""
    if(validated.error){
        validated.error.details.forEach((details:{message: string}) =>{
            let message = details.message
            message = message.slice(0, message.indexOf(":"))
            returnString += ` ${message} `
        })
        return res.status(400).json({message: returnString})
    }
    if(!email || !password) return responseHandler.sendDepencyRequired(res, "email and password")
    try{
        const user = await User.create({email, password})
        if(!user)return responseHandler.sendServerFailed(res, "retister")
        const token = user.genToken()
        return res.status(201).json({user: {email: user.email, projects: user.projects}, token})
    }catch(ex: MongooseError | any){
        //handle duplicate email error
        if(ex.code === 11000)return res.status(401).json({message: "email is taken"})
        //handle other mongoose validation errors
        if(ex._message?.toLowerCase()?.includes("validation failed")){
            let returnString: string = ""
            Object.keys(ex.errors).forEach((err: string) =>{
                let errObj = ex.errors[err]
                returnString += ` ${errObj.properties.message} `
            })
            return res.status(401).json({message: returnString})
        }
        //other errors
        return res.status(400).json({message: "invalid entry"})
    }
})

export const usePassportCallback = catchAsync(async(req: Request, res: Response)=>{
    const user: User_int | undefined = req.user as User_int
    if(!user?._id) return res.status(401).json({message: "authenticatiod failed"})
    res.status(200).json({user: req.user, token: user.genToken()})
})
