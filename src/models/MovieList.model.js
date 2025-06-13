import mongoose from 'mongoose';

const movieListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    movieId: {
      type: Number,
      required: [true, 'TMDB Movie ID is required'],
    },
    mediaType: {
      type: String,
      enum: ['movie', 'tv', 'anime'],
      default: 'movie',
    },
    status: {
      type: String,
      enum: ['watched', 'to_watch', 'favorite', 'watching'],
      required: [true, 'Status is required'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot be longer than 500 characters'],
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique user-movie-status combination
movieListSchema.index({ userId: 1, movieId: 1, status: 1 }, { unique: true });

export const MovieList = mongoose.model('MovieList', movieListSchema);