import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user";
import { User_int } from "../models/user";
dotenv.config()

interface Payload extends JwtPayload{
    id: string
}

export interface AuthenticatedRequest extends Request{
    user: User_int
}

const authenticate = async(req: Request, res: Response, next: NextFunction) =>{
    const token = req.headers["authorization"]
    if(!token) return sendUnauthenticated()
    try{
        const verified = jwt.verify(token, process.env.APP_SECRET!) as Payload
        if(!verified) return sendUnauthenticated()
        const user = await User.findById(verified.id)
        if(!user) return sendUnauthenticated()
        req.user = user as User_int
        next()
    }catch(ex){
        sendUnauthenticated()
    }
    function sendUnauthenticated(){
        return res.status(401).json({message:"unauthenticated"})
    }
}

export default authenticate;