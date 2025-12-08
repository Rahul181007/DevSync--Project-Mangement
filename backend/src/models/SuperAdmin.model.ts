import {Schema,model,Document} from 'mongoose'

export interface ISuperAdmin extends Document{
    name:string;
    email:string;
    passwordHash:string;
    role:'SUPER_ADMIN';
    avatarUrl?:string;
    status:string;
    lastLogin?:Date;
}

const superAdminSchema=new Schema<ISuperAdmin>(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        passwordHash:{
            type:String,
            required:true
        },
        role:{
            type:String,
            default:'SUPER_ADMIN'
        },
        avatarUrl:{
            type:String
        },
        status:{
            type:String,
            default:'ACTIVE'
        },
        lastLogin:{
            type:Date
        }

    },
    {timestamps:true}
)

export const SuperAdmin=model<ISuperAdmin>('SuperAdmin',superAdminSchema)