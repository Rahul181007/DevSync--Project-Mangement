import axios from "axios";

export const http=axios.create({
    baseURL:"http://localhost:4000/api",
    withCredentials:true,
})

type FailedQueue={
    resolve:(value?:unknown)=>void
    reject:(reason?:unknown)=>void
}
//track refresh token

let isRefreshing=false;
let failedQueue:FailedQueue[]=[];

function processQueue(error:unknown,token:string|null=null):void{
    failedQueue.forEach((prom)=>{
        if(error){
            prom.reject(error)
        }else{
            prom.resolve(token??undefined)
        }
    })
    failedQueue=[];
}
console.log("⚡ Axios instance created");
http.interceptors.response.use(
  (response) => {
   return response
  },
  async (error) => {
    const originalReq = error.config;

    if (error?.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => http(originalReq))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await http.post("/auth/refresh");

        processQueue(null, null);

        return http(originalReq);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
// Why withCredentials?

// Because:
// Access token stored in HttpOnly cookie
// Browser must send it automatically
// Otherwise backend will think user is not logged in
