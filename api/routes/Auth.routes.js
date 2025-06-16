import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/Auth.controller.js';
import { protectedRoute } from '../middleware/Auth.middleware.js';

const router = express.Router();

router.post('/signup',signup);//route for createing a new user
router.post('/login',login); // route for login
router.post('/logout',logout) // route for logout
router.post('/update-profile', protectedRoute, updateProfile) // route for update profile
router.get('/check', protectedRoute, checkAuth) //route for checking authorization

export default router;