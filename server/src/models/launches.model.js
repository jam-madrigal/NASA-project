// Linking our mongodb launches collection
const launchesDatabase = require('./launches.mongo');

const launches = new Map();
// Setting state to log our most recent flight number
let latestFlightNumber = 100;

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

function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

async function getAllLaunches() {
    return await launchesDatabase
    .find({}, { '_id': 0, '__v': 0});
}

// Saving launches to mongodb
async function saveLaunch(launch) {
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