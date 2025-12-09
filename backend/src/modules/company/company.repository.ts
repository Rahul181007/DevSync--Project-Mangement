import { Company } from "models/Company.model";
import { ListCompaniesQuery } from "./company.validators";
import { Types } from "mongoose";

export const companyRepository={
 
    //create a  new company
    async createCompany(data:any){
        return Company.create(data)
    },

    //find a company by id
    async findById(id:string){
        return Company.findById(id)
    },

    // find company by domain 
    async findByDomain(domain:string){
        return Company.findOne({domain})
    },
 // lsit companie (search + filter +pagination)
    async listCompanies(params:ListCompaniesQuery){
        const {search,status,page,limit}=params;

        const filter:any={};

        if(status){
            filter.status=status
        }
        if(search){
            const regex=new RegExp(search,'i');
            filter.$or=[{name:regex},{domain:regex}]
        }
        const skip=(page-1)*limit;

        const [item,total]=await Promise.all([
            Company.find(filter)
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .exec(),
            Company.countDocuments(filter).exec()
        ])

        return {item:item,total,page,limit,totalPages:Math.ceil(total/limit)}
    },

    //update Company status 

    async updateStatus(id:string,status:string,approvedBy?:string){
        const update:any={status};

        if(status==='APPROVED' && approvedBy){
            update.approvedBy=new Types.ObjectId(approvedBy)
        }
        return Company.findByIdAndUpdate(id,update,{new:true})
    },

    async setOwnerAdmin(companyId:string,userId:string){
        return Company.findByIdAndUpdate(
            companyId,
            {ownerAdminId:userId},
            {new:true}
        )
    }
}