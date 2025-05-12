const { computeAverage } = require('../utils/calculateAverage');

exports.calculateAverage = (req, res) => {
    const startTime = Date.now(); // Start time for response time calculation

    const { numbers } = req.body;

    if (!Array.isArray(numbers) || numbers.length === 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide an array of numbers.' });
    }

    const average = computeAverage(numbers);
    const responseTime = Date.now() - startTime; // Calculate response time

    res.status(200).json({ average, responseTime: `${responseTime}ms` });
};