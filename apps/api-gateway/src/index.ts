import {config } from 'dotenv'
import { resolve } from 'node:path'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit, { MINUTE } from 'express-rate-limit'
import { AppError, httpLogger, logger, successResponse } from 'shared'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { gatewayAuth } from './middleware/gatewayAuth'


config({path : resolve(process.cwd(), ".env")})
config({path : resolve(process.cwd(), "../../.env")})

const PORT = process.env.PORT || 3000;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001"


const app = express()

app.use(helmet())
app.use(cors())
app.use(rateLimit({
    windowMs: 15 * MINUTE,
    limit : 100,
    standardHeaders: true,
    legacyHeaders: true
})
)

app.use(httpLogger)

app.use('/health', (req, res)=>{
    successResponse(res, {service: "api-gateway"})
})

app.use("/auth",
    gatewayAuth,
    createProxyMiddleware({
        target: AUTH_SERVICE_URL,
        changeOrigin : true,
        pathRewrite: (path)=> `/auth${path}`,

    })
)

app.use((req , res , next)=>{
    next(new AppError(404, "Route not Found"));
})

app.listen(PORT, ()=>{
    logger.info('API Gateway running on port ' + PORT);
});


