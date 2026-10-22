import { getPool } from "shared";
import { Task } from "../utils/types";

export async function createTask(input: {
    title: string;
    createdBy: string;
}) : Promise<Task> {
    const result = await getPool().query<Task>(
        `insert into tasks(title, created_by)
        values ($1, $2)
        returning *
        `,
        [input.title, input.createdBy]
    )
    return result.rows[0];
}

export async function listTasks(input:{
    userId: string;
    role: string;
}): Promise<Task[]>{
    if(input.role === 'ADMIN'){
        const result = await getPool().query<Task>(
            `select *
            from tasks
            order by created_at desc
            `,
        )
        return result.rows;
    }
    const result = await getPool().query<Task>(
        `select *
        from tasks
        where created_by = $1
        order by created_at desc
        `,
        [input.userId]
    )
    return result.rows;
}

export async function findSingleTaskById(id: string): Promise<Task | null> {
    const result = await getPool().query<Task>(
        `select *
        from tasks 
        where id = $1
        `,
        [id]
    )
    return result.rows[0] ?? null;
}

export async function deleteSingleTaskById(id: string): Promise<boolean>{
    const result = await getPool().query<Task>(
        `delete from tasks where id =$1`,
        [id] 
    )
    return (result.rowCount ?? 0) > 0
}