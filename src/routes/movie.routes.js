import express from 'express';
import {
  getTrending,
  searchMovies,
  getMovieDetails,
  addToList,
  getUserList,
} from '../controllers/movie.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/trending', getTrending);
router.get('/search', searchMovies);
router.get('/:mediaType/:id', getMovieDetails);

// Protected routes
router.use(authMiddleware);
router.post('/list', addToList);
router.get('/list', getUserList);

export default router;