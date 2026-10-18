import {Router} from 'express';
import {validateBody} from 'shared'
import * as authController from '../controllers/auth.controller'
import { loginSchema, registerSchema } from '../schemas/auth.schemas';


const router = Router()

router.post('/register', validateBody(registerSchema), authController.register);

router.post('/login', validateBody(loginSchema), authController.login);

router.post('/me',  authController.getMe);

export default router;

