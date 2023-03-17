import { Response } from "express"

export const sendServerFailed = (res: Response, action: string | null) =>{
    const message = `failed ${action? "to "+ action:""}`
    return res.status(500).json({message})
}

export const sendDepencyRequired = (res: Response, dependency: string | null) =>{
    const message = !dependency? "missing dependency": dependency + " is required"
    return res.status(400).json({message})
}

export const sendResourceNotFound = (res: Response, resource: string | null) =>{
    const message = `${resource? resource: ""} not found`
    return res.status(404).json({message})
}