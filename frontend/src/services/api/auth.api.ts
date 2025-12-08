import { http } from "./httpClient";

export const authApi={
    login(data:{email:string;password:string}){
        return http.post('/auth/login',data)
    },

    me(){
        return http.get('/auth/me')
    },

    logout(){
        return http.post('/auth/logout')
    }

}