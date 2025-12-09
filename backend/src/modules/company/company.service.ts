import slugify from "slugify";
import { companyRepository } from "./company.repository";
import { ListCompaniesQuery } from "./company.validators";
import { AppError } from "shared/errors/AppError";
import { authRepository } from "modules/auth/auth.repository";

export const companyService={

    // list compnies
    async listCompanies(params:ListCompaniesQuery){
     return await companyRepository.listCompanies(params)
    },

    // create a company (superadmin)

    async createCompany(data:{
        name:string,
        domain:string,
        createdBy:string
    }){

        const exists=await companyRepository.findByDomain(data.domain)

        if(exists){
            throw new AppError('Somain already exist',400)
        }

        //generate slug 
        const slug =slugify(data.name,{lower:true})

        return await companyRepository.createCompany({
            ...data,
            slug,
            status:'PENDING',
            ownerAdminId:null,
            approvedBy:null
        })
    },

    //update commpany status

async updateStatus(
  companyId: string,
  status: "PENDING" | "APPROVED" | "SUSPENDED",
  superAdminId: string
) {
  const company = await companyRepository.findById(companyId);
  if (!company) throw new AppError("Company not found", 404);

  // Already approved
  if (status === "APPROVED" && company.status === "APPROVED") {
    throw new AppError("Company is already approved", 400);
  }

  // Business rule
  if (status === "SUSPENDED" && company.status === "PENDING") {
    throw new AppError("Cannot suspend a pending company", 400);
  }

  // APPROVE
  if (status === "APPROVED") {
    const adminUser = await authRepository.createCompanyAdmin({
      companyId,
      name: `${company.name} Admin`,
      email: `admin@${company.domain}`,
      role: "COMPANY_ADMIN",
    });

    await companyRepository.setOwnerAdmin(companyId, adminUser._id.toString());

    return await companyRepository.updateStatus(
      companyId,
      "APPROVED",
      superAdminId
    );
  }

  // SUSPEND or PENDING
  return await companyRepository.updateStatus(companyId, status, superAdminId);
}


}