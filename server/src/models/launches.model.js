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

async function loadLaunchesData() {
    console.log("Downloading launches data...");
}

// See if a launch exists within our database
async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber: launchId
    });
}

// Get our latest flight number from the database using a filter that finds the highest flight number value
async function getLatestFlightNumber() {
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
        await launchesDatabase.findOneAndUpdate({
            flightNumber: launch.flightNumber,
        }, launch, {
            upsert: true
        })} catch(err) {
                return console.error(`Could not save launch ${err}`); 
    }
}

// Adding a document containing a new launch to mongodb
async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber
    });

    await saveLaunch(newLaunch);
}

// Rather than deleting aborted launches outright, update them to show they are not successful and are no longer upcoming
async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });
    /* Returning that a document was modified, and that one document was modified. We can see this object by reading the res.json from our controller function if we simply  used the above await updateOne operation, like below
    const aborted = await abortLaunchById(launchId);
    return res.status(200).json(aborted); */
    return aborted.modifiedCount === 1;
}

module.exports = {
    loadLaunchesData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
};