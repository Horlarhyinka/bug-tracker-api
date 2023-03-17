import { NextFunction, Request, Response } from "express";
import Bug from "../models/bug";
import Project, { project_int } from "../models/project";
import user from "../models/user";
import User,{User_int} from "../models/user";
import catchAsync from "../utils/catchasync";
import * as responseHandler from "../utils/response-handlers";

export const addProject = catchAsync(async(req: Request, res: Response)=>{
    const {name: projectName} = req.body;
    if(!projectName) return responseHandler.sendDepencyRequired(res, "name")
    const project = await Project.create({name: projectName})
    try{
    await User.findByIdAndUpdate((req.user as User_int)._id,{$push: {projects: project._id }}, {new: true})
    }catch(ex){
        return responseHandler.sendServerFailed(res, "add project")
    }
    return res.status(201).json(project)
})

export const getProjects = catchAsync(async(req: Request, res: Response)=>{
    const {projects} = await user.findById((req.user as User_int)._id).populate("projects") as User_int
    res.status(200).json(projects)
})

export const getProject = catchAsync(async(req: Request, res: Response)=>{
    const project = await Project.findById(req.params.id)
    if(!project)return sendProjectNotFound(res)
    return res.status(200).json(project)
})

export const removeProject = catchAsync(async(req: Request, res: Response)=>{
    const { id } = req.params
    try{
        await User.findByIdAndUpdate(id, {$pull: {projects: id}})
    }catch(ex){
        return responseHandler.sendServerFailed(res, "remove project")
    }
    return res.status(204).json({message: "project removed"})
})

export const updateProject = catchAsync(async(req: Request, res: Response)=>{
    const {id } = req.params
    const project = await Project.findById(id) as project_int
    if(!project) return sendProjectNotFound(res)
    //update fields present in both req body object and project document object to value of req body object
    Object.keys(req.body).forEach((key: string) =>{
        if((project as project_int).get(key) && key.toLowerCase() !== "bugs"){
            project.set(key, req.body[key])
        }
    })
    await project.save()
    res.status(200).json(project)
})

export const addBug = catchAsync(async(req: Request, res: Response)=>{
    const {id } = req.params
    const {description} = req.body
    if(!description) return responseHandler.sendDepencyRequired(res, "description")
    const project = await Project.findById(id)
    if(!project)return sendProjectNotFound(res)
    const bugs = await project!.addBug(description)
    return res.status(200).json(bugs)
})

export const getBugs = catchAsync(async(req: Request, res: Response)=>{
    const { id } = req.params
    const project = await Project.findById(id)
    if(!project)return sendProjectNotFound(res)
    const bugs = await project!.getBugs()
    res.status(200).json(bugs)
})

export const getBug = catchAsync(async(req: Request, res: Response)=>{
    const { id, projectId} = req.params;
    const project = await Project.findById(projectId)
    if(!project)return sendProjectNotFound(res)
    const bug = await project.getBug(id)
    if(!bug) return sendBugNotFound(res)
    return res.status(200).json(bug)
})

export const updateBug = catchAsync(async(req: Request, res: Response)=>{
    const {projectId, id} = req.params
    const project = await Project.findById(projectId)
    if(!project)return sendProjectNotFound(res)
    const updated = await project.updateBug(id, req.body)
    if(!updated)return sendBugNotFound(res)
    return res.status(200).json(updated)
})  

export const resolveBug = catchAsync(async(req: Request, res: Response)=>{
    const {id, projectId} = req.params
    const project = await Project.findById(projectId)
    if(!project)return sendProjectNotFound(res)
    const updated = await project!.resolveBug(id)
    if(!updated) return sendBugNotFound(res)
    return res.status(200).json(updated)
})

export const removeBug = catchAsync(async(req: Request, res: Response)=>{
    const { projectId, id} = req.params
    const project = await Project.findById(projectId)
    if(!project) return sendProjectNotFound(res)
    const removed = await project.removeBug(id)
    if(!removed)return responseHandler.sendServerFailed(res, "remove bug")
    return res.status(204).json({message: "removed"})
})

function sendProjectNotFound(res: Response){
    return responseHandler.sendResourceNotFound(res, "project")
}

function sendBugNotFound(res: Response){
    return responseHandler.sendResourceNotFound(res, "bug")
}