const express = require('express');

// Routers
const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

// New instance of a route handler for our api
const api = express.Router();

// Mounting paths to our route handler for planets and launches
api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api;