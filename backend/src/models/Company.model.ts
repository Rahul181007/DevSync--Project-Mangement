import {Schema,model,Document,Types} from 'mongoose';
import { string } from 'zod';

export type CompanyStatus ='PENDING'|'APPROVED'|'SUSPENDED';

export interface ICompany extends Document{
    name:string;
    slug:string;
    domain:string;
    createdBy:'self'|'superadmin';
    approvedBy?:Types.ObjectId;
    ownerAdminId:Types.ObjectId;
    logoUrl?:string;
    themeColor?:string
    status:CompanyStatus;
    currentPlanId?:Types.ObjectId;
    subscriptionId?:Types.ObjectId;

    createdAt:Date;
    updatedAt:Date;
}

const companySchema=new Schema<ICompany>(
    {
        name:{
            type:String,
            required:true,
        },
        slug:{
            type:String,
            required:true,
            unique:true
        },
        domain:{
            type:String,
            required:true,
        },
        createdBy:{
            type:String,
            enum:['self','superadmin'],
            required:true,
        },
        approvedBy:{
            type:Schema.Types.ObjectId,
            ref:'SuperAdmin',
        },
        ownerAdminId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        logoUrl:{
            type:String
        },
        themeColor:{
            type:String
        },
        status:{
            type:String,
            enum:['PENDING','APPROVED','SUSPENDED'],
            default:'PENDING'
        },
        currentPlanId:{
            type:Schema.Types.ObjectId,
            ref:'Plan'
        },
        subscriptionId:{
            type:Schema.Types.ObjectId,
            ref:'Subscription'
        }
    },
    {timestamps:true}
)

export const Company=model<ICompany>('Company',companySchema)