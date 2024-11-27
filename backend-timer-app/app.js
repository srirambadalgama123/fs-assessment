const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const timerRoutes = require('./routes/timer');

dotenv.config();

const app = express();

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cors());         // Allow cross-origin requests

// Database connection
connectDB();

// Routes
app.use('/api/timer', timerRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
