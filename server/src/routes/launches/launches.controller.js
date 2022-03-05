const { 
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
 } = require('../../models/launches.model');

 const {
     getPagination
 } = require('../../services/query');

// Getting our launches data, taking any pagination parameters, and sending it to our api and mongo to get a list of launches
async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit)
    return res.status(200).json(launches);
}

// Function for handling POST of new launches
async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    // Validate all of our values exist
    if (!launch.mission || !launch.rocket || !launch.launchDate 
          || !launch.target) {
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

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = +req.params.id;

    const existsLaunch = await existsLaunchWithId(launchId);
    // If launch doesn't exist
    if (!existsLaunch) {
        return  res.status(404).json({
            error: "Launch not found"
        });
    } 
    // If launch does exist
    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
        return res.status(400).json({
            error: "Launch not aborted"
        });
    }
    return res.status(200).json({
        ok: true
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}