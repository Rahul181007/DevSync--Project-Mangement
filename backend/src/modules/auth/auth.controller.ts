import { Request,Response } from "express";
import { loginSchema } from "./auth.validators";
import { authService } from "./auth.service";
import { array, ZodError } from "zod";
import { AppError } from "shared/errors/AppError";
import jwt from 'jsonwebtoken'
import { env } from "config/env";
import { authRepository } from "./auth.repository"; 
import { AuthPayload } from "./auth.types";


export const authController={
    async login(req:Request,res:Response){
        try {
            
          const parsed=loginSchema.parse(req.body); // validates request body(email+password)
          const {accessToken,refreshToken,user}=await authService.login(parsed); // call service + get access & refresh token+ user (business logic)
          
          // set hhtp only cookies (backend only, js cannot read)
          
          res.cookie('access_token',accessToken,{
            httpOnly:true,
            secure:false,
            sameSite:'lax',
            maxAge:15*60*1000
          })

          res.cookie('refresh_token',refreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:'lax',
            maxAge:7*24*60*60*1000 //7 days
          })

          return res.json({
            status:'success',
            data:{
                user:{
                    id:user.id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    companyId:user.companyId
                }
            }
          })
        } catch (err:unknown) {
          if(err instanceof ZodError){
            return res.status(400).json({
                status:'fail',
                message:'Validation error',
                error:err.issues,
            })
          }

          if(err instanceof AppError){
            return res.status(err.statusCode).json({
                status:'fail',
                message:err.message,
            })
          }

          console.error('Login error',err);
          return res.status(500).json({
            status:'error',
            message:'Internal server error'
          })
    }
},
// async me(req:Request,res:Response){
//     try {
//         const token=req.cookies?.access_token;

//         if(!token){
//             return res.status(401).json({
//                 status:'fail',
//                 message:'Not authenticated'
//             })
//         }

//         // decode token
        
//         const decoded=jwt.verify(token,env.JWT_SECRET)as AuthPayload;

//         let userDoc;
//         if(decoded.role==='SUPER_ADMIN'){
//             userDoc=await authRepository.findSuperAdminById(decoded.userId)
//         }else{
//             userDoc=await authRepository.findUserById(decoded.userId)
//         }

//         if(!userDoc){
//             return res.status(401).json({
//                 status:'fail',
//                 message:'User not found'
//             })
//         }

//         return res.json({
//             status:'success',
//             data:{
//                 user:{
//                     id:userDoc._id.toString(),
//                     name:userDoc.name,
//                     email:userDoc.email,
//                     role:userDoc.role,
//                     companyId:
//                     decoded.role==='SUPER_ADMIN'
//                     ?undefined:(userDoc as any).companyId?.toString(),
//                 }
//             }
//         })
//     } catch (error) {
//         console.error('Auth me error',error)
//         return res.status(401).json({
//             status:'fail',
//             message:'Invalid or expired token'
//         })
//     }
// }
async me(req:Request,res:Response){
  try {
    const decoded=(req as any).user;

    let userDoc;
    if(decoded.role==='SUPER_ADMIN'){
        userDoc=await authRepository.findSuperAdminById(decoded.userId);   
    }else{
        userDoc=await authRepository.findUserById(decoded.userId)
    }

    if(!userDoc){
         return res.status(401).json({ status: "fail", message: "User not found" });
    }
     
    return res.json({
        status:'success',
        data:{
            user:{
                id:userDoc._id.toString(),
                name:userDoc.name,
                email:userDoc.email,
                role:decoded.role,
                companyId:
                decoded.role==='SUPER_ADMIN'?
                undefined:(userDoc as any).companyId?.toString()
            }
        }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  
  }
},

async logout(req:Request,res:Response){
    try {
        res.clearCookie('access_token',{
            httpOnly:true,
            sameSite:'lax',
            secure:false
        })

        res.clearCookie('refresh_token',{
            httpOnly:true,
            sameSite:'lax',
            secure:false
        })

        return res.json({
            status:'success',
            message:'Logged out successfully'
        })
    } catch (error) {
        console.log('Logout error',error)
        return res.status(500).json({
            status:'error',
            message:'Failed to logout'
        })
    }
},

async refresh(req:Request,res:Response){
  try {
    const token =req.cookies?.refresh_token
    
    if(!token){
        return res.status(401).json({
            status:'fail',
            message:'Refresh token missing'
        })
    }

    const decoded=jwt.verify(token,env.JWT_SECRET)as AuthPayload

    // create new access token
    const newAccessToken=jwt.sign(
        {
            userId:decoded.userId,
            role:decoded.role,
            companyId:decoded.companyId
        },
        env.JWT_SECRET,
        {expiresIn:env.JWT_ACCESS_EXPIRES_IN}
    );

    res.cookie('access_token',newAccessToken,{
        httpOnly:true,
        sameSite:'lax',
        secure:false,
        maxAge:15*60*1000
    })

    return res.json({
        status:'success',
        message:'Access token refreshed'
    })

  } catch (error) {
        console.error("Refresh token error", error);
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired refresh token",
    });
  
  }
}
}