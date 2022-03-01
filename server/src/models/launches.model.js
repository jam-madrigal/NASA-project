// Linking our mongodb launches collection
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

// Default flight number in case our getLatestLaunch function has no launches to reference
const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();
// Setting state to log our most recent flight number

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'ZTM'],
    upcoming: true,
    success: true
};

saveLaunch(launch);

// See if a launch exists within our database
async function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

// Get our latest flight number from the database using a filter that finds the highest flight number value
function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber');
        
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

// GET all launches
async function getAllLaunches() {
    return await launchesDatabase
    .find({}, { '_id': 0, '__v': 0});
}

// Saving launches to mongodb
async function saveLaunch(launch) {
    // Validating the planet exists, so we do not add launches to planets that do not exist in our database
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error('No matching planet was found');
    }
    
    // Saving a doocument with the newly passed in launch object, or updating it if it already exists by flight number
    try {
        await launchesDatabase.updateOne({
            flightNumber: launch.flightNumber,
        }, launch, {
            upsert: true
        })} catch(err) {
                return console.error(`Could not save launch ${err}`); 
    }
}


// Launch post requests handler to add a new launch, updating the passed in launch from the request body/payload to have values we still end that aren't changed by the front end, using Object.assign(), this makes our launches be sorted by flight number properties, which then have a value of all the launch data as an object
function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(
        latestFlightNumber, 
        Object.assign(launch, {
            flightNumber: latestFlightNumber,
            customers: ['ZTM', 'NASA'],
            upcoming: true,
            success: true,
        }));
}

// Rather than deleting aborted launches outright, update them to show they are not successful and are no longer upcoming
function abortLaunchById(launchId) {
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById
};