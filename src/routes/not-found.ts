import { Response, Request } from "express";
import catchAsync from "../utils/catchasync";

export default catchAsync(async(req: Request, res: Response)=>res.status(404).json({message: "route not found (this is because you reached an invalid url))"}))