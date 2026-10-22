import {config} from 'dotenv'
import express from 'express'
import { resolve } from 'node:path'
import { errorHandler, httpLogger, logger, successResponse, AppError, requireGatewaySecret } from 'shared';
import taskRoutes from './routes/task.routes'

config({ path : resolve(process.cwd(), ".env")});
config({ path : resolve(process.cwd(), "../../.env")});

const PORT = process.env.AUTH_PORT || 3002;

const app = express();


app.use(httpLogger);
app.use(express.json());

app.get("/health", (req, res, next)=>{
    successResponse(res, {service: "auth-service"})
})
app.use("/tasks", requireGatewaySecret, taskRoutes)

app.use((req, res, next)=>{
    next(new AppError(404, "Route not Found"));
})

app.use(errorHandler);

app.listen(PORT, ()=>{
    logger.info(`Task service is now running on ${PORT}`);
})