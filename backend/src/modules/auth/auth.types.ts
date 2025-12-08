// auth.types.ts = Shapes of data used inside auth module

// Not validators
// Not schemas
// Just TypeScript types.


export type AuthRole='SUPER_ADMIN'|'COMPANY_ADMIN'|'DEVELOPER';

export interface LoginInput{
    email:string;
    password:string;
    
}

export interface AuthPayload{
    userId:string;
    role:AuthRole;
    companyId?:string;
}

export interface LoginUserData{
    id:string;
    name:string;
    email:string;
    role:AuthRole;
    companyId?:string;
}

export interface LoginResponse{
    accessToken:string;
    refreshToken:string;
    user:LoginUserData;
}