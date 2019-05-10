const database = require('../database');

jest.mock('../database');

database.writeSentimentData.mockImplementation((eventObject, Company) => {return {response: 'success'}});
database.writeLanguageData.mockImplementation((language, count, company) => {return {response: 'success'}});
database.getSentimentScores.mockImplementation((company) => [{sentiment: .42}, {sentiment: .23}]);
database.getLanguageCount.mockImplementation((language, company) => 42);
database.getLanguageCounts.mockImplementation((company) => {return {en: 10, fr: 10}});

//Tests for database
test('Write sentiment data', () => {
  expect(database.writeSentimentData({sentiment: .42}, 'Google')).toStrictEqual({response: 'success'});
});

test('Write Language Data', () => {
  expect(database.writeLanguageData('en', 10, 'Google')).toStrictEqual({response: 'success'});
});

test('Get Sentiment Scores', () => {
  expect(database.getSentimentScores('Google')).toStrictEqual([{sentiment: .42}, {sentiment: .23}]);
});

test('Get language count', () => {
  expect(database.getLanguageCount('en', 'Google')).toBe(42);
});

test('Get languages count', () => {
  expect(database.getLanguageCounts('Google')).toStrictEqual({en: 10, fr: 10});
});

