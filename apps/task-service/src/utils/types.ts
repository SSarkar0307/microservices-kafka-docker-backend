

export type TaskStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"

export type Task = {
    id: string;
    title: string;
    status: TaskStatus;
    created_by: String;
    created_at: Date;
    updated_at: Date;

}