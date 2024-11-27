const express = require('express');
const { recordStartTime, completeTimer, resumeTimer, pauseTimer} = require('../controllers/timerController');

const router = express.Router();

router.post('/start', recordStartTime);   // Endpoint to fetch start time
router.post('/complete', completeTimer);  // Endpoint to save the completed timer
router.post('/resume', resumeTimer); // Endpoint to save the resume timer
router.post('/pause', pauseTimer); // Endpoint to save the pause timer

module.exports = router;
