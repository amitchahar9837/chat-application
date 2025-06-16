import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
export const connectDatabase = () =>{
    mongoose.connect(process.env.MONGO_URI).then((database) =>{
        console.log("Connected Database...",database.connection.host)
  }).catch(error =>{
        console.log(error)
  })
}