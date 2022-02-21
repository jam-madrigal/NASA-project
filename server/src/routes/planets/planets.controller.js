const { getAllPlanets } = require('../../models/planets.model');

// Return our model of planets
function httpGetAllPlanets(req, res) {
    return res.status(200).json(getAllPlanets());
}

module.exports = {
    httpGetAllPlanets,
}