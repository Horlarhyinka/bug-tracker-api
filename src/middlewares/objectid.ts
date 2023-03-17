import { Request, Response, NextFunction } from "express";
import { validateId } from "../utils/validators";
import { sendDepencyRequired } from "../utils/response-handlers";

const ObjectId = (req: Request, res: Response, next: NextFunction) =>{
    Object.keys(req.params).forEach(key =>{
        if(key.toLowerCase().endsWith("id")){
            if(!validateId(req.params[key])) return sendDepencyRequired(res, "valid " + key)
        }
})
    return next()
}

export default ObjectId