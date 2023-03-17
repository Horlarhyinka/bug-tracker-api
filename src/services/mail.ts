import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import log from "../utils/logger";
import dotenv from"dotenv";
dotenv.config()

const configOptions = {
    port: Number(process.env.MAIL_PORT!),
    auth:{
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!
    },
    service: process.env.MAIL_SERVICE,
    secure: false,
    host: process.env.MAIL_HOST!
}

interface mailer_int{
    sendReminder: (numberOfBugs: number)=> Promise<boolean>,
    sendCongratulation: () => Promise<boolean>
}

export default class Mailer implements mailer_int{
    constructor( private email: string, private transporter: Transporter = nodemailer.createTransport(configOptions) ){}
    private mailoption:{ to: string, from: string, html?: string } = {to: this.email, from:"test@gmail.com", }
    readonly sendReminder = async(numberOfBugs: number) =>{
        try{
        const file = await ejs.renderFile(path.resolve(__dirname, "../views/reminder.ejs"), {numberOfBugs})
        this.mailoption.html = file
        await this.transporter.sendMail(this.mailoption)
        this.transporter.close()
        return true
        }catch(ex){
            log("error", JSON.stringify(ex))
            return false
        }

    }
    readonly sendCongratulation = async() =>{
        try{
        const file = await ejs.renderFile(path.resolve(__dirname, "../views/congratulation.ejs"))
        this.mailoption.html = file
        await this.transporter.sendMail(this.mailoption)
        this.transporter.close()
        return true
        }catch(ex){
            log("error", JSON.stringify(ex))
            return false;
        }

    }
}

