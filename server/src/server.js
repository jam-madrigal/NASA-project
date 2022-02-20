const http = require('http');

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const planetsModel = require('./models/planets.model');
// Check if there is a port specified in the environment, otherwise default to port 8000, as to not conflict with 3000 with the react app
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// Using our kepler stream data we converted to a promise so the data is aways available when our server starts
await loadPlanetsData;

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}...`)
});