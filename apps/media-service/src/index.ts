import {config} from 'dotenv'
import express from 'express'
import { resolve } from 'node:path'
import { AppError, errorHandler, httpLogger, logger, requireGatewaySecret, successResponse } from 'shared'

config({path: resolve(process.cwd(), '.env')})
config({path: resolve(process.cwd(), '../../.env')})

const PORT = process.env.MEDIA_PORT || 3003

const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL || 'http://localhost:3003'

const app = express()

app.use(httpLogger)
app.use(express.json());

app.get("/health", (req, res, next)=>{
    successResponse(res, {service: "media-service"})
})
// app.use("/tasks", requireGatewaySecret, taskRoutes)

app.use((req, res, next)=>{
    next(new AppError(404, "Route not Found"));
})

app.use(errorHandler);

app.listen(PORT, ()=>{
    logger.info(`Media service is now running on ${PORT}`);
})