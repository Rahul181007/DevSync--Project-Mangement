import axios from "axios";

export const http=axios.create({
    baseURL:"http://localhost:4000/api",
    withCredentials:true,
})

// Why withCredentials?

// Because:
// Access token stored in HttpOnly cookie
// Browser must send it automatically
// Otherwise backend will think user is not logged in
