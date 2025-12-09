import { Company } from "models/Company.model";
import { ListCompaniesQuery } from "./company.validators";

export const companyRepository={
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

        return {item,total,page,limit}


    }
}