import {Schema, model, Document} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {config} from "dotenv";
import "./project";
import { project_int } from "./project";

config()

export interface User_int extends Document{ 
     email: string,
     password: string,
     projects: (Schema.Types.ObjectId | null | project_int)[],
     verifyPassword: (password: string)=> boolean,
     genToken: ()=> string
    }


const userSchema: Schema = new Schema<User_int>({
    email: {
        type: String,
        required: [true, "email is required"],
        match: /^([a-zA-Z0-9\.@]{3,})@([a-z0-9@]+).([a-zA-Z0-9\.])+$/,
        unique: true
    },
    password:{
        type: String,
        required: [true, "password is required"],
        minlength: 6,
    },
    projects:{
        type: [Schema.Types.ObjectId],
         ref: "project"
        }
})

userSchema.methods.genToken = function(){
    return jwt.sign({id: this._id}, process.env.APP_SECRET!,{expiresIn: "2d"})
}

userSchema.methods.verifyPassword = async function(password: string):Promise<boolean>{
    return bcrypt.compare(password, this.password)
}

userSchema.pre("save",async function(){
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
})

export default model<User_int>("user", userSchema)