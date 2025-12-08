// Reads the JWT token → adds req.user.

import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { env } from "config/env";
import { AuthPayload } from "modules/auth/auth.types";

export const authMiddleware=(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const token =req.cookies?.access_token

    if(!token){
        return res.status(401).json({
            status:'fail',
            message:'Not authorised'
        })
    }
    try {
    const decoded=jwt.verify(token,env.JWT_SECRET)as AuthPayload

    (req as any).user=decoded
    next()
} catch (error) {
    return res.status(401).json({
        status:'fail',
        message:'Invalid or expired token'
    })
}
}

