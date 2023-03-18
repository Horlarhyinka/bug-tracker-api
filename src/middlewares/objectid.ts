import { Request, Response, NextFunction } from "express";
import { validateId } from "../utils/validators";
import { sendDepencyRequired } from "../utils/response-handlers";

const ObjectId = (req: Request, res: Response, next: NextFunction) =>{
let keys = Object.keys(req.params)
for(let i = 0;i < keys.length; i++){
    let key = keys[i]
            if(key.toLowerCase().endsWith("id")){
            if(!validateId(req.params[key])) return sendDepencyRequired(res, "valid " + key)
        }
}
    return next()
}

export default ObjectId