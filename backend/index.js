const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stockRoutes = require('./routes/stocks');
const correlationRoutes = require('./routes/correlation');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/stocks', stockRoutes);
app.use('/stockcorrelation', correlationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});