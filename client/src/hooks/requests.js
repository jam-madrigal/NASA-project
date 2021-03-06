// All of our API functions will be made against our single API, so let's set our address of the API into a constant
// const API_URL = 'http://localhost:8000/v1';
// This url was updated to the below so that the url would work anywhere. When using docker and running our application on the cloud, the domain may change. Like this, the client know that requests should be made to the api at the same address/origin as the front end
const API_URL = 'v1';

// Use the browsers built in function, and specify that we are using different ports for our front and backend
// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch)
    });
  } catch(err) {
    return {
      ok: false
    };
  }
}

// Delete launch with given ID, catching and logging errors if there are any, and if so returning, setting the success variable to false
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete"
    });
  } catch(err) {
    console.log(err);
    return {
      ok: false
    };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};