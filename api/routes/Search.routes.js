import express from 'express';
import { protectedRoute } from '../middleware/Auth.middleware.js';
import { searchEverything } from '../controllers/Search.controller.js';

const router = express.Router();

router.get('/',protectedRoute, searchEverything );

export default router;