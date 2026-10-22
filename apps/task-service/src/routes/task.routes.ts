
import {Router} from 'express'
import { validateBody } from 'shared'
import { createTaskSchema } from '../schemas/task.schemas'
import { createTask, deleteSingleTask, getSingleTask, listTasks } from '../controllers/task.controllers'


const router = Router()

router.post("/", validateBody(createTaskSchema), createTask);
router.get("/", listTasks);
router.get("/:id", getSingleTask);
router.delete("/:id", deleteSingleTask);

export default router;