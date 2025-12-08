import {Schema,model,Document,Types} from 'mongoose'

export type UserRole='COMPANY_ADMIN'|'DEVELOPER';

export interface IUser extends Document{
    companyId:Types.ObjectId;
    name:string;
    email:string;
    passwordHash:string;
    role:UserRole;
    avatarUrl?:string;
    status:string;
    settings?:{
        theme?:string;
        notificationPreferences:object;
    }
    lastLogin?:Date;
}

const userSchema=new Schema<IUser>(
    {
        companyId:{
            type:Schema.Types.ObjectId,
            ref:'Company',
            required:true
        },
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
            enum:['COMPANY_ADMIN','DEVELOPER'],
            required:true
        },
        avatarUrl:{
            type:String
        },
        status:{
            type:String,
            default:'ACTIVE'
        },
        settings:{
            theme:{
                type:String,
                default:'light'
            },
            notificationPreferences:{
                type:Object,
                default:{}
            }
        },
         lastLogin:{
            type:Date
        }
    },
    {timestamps:true}
)

export const User= model<IUser>('User',userSchema)

