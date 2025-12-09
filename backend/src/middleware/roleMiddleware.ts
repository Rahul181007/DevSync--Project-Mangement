// Checks if the user has permission (SUPER_ADMIN, COMPANY_ADMIN, etc).

import { Request,Response,NextFunction } from "express";

export const roleMiddleware=(...allowedRRoles:string[])=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const user=(req as any).user;

        if(!user){
         return res.status(401).json({
            status:'fail',
            message:'Not authenticated'
         })
        }

        if(!allowedRRoles.includes(user.role)){
            return res.status(403).json({
                status:'fail',
                message:'Access denied. Ypu dont have permission '
            })
        }
        next()
    }
}