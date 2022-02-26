const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

// Check if there is a port specified in the environment, otherwise default to port 8000, as to not conflict with 3000 with the react app
const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://nasa-api:MJCHCj2hIeDPrPLS@nasacluster.glu4d.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);

// An event emitter that activates when the connection is ready and has succeeded, or when there are errors
// The open event will only be triggered once, when the connection is ready, so we can use the .once feature all event emitters have to only trigger the callback function once
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});

// Using our kepler stream data we converted to a promise so the data is aways available when our server starts, we have to wrap it in a new function or else using await will cause an error since it is being used in the top level of a module/file
async function startServer() {
    await mongoose.connect(MONGO_URL, {
        // These options must be set to ensure we are using the latest technology
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    await loadPlanetsData();
    
    server.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}...`)
    });
}

startServer();