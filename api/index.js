import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/Auth.routes.js';
import messageRoutes from './routes/Messsage.routes.js';
import searchRoutes from './routes/Search.routes.js'
import { connectDatabase } from './lib/database.js';
import { app, server } from './lib/socket.js';
import path from 'path';
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
const __dirname = path.resolve();

app.use('/api/auth',authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/search', searchRoutes )

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*',(_,res)=>{
      res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      connectDatabase();
})
