import { Request,Response,NextFunction } from "express";
import aj from "../config/arcjet.js";
import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";


const securitymiddleware = async (req:Request,res:Response,next:NextFunction) =>{
    if(process.env.NODE_ENV ==='test') return next();

    try {
        const role : RateLimitRole = req.user?.role ?? 'guest';

        let limit: number;
        let message: string;

        switch(role){
            case 'admin':
                limit = 20;
                message = 'Admin limit exceed(20)';
                break;
            case 'teacher':
            case 'student':
                limit = 10;
                message = 'User limit exceed (10) plz wait';
                break;
            default:
                limit = 5;
                message = 'Guest limit exceed. Login for higher limits';
                break;
        }

        const Client = aj.withRule(
            slidingWindow({
                mode: 'LIVE',
                interval: '1m',
                max: limit,
            })
        )

        const arcjetRequest: ArcjetNodeRequest = {
            headers: req.headers,
            method: req.method,
            url: req.originalUrl ?? req.url,
            socket: { remoteAddress: req.socket.remoteAddress ?? req.ip ?? '0.0.0.0'}
        }

        const decision = await Client.protect(arcjetRequest);

        if(decision.isDenied() && decision.reason.isBot()) {
            return res.status(429).json({
                error: 'Forbidden',
                message: 'Automated request are not allowed.'
            });
        }

        if(decision.isDenied() && decision.reason.isShield()) {
             return res.status(429).json({
                error: 'Forbidden',
                message: 'Request blocked by Security Policy.'
           });
        } 
 
        if(decision.isDenied() && decision.reason.isRateLimit()) {
            return res.status(429).json({
                error: 'Too many request',
                message: message
            });
          }

          next();
    } catch (e) {
        console.error('Arcjet middleware error: ',e);
        res.status(500).json({
            error:'Inter error', message : 'Something went wrong with security Middleware'
        });
    }
}


export default securitymiddleware;