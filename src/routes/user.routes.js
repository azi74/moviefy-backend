import express from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export { router as userRoutes };