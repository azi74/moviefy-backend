import { tmdbService } from './tmdb.service.js';
import { nlpProcessor } from '../utils/nlpProcessor.js';
import { MovieList } from '../models/index.js';

export const chatService = {
  async processMessage(userId, message) {
    const { intent, entities } = nlpProcessor.processMessage(message);
    const movies = await this.getRecommendations(userId, intent, entities);
    
    return {
      message: 'Here are your recommendations:',
      type: 'recommendations',
      data: movies
    };
  },

  async getRecommendations(userId, intent, entities) {
    if (intent === 'greeting') {
      return (await tmdbService.getTrending()).results.slice(0, 5);
    }

    const userLists = await MovieList.find({ userId });
    // Add recommendation logic here
    return (await tmdbService.getTrending()).results.slice(0, 5);
  }
};