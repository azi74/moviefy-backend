import { tmdbService } from './tmdb.service.js';
import { MovieList } from '../models/index.js';

export const movieService = {
  async getTrending() {
    return tmdbService.getTrending();
  },

  async addToList(userId, movieId, status, mediaType = 'movie') {
    await MovieList.findOneAndUpdate(
      { userId, movieId },
      { status, mediaType },
      { upsert: true, new: true }
    );
  },

  async getUserList(userId, status) {
    return MovieList.find({ userId, ...(status && { status }) })
      .sort('-createdAt')
      .lean();
  }
};