// Creating an object that defines our launch data
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

// Mapping our launches by flight number, the flight number value has a value of the entire corresponding launch object, we could now use something like launch.get(100) to return the launch with that flight number
launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

function getAllLaunches() {
    return Array.from(launches.values());
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