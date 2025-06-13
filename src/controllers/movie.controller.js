import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { tmdbService } from '../services/tmdb.service.js';
import { MovieList } from '../models/MovieList.model.js';
import { ApiError } from '../utils/ApiError.js';

export const getTrending = asyncHandler(async (req, res) => {
  const { mediaType = 'movie', timeWindow = 'week' } = req.query;
  const data = await tmdbService.getTrending({ mediaType, timeWindow });
  new ApiResponse(res, 200, data).send();
});

export const searchMovies = asyncHandler(async (req, res) => {
  const { query, mediaType = 'movie', page = 1 } = req.query;
  if (!query) throw new ApiError(400, 'Search query is required');
  const data = await tmdbService.search({ query, mediaType, page });
  new ApiResponse(res, 200, data).send();
});

export const getMovieDetails = asyncHandler(async (req, res) => {
  const { mediaType = 'movie', id } = req.params;
  const data = await tmdbService.getDetails({ mediaType, id });
  new ApiResponse(res, 200, data).send();
});

export const addToList = asyncHandler(async (req, res) => {
  const { movieId, mediaType, status, rating, review } = req.body;
  const userId = req.user._id;

  const existing = await MovieList.findOne({ userId, movieId, status });
  if (existing) {
    existing.rating = rating ?? existing.rating;
    existing.review = review ?? existing.review;
    await existing.save();
  } else {
    await MovieList.create({ userId, movieId, mediaType, status, rating, review });
  }

  new ApiResponse(res, 200, 'Movie added to list successfully').send();
});

export const getUserList = asyncHandler(async (req, res) => {
  const { status, mediaType } = req.query;
  const userId = req.user._id;

  const query = { userId };
  if (status) query.status = status;
  if (mediaType) query.mediaType = mediaType;

  const lists = await MovieList.find(query).sort('-createdAt');
  const enrichedLists = await Promise.all(
    lists.map(async (item) => {
      const details = await tmdbService.getDetails({
        mediaType: item.mediaType,
        id: item.movieId,
      });
      return { ...item.toObject(), details };
    })
  );

  new ApiResponse(res, 200, enrichedLists).send();
});