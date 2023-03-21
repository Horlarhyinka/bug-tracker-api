import cron from "node-cron";
import User, { User_int } from "../models/user";
import Project, {project_int} from "../models/project";
import Mailer from "./mail";
import log from "../utils/logger";

export default () =>{
    cron.schedule("26 16 * * *",async()=>{
        try{
        const users = await User.find()
        users.forEach(async(user: User_int)=>{
            const populatedUser = await user.populate("projects")
            let numberOfBugs: number = 0
            const projects = populatedUser.projects as (project_int | null)[]
            //get total number of bugs
            projects.forEach(async(project)=>{
                const count = await project?.getUnresolved()
                if(count?.length){
                    numberOfBugs += count!.length
                }
            })
            const mailer = new Mailer(user.email)
            !numberOfBugs? await mailer.sendCongratulation(): await mailer.sendReminder(numberOfBugs)
        })
        }catch(ex){
            log("error", "cron job failed" + JSON.stringify(ex))
        }

    })
}