import dotenv from "dotenv";
import { connect } from "mongoose";
dotenv.config()

export default (uri: string) =>{
    uri = uri.replace("<password>", process.env.DB_PASSWORD!)
    return connect(uri)
}