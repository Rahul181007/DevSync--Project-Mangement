import { domain } from "zod/v4/core/regexes.cjs";
import { companyRepository } from "./company.repository";
import { ListCompaniesQuery } from "./company.validators";

export const companyService={
    async listCompanies(query:ListCompaniesQuery){
        const result =await companyRepository.listCompanies(query);

        return{
            item:result.item.map((c)=>({
                id:c._id.toString(),
                name:c.name,
                domain:c.domain,
                status:c.status,
                planId:c.currentPlanId?.toString()|| null,
                createdAt:c.createdAt
            })),
            total:result.total,
            page:result.page,
            limit:result.limit
        }
    }
}