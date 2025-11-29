import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
export const connectDatabase = () =>{
    mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS:500,
    }).then((database) =>{
        console.log("Connected Database...",database.connection.host)
  }).catch(error =>{
        console.log(error)
  })
}