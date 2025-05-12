const { calculateAverage } = require('../controllers/averageController');

function setRoutes(app) {
    // Define the POST route for calculating average
    app.post('/api/calculate-average', calculateAverage);
}

module.exports = setRoutes;