import express from "express";
import { protectedRoute } from "../middleware/Auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/Message.controller.js";

const router = express.Router();

router.get('/users', protectedRoute, getUsersForSidebar); //route to get users whose users chat with request user for sidebar
router.get('/:id', protectedRoute, getMessages); // route to get messages between users
router.post('/send/:id', protectedRoute, sendMessage) // route to send messages between two users

export default router;