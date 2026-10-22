import {Request, Response, NextFunction} from 'express'
import { AppError, verifyToken } from 'shared';
import { getAllowedRoles, isPublicRoute } from '../rbac';

const IDENTITY_HEADERS = [
    "x-user-id",
    "x-user-role",
    "x-gateway-secret",
] as const;

function stripIdentityHeaders(req: Request){
    for(const header of IDENTITY_HEADERS){
        delete req.headers[header]
    }
}
function attachGatewaySecret(req: Request){
    const secret = process.env.GATEWAY_SECRET;

    if(!secret) throw new AppError(500, "GATEWAY_SECRET is not configured")

    req.headers["x-gateway-secret"] = secret
}

function requestPath(req: Request){
    const combined = `${req.baseUrl}${req.path}`

    if(combined.length>1 && combined.endsWith('/')) return combined.slice(0, -1);

    return combined || '/';
}

function attachUserHeaders(req: Request, userId: string, role: string){
    req.headers['x-user-id'] = userId;
    req.headers['x-user-role'] = role;
}

export function gatewayAuth(
    req: Request,
    res: Response,
    next: NextFunction
){

    try{
        stripIdentityHeaders(req);
        attachGatewaySecret(req);
        console.log(req.header('x-gateway-secret'))
        
        const path = requestPath(req);
        
        if(isPublicRoute(req.method, path)){
            return next();
        }

        const authHeader = req.header('Authorization')
        if(!authHeader?.startsWith("Bearer ")) throw new AppError(401, "Missing or Invalid Auth Token");

        const token = authHeader.slice("Bearer ".length).trim()
        const payload = verifyToken(token);
        
        const allowedRoles = getAllowedRoles(req.method, path);
        
        if(!allowedRoles) throw new AppError(404, "Route not Found")

        if(!allowedRoles.includes(payload.role)) throw new AppError(403, "Route Forbidden for your Role")
            
        attachUserHeaders(req, payload.userId, payload.role);
            
        next();
    } catch(err){
        if(err instanceof AppError){
            return next(err);
        }
        return next(new AppError(401, "Invalid or expired token"))
    }

}