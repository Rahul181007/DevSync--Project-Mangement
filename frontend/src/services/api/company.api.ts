import { http } from "./httpClient";

export const companyApi={
    // get company list 

    getCompanies(params?:{
        search?:string;
        status?:string;
        page?:number;
        limit?:number
    }){
        return http.get('/superadmin/companies',{params})
    },

    // create new company
createCompany(data: { name: string; domain: string }) {
  return http.post("/superadmin/companies", data);
}
,

    //update company status

    updateStatus(companyId:string,status:string){
        return http.patch(`/superadmin/companies/${companyId}/status`, {
      status,
    });
    },

    // company details

    getCompanyById(companyId: string) {
    return http.get(`/superadmin/companies/${companyId}`);
  },
    
}