const http = require('http');

const app = require('./app')

// Check if there is a port specified in the environment, otherwise default to port 8000, as to not conflict with 3000 with the react app
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}...`)
});