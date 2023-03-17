import passport from "passport";
import { Request } from "express";
import {Strategy, AuthenticateOptionsGoogle, GoogleCallbackParameters, Profile, VerifyCallback} from "passport-google-oauth20";
import dotenv from "dotenv";
import User, { User_int } from "../models/user";
dotenv.config()


passport.use(new Strategy({
    clientID: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    callbackURL: process.env.BASE_URL + "auth/redirect" ,
    passReqToCallback: true
},
async(request: Request ,accessToken: string, refreshToken: string ,params:GoogleCallbackParameters, profile: Profile, done: VerifyCallback )=>{
    const {email} = profile._json
    if(!email)return done("authentication error", undefined)
    let user: User_int | null = await User.findOne({email})
    const verified = await user?.verifyPassword(profile.id)
    if(user && !verified) return done("incorrect password", undefined)
    if(!user){
        user = await User.create({ email, password: profile.id})
    }
    done(null, user)
}
))

User

passport.serializeUser((user, done: VerifyCallback)=>{
    if(!user)return done("user does not exist", undefined)
    done(null, (user as User_int)._id)
})

passport.deserializeUser(async(id, done)=>{
    const user = await User.findById(id)
    if(!user)return done("user does not exist", undefined)
})

export const usePassport = passport.authenticate("google",{scope:["profile", "email"]})
export const usePassportAuth = passport.authenticate("google");