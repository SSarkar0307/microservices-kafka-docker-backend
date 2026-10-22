
import {Router} from 'express'
import { validateBody } from 'shared'
import { createTaskSchema } from '../schemas/task.schemas'
import { createTask } from '../repositories/task.repo'


const router = Router()

router.post("/", validateBody(createTaskSchema), createTask);

export default router;