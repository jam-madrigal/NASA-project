// Dependencies
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();
// Middleware

// Cors
app.use(cors({
    origin: 'http://localhost:3000',
}));
// Morgan
app.use(morgan('combined'));

// Express
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Version one of our api routes
app.use('/v1', api);

// Mounting our front end to the root path, and any paths that do not exist default here
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;