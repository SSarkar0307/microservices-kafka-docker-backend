import {Request, Response, NextFunction} from 'express'
import { AppError } from 'shared'

function requireIdentity(req: Request){
    const userId = req.header("x-user-id")
    const role = req.header("x-user-role")

    if(!role || !userId){
        throw new AppError(401, "Identity not Found")
    }
    return {userId, role}
}

export async function uploadAttachment(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try{
        const {userId, role} = requireIdentity(req);

        const taskId = String(req.params.taskId)

        const attachment  = await 


    }catch (err){
        next(err);
    }
}