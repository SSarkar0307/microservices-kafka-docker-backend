import type { Request, Response, NextFunction } from "express";
import * as taskService from '../services/task.services'
import { AppError, successResponse } from "shared";

function requireIdentity(req: Request){
    const userId = req.header("x-user-id")
    const role = req.header("x-user-role")

    if(!role || !userId){
        throw new AppError(401, "Identity not Found")
    }
    return {userId, role}
}


export async function createTask(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try{

        const {userId, role} = requireIdentity(req);

        const task = await taskService.createTask(req.body, userId);

        successResponse(res, {task}, 201);

    }catch (err){
        next(err);
    }
}

export async function listTasks(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try{

        const {userId, role} = requireIdentity(req);

        const tasks = await taskService.listTasks(userId, role);

        successResponse(res, {tasks});

    }catch (err){
        next(err);
    }
}
export async function getSingleTask(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try{

        const {userId, role} = requireIdentity(req);
        const taskId = String(req.params.id);
        
        const task = await taskService.getSingleTask(taskId, userId, role);
        
        successResponse(res, {task});
        
    }catch (err){
        next(err);
    }
}
export async function deleteSingleTask(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try{
        
        const {userId, role} = requireIdentity(req);
        const taskId = String(req.params.id);
        

        const deletedId= await taskService.deleteSingleTask(taskId, userId, role);

        successResponse(res, {deletedId});

    }catch (err){
        next(err);
    }
}