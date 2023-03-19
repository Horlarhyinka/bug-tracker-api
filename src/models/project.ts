import { Request } from "express";
import mongoose, { Schema, model, Document} from "mongoose";
import Bug, {bug_int} from "./bug";

export interface project_int extends Document{ 
     name: string,
     bugs: (Schema.Types.ObjectId | null | bug_int )[],
     getBug: (id: id_arg_type) => Promise<bug_int | null>,
     addBug: (description: string) => Promise<bug_int[] | null>,
     removeBug: (id: id_arg_type) => Promise<boolean>,
     resolveBug: (id: id_arg_type) => Promise<bug_int | null>,
     getBugs: ()=>Promise<(bug_int | null)[]>,
     updateBug: (id: id_arg_type, update: Request["body"])=> Promise<bug_int | null>,
     getUnresolved: ()=> Promise<(bug_int | null)[]>
    }
type id_arg_type = string | mongoose.Types.ObjectId

const projectSchema = new Schema<project_int>({
    name: {
        type: String,
        required: true
    },
    bugs:{
        type: [Schema.Types.ObjectId],
        ref: "bug"
    },
},{ timestamps: true, virtuals: true})

projectSchema.methods.addBug = async function(description: string){
    const bug = await Bug.create({description}) as bug_int
    if(!bug)return null;
    (this as project_int).bugs.push(bug._id)
    await this.save()
    const bugs = await (this as project_int).populate("bugs")
    return bugs
}

projectSchema.methods.removeBug = async function(id: id_arg_type){
    if(!id)return false;
    try{
        (this as project_int).bugs = (this as project_int).bugs.filter((bug)=> String(bug) !== id)
        await Bug.findByIdAndDelete(id)
        await (this as project_int).save()
        return true
    }catch(ex){
        return false
    }
}

projectSchema.methods.getBug = async function(id: id_arg_type){
    try{
        const project = await (this as project_int).populate("bugs")
        const bugs = project.bugs as (bug_int | null)[]
        const target = bugs.find((bug)=> String(bug?._id) === id)
        return target
    }catch(ex){
        return null
    }
}

projectSchema.methods.resolveBug = async function(id: id_arg_type){
    try{
        const target = (this as project_int).bugs.find(bug => String(bug) === id);
        if(!target) return null;
        const bug = await Bug.findById(target) as bug_int;
        const newStatus = bug.resolved? false: true;
        bug.set("resolved", newStatus)
        return await bug.save()
    }catch(ex){
        console.log(ex)
        return null
    }
}

projectSchema.methods.getBugs = async function (){
    const { bugs } = await (this as project_int).populate("bugs")
    return bugs
}

projectSchema.methods.updateBug = async function (id: id_arg_type, update: Request["body"]) {
    let bug = await Bug.findById(id)
    if(!bug)return null
    Object.keys(update).forEach((key)=>{
        if(bug!.get(key) && key.toLowerCase() !== "resolved"){
            bug!.set(key,update[key])
        }
    })
    await bug.save()
    return bug;
}

projectSchema.methods.getUnresolved = async function(){
    const populated = await this.populate("bugs") as project_int
    return (populated.bugs as (bug_int | null)[]).filter((bug) => !bug?.resolved)
}

export default model<project_int>("project", projectSchema)
