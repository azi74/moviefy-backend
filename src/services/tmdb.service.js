import axios from 'axios';
import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.timeout = 5000;
  }

  async #makeRequest(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params: { ...params, api_key: this.apiKey },
        timeout: this.timeout,
      });
      return response.data;
    } catch (error) {
      logger.error(`TMDB API Error: ${error.message}`);
      throw new ApiError(500, 'Failed to fetch data from TMDB');
    }
  }

  async getTrending({ mediaType = 'movie', timeWindow = 'week' } = {}) {
    return this.#makeRequest(`/trending/${mediaType}/${timeWindow}`);
  }

  async search({ query, mediaType = 'movie', page = 1 }) {
    return this.#makeRequest(`/search/${mediaType}`, { query, page });
  }

  async getDetails({ mediaType = 'movie', id }) {
    return this.#makeRequest(`/${mediaType}/${id}`, {
      append_to_response: 'credits,recommendations,similar',
    });
  }

  async getCredits({ mediaType = 'movie', id }) {
    return this.#makeRequest(`/${mediaType}/${id}/credits`);
  }
}

export const tmdbService = new TMDBService();