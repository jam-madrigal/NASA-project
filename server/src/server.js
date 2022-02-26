const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

// Check if there is a port specified in the environment, otherwise default to port 8000, as to not conflict with 3000 with the react app
const PORT = process.env.PORT || 8000;

// Clones of this project will have tos upply their own database url, as I have hidden mine
const MONGO_URL = require('../mongourl');

const server = http.createServer(app);

// An event emitter that activates when the connection is ready and has succeeded, or when there are errors
// The open event will only be triggered once, when the connection is ready, so we can use the .once feature all event emitters have to only trigger the callback function once
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

// Using our kepler stream data we converted to a promise so the data is aways available when our server starts, we have to wrap it in a new function or else using await will cause an error since it is being used in the top level of a module/file
async function startServer() {
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();
    
    server.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}...`)
    });
}

startServer();