import http from 'http';
import app from './app'
import { connectDB } from 'config/db';
import { env } from 'config/env'; 

const server=http.createServer(app)
connectDB().then(()=>{
    server.listen(env.PORT,()=>{
        console.log(`Server running on http://localhost:${env.PORT}`)
    })
})