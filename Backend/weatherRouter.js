const weather = require('express').Router();
const weatherService = require('./weatherService');

weather.get('/', async (req, res) => {
    const {city, country} = req.query;
    const forecast = await weatherService.getWeeklyForecast(city, country);
    res.json(forecast);
});

module.exports = weather;