const planets = [];
// Return our array of planets
function getAllPlanets(req, res) {
    return res.status(200).json(planets);
}