const { getAllLaunches } = require('../../models/launches.model');

// Getting our launches data, converting it into an iterable list of values in the Map, and creating an array from that list
function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

module.exports = {
    httpGetAllLaunches
}