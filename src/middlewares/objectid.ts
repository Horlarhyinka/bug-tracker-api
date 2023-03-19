import { Request, Response, NextFunction } from "express";
import { validateId } from "../utils/validators";
import { sendDepencyRequired } from "../utils/response-handlers";

const ObjectId = (req: Request, res: Response, next: NextFunction) =>{
let keys = Object.keys(req.params)
console.log("validator reached")
for(let i = 0;i < keys.length; i++){
    let key = keys[i]
            if(key.toLowerCase().endsWith("id")){
            if(!validateId(req.params[key])) return sendDepencyRequired(res, "valid " + key)
            console.log("logouyt", validateId(req.params[key]), key, req.params[key])
        }
}
    return next()
}

export default ObjectId