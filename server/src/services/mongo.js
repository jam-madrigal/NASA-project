
const mongoose = require('mongoose');
// Clones of this project will have to supply their own database url, as I have hidden mine, using .gitignore and then the dotenv npm package
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL);
// An event emitter that activates when the connection is ready and has succeeded, or when there are errors
// The open event will only be triggered once, when the connection is ready, so we can use the .once feature all event emitters have to only trigger the callback function once
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}