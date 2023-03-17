import { Request, Response, NextFunction } from "express"
const catchAsync: Function = (fn: Function) =>{
        return async(req: Request, res: Response, next: NextFunction)=>{
            try{
                return await fn(req, res, next)
            }catch(error){
                console.log(error)
                next(error)
            }
        }
    }

export default catchAsync