import { Request, Response, NextFunction } from "express";
import log from "./logger";

const catchAsync: Function = (fn: Function) =>{
        return async(req: Request, res: Response, next: NextFunction)=>{
            try{
                return await fn(req, res, next)
            }catch(error){
                log("error", JSON.stringify(error))
                next(error)
            }
        }
    }

export default catchAsync