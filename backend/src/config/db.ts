//Database connection.

import mongoose from "mongoose";
import {env} from './env';

export const connectDB=async ()=>{
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('Mongodb connected')
    } catch (error) {
        console.error('Mongo Error',error)
        process.exit(1)
    }
}