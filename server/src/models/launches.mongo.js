const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }
});
// Connects our launches schema to the launches collection, mongoose will convert our name to lower case and pluralize it
module.exports = mongoose.model('Launch', launchesSchema);

