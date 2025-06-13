import { compromise } from 'compromise';
import natural from 'natural';
import { tmdbService } from './tmdb.service.js';
import { MovieList } from '../models/MovieList.model.js';
import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

const { TfIdf, WordTokenizer } = natural;

export class RecommenderService {
  #tfidf = new TfIdf();
  #tokenizer = new WordTokenizer();

  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      const { results: movies } = await tmdbService.getTrending();
      movies.forEach(movie => {
        const text = `${movie.title} ${movie.overview}`;
        this.#tfidf.addDocument(text.toLowerCase());
      });
      logger.info('Recommender service initialized');
    } catch (error) {
      logger.error(`Recommender initialization failed: ${error.message}`);
    }
  }

  async recommend({ userId, query }) {
    try {
      const userPreferences = await this.#analyzeUserPreferences(userId);
      const movies = query
        ? await this.#processQuery(query)
        : (await tmdbService.getTrending()).results;

      return this.#applyPreferences(movies, userPreferences);
    } catch (error) {
      throw new ApiError(500, 'Recommendation failed');
    }
  }

  async #analyzeUserPreferences(userId) {
    const lists = await MovieList.find({ userId }).populate('userId');
    const preferences = {
      favoriteGenres: new Set(),
      dislikedGenres: new Set(),
      favoriteActors: new Set(),
    };

    // Analyze user's lists to build preference profile
    lists.forEach(item => {
      if (item.status === 'favorite') {
        // Add logic to extract genres/actors from favorite items
      }
    });

    return {
      favoriteGenres: [...preferences.favoriteGenres],
      dislikedGenres: [...preferences.dislikedGenres],
      favoriteActors: [...preferences.favoriteActors],
    };
  }

  async #processQuery(query) {
    const nlp = compromise(query.toLowerCase());
    const extracted = {
      genres: nlp.match('#Genre').out('array'),
      actors: nlp.people().out('array'),
      years: this.#extractYears(nlp),
      minRating: this.#extractMinRating(query),
    };

    const { results } = await tmdbService.search({ query });
    return results.filter(movie => this.#matchesCriteria(movie, extracted));
  }

  #extractYears(nlp) {
    const dates = nlp.dates().out('array');
    return dates.map(date => {
      const year = parseInt(date, 10);
      return !isNaN(year) && year > 1900 && year < 2100 ? year : null;
    }).filter(Boolean);
  }

  #extractMinRating(query) {
    const match = query.match(/rated (.*)\+/)?.[1];
    return match ? parseFloat(match) : 6.0;
  }

  #matchesCriteria(movie, criteria) {
    // Implementation of criteria matching
    return true;
  }

  #applyPreferences(movies, preferences) {
    return movies
      .sort((a, b) => this.#calculateScore(b, preferences) - this.#calculateScore(a, preferences))
      .slice(0, 10);
  }

  #calculateScore(movie, preferences) {
    let score = movie.vote_average || 5.0;
    
    // Add scoring logic based on preferences
    return score;
  }
}

export const recommenderService = new RecommenderService();