import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/Auth.routes.js';
import messageRoutes from './routes/Messsage.routes.js';
import searchRoutes from './routes/Search.routes.js'
import { connectDatabase } from './lib/database.js';
import { app, server } from './lib/socket.js';
dotenv.config();

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || `http://localhost:5173`;

app.use(express.json());
app.use(cookieParser());
console.log(CLIENT_URL)

app.use(cors({
      origin: CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use('/api/auth',authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/search', searchRoutes )

server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      connectDatabase();
})
