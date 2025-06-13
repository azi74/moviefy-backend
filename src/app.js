import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from './config/database.js';
import { logger } from './utils/logger.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { authRoutes } from './routes/auth.routes.js';
import movieRoutes from './routes/movie.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { chatRoutes } from './routes/chat.routes.js';
import './config/database.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chat', chatRoutes);

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error Handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});