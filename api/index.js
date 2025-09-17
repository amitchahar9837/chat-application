import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/Auth.routes.js';
import messageRoutes from './routes/Messsage.routes.js';
import searchRoutes from './routes/Search.routes.js'
import { connectDatabase } from './lib/database.js';
import { app, server } from './lib/socket.js';
// import path from 'path';
import rateLimit from 'express-rate-limit';
dotenv.config();

const PORT = process.env.PORT || 3001;

const limit = rateLimit({
      windowMs:30 * 1000, //30seconds
      limit:5,
      message:{
            status:429,
            message:'Too many requests, please try again after a minute!'
      }
})

app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(cookieParser());
// const __dirname = path.resolve();

// app.use('/api', limit)
app.use('/api/auth',authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/search', searchRoutes )

// app.use(express.static(path.join(__dirname, '/client/dist')));
// app.get('*',(_,res)=>{
//       res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
// })

server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      connectDatabase();
})
