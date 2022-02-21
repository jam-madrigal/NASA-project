const { 
    getAllLaunches,
    addNewLaunch
 } = require('../../models/launches.model');

// Getting our launches data, converting it into an iterable list of values in the Map, and creating an array from that list
function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

// Function for handling POST of new launches
function httpAddNewLaunch(req, res) {
    const launch = req.body;

    // Validate all of our values exist
    if (!launch.mission || !launch.rocket || !launch.date 
          || !launch.destination) {
            return res.status(400).json({
                error: 'Missing required launch property'
            })
        }
    // Since we cannot pass date objects from our json, we will convert the passed in date string to a Date object here
    launch.launchDate = new Date(launch.launchDate);
    // Validate that our date is a valid date
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    };

    addNewLaunch(launch);
    return res.status(201).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch
}