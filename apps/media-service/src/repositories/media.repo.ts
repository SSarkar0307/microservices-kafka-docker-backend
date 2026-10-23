import { getPool } from "shared";
import { Attachment } from "../utils/types";

export async function findTaskAccess(taskId: string): Promise<{id:string, created_by: string} | null>{
    const result = await getPool().query<{id: string, created_by: string}>(

        `
        select id, created_by
        from tasks
        where id= $1
        `,
        [taskId]  
    )
    return result.rows[0] ?? null
}


export async function createAttachment(input: {
    taskId: string,
    imageUrl: string,
    publicId: string,
    uploadedBy: string,
}): Promise<Attachment>{

    const result = await getPool().query<Attachment>(

        `insert into attachments (task_id, image_url, public_id, uploaded_by)
        values ($1, $2, $3, $4)
        returning *
        `,
        [input.taskId, input.imageUrl, input.publicId, input.uploadedBy]
    );

    return result.rows[0];
}