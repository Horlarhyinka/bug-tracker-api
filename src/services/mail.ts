import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import log from "../utils/logger";

const configOptions = {
    port: 465,
    auth:{
        user: "4f6b3a50868d83",
        pass: "4c5a375b0f2808"
    },
    service: "mailtrap",
    secure: false,
    host: "smtp.mailtrap.io"
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

