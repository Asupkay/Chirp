const database = require('../database.js');

database.writeSentimentData.mockImplementation(() => 42);
database.writeLanguageData.mockImplementation(() => 42);
database.getSentimentScores.mockImplementation(() => 42);
database.getLanguageCount.mockImplementation(() => 42);
database.getLanguageCounts.mockImplementation(() => 42);

test('Write sentiment data', () => {
  expect(database.writeSentimentData()).toBe(42);
});
/*
test('Write Language Data', () => {
  database.writeLanguageData.mockResolvedValue({});
});

test('Get Sentiment Scores', () => {
  database.getSentimentScores.mockResolvedValue({});
});

test('Get language count', () => {
  database.getLanguageCount.mockResolvedValue({});
});

test('Get languages count', () => {
  database.getLanguagesCounts.mockResolvedValue({});
});
*/
