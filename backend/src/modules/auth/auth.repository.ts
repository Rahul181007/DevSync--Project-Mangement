// talk to database

import { SuperAdmin } from "models/SuperAdmin.model";
import { User } from "models/User.model";
import { Company } from "models/Company.model";
import bcrypt from 'bcryptjs'

export const authRepository={
    // super admin lookup
    findSuperAdminByEmail(email:string){
        return SuperAdmin.findOne({email}).exec();//.exe is returning promise
    },

    // Company_Admin/Developer lookup

    findUserByEmail(email:string){
        return User.findOne({email}).exec()
    },

    // find the company of the user

    findCompanyById(companyId:string){
        return Company.findById(companyId).exec()
    },

    // update last login for super admin
    updateSuperAdminLastLogin(id:string){
        return SuperAdmin.updateOne(
            {_id:id},
            {$set:{lastLogin:new Date()}}
        ).exec()
    },
    //update last login for user (company admin/developers)
    updateUserLastLogin(id:string){
        return User.updateOne(
            {_id:id},
            {$set:{lastLogin:new Date()}}
        )
    },

    findSuperAdminById(id:string){
        return SuperAdmin.findById(id).exec();
    },

    findUserById(id:string){
        return User.findById(id).exec()
    },
    
    // creater company admin user when company is approved  company created by adsuperadmin
    async createCompanyAdmin(data:{
        companyId:string,
        name:string,
        email:string,
        role:'COMPANY_ADMIN'
    }){
        const passwordHash=await bcrypt.hash('admin123',10);

        return User.create({
            name:data.name,
            email:data.email,
            role:data.role,
            companyId:data.companyId,
            passwordHash,
            status:'ACTIVE'
        })
    }

}