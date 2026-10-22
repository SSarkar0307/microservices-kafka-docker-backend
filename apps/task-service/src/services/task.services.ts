import { CreateTaskInput } from "../schemas/task.schemas";
import * as taskRepo from '../repositories/task.repo'
import { convertToPublicTask } from "../utils/task.utils";
import { AppError } from "shared";


export async function createTask(input: CreateTaskInput, userId: string){
    const newlyCreatedTask = await taskRepo.createTask({
        title: input.title,
        createdBy: userId
    })

    return convertToPublicTask(newlyCreatedTask);
}

export async function listTasks(userId: string, role: string){
    if(!userId || !role){
        throw new AppError(401, "Missing user identity")
    }
    const tasks = await taskRepo.listTasks({userId, role});

    return tasks.map(convertToPublicTask);
}
export async function getSingleTask(taskId: string, userId: string, role: string){
    const task = await taskRepo.findSingleTaskById(taskId);
    if(!task){
        throw new AppError(404, "Task Not Found")
    }
    if(role !== 'ADMIN' && task.created_by!== userId){
        throw new AppError(403, "Forbidden, viewing tasks created by others is restricted.")
    }

    if(!userId || !role){
        throw new AppError(401, "Missing user identity")
    }
    
    return convertToPublicTask(task);
}

export async function deleteSingleTask(taskId: string, userId: string, role: string){
    if(role !== "ADMIN"){
        throw new AppError(403, "Forbidden, deletion can be done only by Admin.")
    }
    const task = await taskRepo.findSingleTaskById(taskId)
    if(!task){
        throw new AppError(404, "Task Not Found")
    }

    await taskRepo.deleteSingleTaskById(taskId)

    return {taskId} 
}