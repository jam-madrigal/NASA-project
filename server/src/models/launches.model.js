const axios = require('axios');
// Linking our mongodb launches collection
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

// Default flight number in case our getLatestLaunch function has no launches to reference
const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();
// Setting state to log our most recent flight number

const launch = {
    flightNumber: 100, // flight_number
    mission: 'Kepler Exploration X', //name
    rocket: 'Explorer IS1', // rocket.name
    launchDate: new Date('December 27, 2030'), // date_local
    target: 'Kepler-442 b', // not applicable
    customers: ['NASA', 'ZTM'], // payload.customers for each payload
    upcoming: true, // upcoming
    success: true // success
};

saveLaunch(launch);

// SpaceX API url
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

// Saving SpaceX launches to our database
async function populateLaunches() {
    console.log("Downloading launches data...");
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }

                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });

    if (response.status != 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }
    // Response from our axios query for launch data, which axios stores in a docs array in the response.data   
    const launchDocs = response.data.docs
    // Looping over the launch data to make a launch object to save in our database
    for (const launchDoc of launchDocs) {
        // Using the built in flatMap() function to make a new array out of each element in the array where customers are stored, it is called on an array and takes a callback which runs on each element and then combines the results of each into a new array
        const payloads = launchDoc['payloads'];
        // Iterating over each payload and taking each customers value for each payload and combining them into an array to use in our new launch document, creating the new document, and saving it to mongodb
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        }
        console.log(`${launch.flightNumber}, ${launch.mission}`);
        // Populate launches collection
        await saveLaunch(launch);
    }
}
// Loading all the SpaceX launch data we need with axios
async function loadLaunchesData() {
    // Checking if the data has already been loaded
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    if (firstLaunch) {
        console.log('Launch data already loaded');
    } else {
        await populateLaunches();
    }
}

// Function to use to only add launches not in our database already
async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}
// See if a launch exists within our database
async function existsLaunchWithId(launchId) {
    return await findLaunch({
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
    .find({}, { '_id': 0, '__v': 0})
}

// Saving launches to mongodb
async function saveLaunch(launch) {
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
    // Validating the planet exists, so we do not add launches to planets that do not exist in our database
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error('No matching planet was found');
    }

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