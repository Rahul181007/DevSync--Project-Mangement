import { Request,Response } from "express";
import { ZodError } from "zod";
import { listCompaniesQuerySchema } from "./company.validators";
import { companyService } from "./company.service";
import { AppError } from "shared/errors/AppError";

export const companyController={
    async listCompanies (req:Request,res:Response){
        try {
            const parsed=listCompaniesQuerySchema.parse(req.query);
            
            const result=await companyService.listCompanies(parsed)
             
            return res.json({
                status:'success',
                data:result,
            })
            

        } catch (error:unknown) {
            if(error instanceof ZodError){
                return res.status(400).json({
                    status:'fail',
                    message:'Validation error',
                    error:error.issues
                })
            }
            console.error('List companiess error ',error)
            return res.status(500).json({
                status:'error',
                message:'Internal server error'
            })
        }
    },

// POST /superadmin/companies
// Create company (SuperAdmin only)

async createCompany(req:Request,res:Response){
    try {
        const {name,domain}=req.body

        if(!name || !domain){
            return res.status(400).json({
                status:'fail',
                message:'Name and domain are required'
            })
        }

        const company =await companyService.createCompany({
            name ,
            domain,
            createdBy:"superadmin",
        });

        return res.status(201).json({
            status:'success',
            data:{company}
        })
    } catch (error:any) {
        console.error('Create company error',error);

        if(error instanceof AppError){
            return res.status(error.statusCode).json({
                status:'Fail',
                message:error.message
            })
        }
        return res.status(500).json({
            status:'error',
            message:'Failes to create  company'
        })
        
    }
},

//    *  PATCH /superadmin/companies/:id/status
//    *  Approve / Suspend / Reject company

async updateStatus(req:Request,res:Response){
    try {
        const companyId=req.params.id;
        const {status}=req.body;

        if(!status){
            return res.status(400).json({
                status:'fail',
                message:'Status is required'

            })
        }

        const adminUser=(req as any).user

        const updated=await companyService.updateStatus(
            companyId,
            status,
            adminUser.userId
        );

        return res.json ({
            status:'success',
            data:updated,
        })
    } catch (error:any) {
        console.error('Update company status error',error)

        if(error instanceof AppError){
            return res.status(error.statusCode).json({
                status:'fail',
                message:error.message
            })
        }

        return res.status(500).json({
        status:'error',
        message:'failed to update the staus'
    })
    }


}

}
