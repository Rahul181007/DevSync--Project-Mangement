import { Request,Response } from "express";
import { ZodError } from "zod";
import { listCompaniesQuerySchema } from "./company.validators";
import { companyService } from "./company.service";

export const companyController={
    async list (req:Request,res:Response){
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
    }
}
