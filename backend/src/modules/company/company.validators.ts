import {z} from 'zod';

export const listCompaniesQuerySchema=z.object({
    search:z.string().trim().optional(),
    status:z.enum(['PENDING','APPROVED','SUSPENDED']).optional(),
    page:z.coerce.number().int().min(1).default(1),
    limit:z.coerce.number().int().min(1).max(50).default(10)
})

export type ListCompaniesQuery=z.infer<typeof listCompaniesQuerySchema>;