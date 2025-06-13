import express from 'express';
import { chat } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, chat);

export { router as chatRoutes };