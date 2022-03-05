const http = require('http');
// Mounting dotenv on the module directly so we can call our secret values
require('dotenv').config();

const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

// Check if there is a port specified in the environment, otherwise default to port 8000, as to not conflict with 3000 with the react app
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// Using our kepler stream data we converted to a promise so the data is aways available when our server starts, we have to wrap it in a new function or else using await will cause an error since it is being used in the top level of a module/file
async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();
    
    server.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}...`)
    });
}

startServer();