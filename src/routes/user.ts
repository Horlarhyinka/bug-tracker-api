import {Router} from "express";
import passport from "passport";
import { usePassport } from "../config/oauth";
import * as user from "../controllers/user"
const router = Router()

router.post("/register",user.register)
router.post("/login", user.login)
router.get("/google", usePassport)
router.get("/redirect", passport.authenticate("google"), user.usePassportCallback)

export default router;
