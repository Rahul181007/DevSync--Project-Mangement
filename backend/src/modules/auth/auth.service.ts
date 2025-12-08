import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import { authRepository } from './auth.repository';
import { LoginDto } from './auth.validators';
import { LoginResponse,AuthPayload } from './auth.types';
import { AppError } from 'shared/errors/AppError';
import { env } from 'config/env';
import { en } from 'zod/v4/locales';


export const authService={
    async login(data:LoginDto):Promise<LoginResponse>{
        const {email,password}=data

        const superAdmin=await authRepository.findSuperAdminByEmail(email)
        if(superAdmin){
            const isMatch=await bcrypt.compare(password,superAdmin.passwordHash);
            if(!isMatch){
                throw new AppError('invalid credentials',400)
            }

            if(superAdmin.status!=='ACTIVE'){
                throw new AppError('Super admin account is not active ',403)
            }
            // update last login
            await authRepository.updateSuperAdminLastLogin(superAdmin._id.toString());
            const payload:AuthPayload={
                userId:superAdmin._id.toString(),
                role:'SUPER_ADMIN'
            };
             const accessToken=jwt.sign(
                payload,
                env.JWT_SECRET,
                {expiresIn:env.JWT_ACCESS_EXPIRES_IN}
             );
             const refreshToken=jwt.sign(
                payload,
                env.JWT_SECRET,
                {expiresIn:env.JWT_REFRESH_EXPIRES_IN}
             )
            return {
                accessToken,
                refreshToken,
                user:{
                    id:superAdmin._id.toString(),
                    name:superAdmin.name,
                    email:superAdmin.email,
                    role:'SUPER_ADMIN'
                }
            }
        }

        // company/developer

        const user=await authRepository.findUserByEmail(email);
        if(!user){
            throw new AppError('Invalid credentials',401)
        }
        const isMatch=await bcrypt.compare(password,user.passwordHash);
        if(!isMatch){
            throw new AppError('Invalid credentials',401)
        }

        if(user.status==='BLOCKED'){
            throw new AppError('User is blocked, contact your company admin',403)
        }

        const company=await authRepository.findCompanyById(
            user.companyId.toString()
        )

        if(!company){
            throw new AppError('Company Not Found',404)
        }

        if(company.status==='PENDING'){
            throw new AppError('Company is not approvede yet',403)
        }

        if(company.status==='SUSPENDED'){
            throw new AppError('Company is suspended',403)
        }
        
        // update the last login
        await authRepository.updateUserLastLogin(user._id.toString());
        
        const payload:AuthPayload={
            userId:user._id.toString(),
            role:user.role,
            companyId:user.companyId.toString()
        }

        const accessToken=jwt.sign(
            payload,
            env.JWT_SECRET,
            {expiresIn:env.JWT_ACCESS_EXPIRES_IN}
        );
        const refreshToken=jwt.sign(
            payload,
            env.JWT_SECRET,
            {expiresIn:env.JWT_REFRESH_EXPIRES_IN}
        )

        return{
            accessToken,
            refreshToken,
            user:{
                id:user._id.toString(),
                name:user.name,
                email:user.email,
                role:user.role,
                companyId:user.companyId.toString()
            }
        }
    }
}