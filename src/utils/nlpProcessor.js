import compromise from 'compromise';

export const nlpProcessor = {
  processMessage(message) {
    const doc = compromise(message.toLowerCase());
    
    const intent = this.detectIntent(message);
    const entities = {
      genres: doc.match('#Genre').out('array'),
      actors: doc.people().out('array'),
      years: this.extractYears(doc),
      minRating: this.extractMinRating(message)
    };

    return { intent, entities };
  },

  detectIntent(message) {
    if (/hi|hello|hey/i.test(message)) return 'greeting';
    if (/recommend|suggest|find/i.test(message)) return 'recommendation';
    return 'unknown';
  },

  extractYears(doc) {
    return doc.dates().out('array')
      .map(date => parseInt(date))
      .filter(year => year > 1900 && year < 2100);
  },

  extractMinRating(message) {
    const match = message.match(/rated (.*)\+/)?.[1];
    return match ? parseFloat(match) : 6.0;
  }
};