import { AppError } from "shared"
import * as attRepo from '../repositories/media.repo'

async function assertTaskAccess(
    taskId: string,
    userId: string,
    role: string,
){
    const task = await attRepo.findTaskAccess(taskId);
    if(!task) throw new AppError(404, "Task not Found")
    
    if(role!== "ADMIN" && task.created_by !== userId){
        throw new AppError(403, "Forbidden, can't upload to task created by another user.")
    }
}

export async function uploadAttachment(input: {
    taskId: string,
    userId: string,
    role: string,
    file? : Express.Multer.File
}){
    if(!input.file) throw new AppError(400, "Image File is required")

    await assertTaskAccess(input.taskId, input.userId, input.role);

    const uploaded = await 


}