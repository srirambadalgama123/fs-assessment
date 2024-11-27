const Timer = require('../models/Timer');
const  getForkTime  = require('../utils/githubApi');

const recordStartTime = async (req, res) => {
  try {
    const { userName } = req.body;

    //Check in DB if timer details of user are already present
    let timer = await Timer.findOne({ userName });
    if (timer) {
      return res.status(200).json({ timer});
    }

    //If timer details are not prsent, use GIT Hub API to get start time
    const startTime = await getForkTime(userName);
    console.log("startTime: ", startTime)

    timer = new Timer({
      userName:userName,
      start_time: new Date(startTime), // Ensure startTime is a valid Date object
    });
    await timer.save()
    
    res.status(200).json({ timer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeTimer = async (req, res) => {
  const { userName } = req.body;

  try {
    const timer = await Timer.findOne({ userName });
    console.log("timer before comeplete: ", timer);

    if (!timer) {
      return res.status(404).json({ message: 'Timer not found' });
    }

    let elapsedTime;

    if (timer.status === 'running') {
      // Calculate elapsed time since the timer started until now
      const currentTime = new Date();
      elapsedTime = Math.floor((currentTime - new Date(timer.start_time)) / 1000);
    } else if (timer.status === 'paused') {
      // If paused, calculate elapsed time only up to the last pause time
      elapsedTime = Math.floor((new Date(timer.lastPauseTime) - new Date(timer.start_time)) / 1000);
    }

    // Update timer status to 'completed' and save the final elapsed time
    timer.totalElapsedTime = elapsedTime - timer.pausedTime;
    timer.status = 'completed';

    await timer.save();

    res.status(200).json({
      status: 'completed',
      timer: timer,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error completing the timer', error });
  }
};

const pauseTimer =  async (req, res) => {
  const { userName } = req.body;

  try {
    const timer = await Timer.findOne({ userName });

    if (!timer) {
      return res.status(404).json({ message: 'Timer not found' });
    }

    if (timer.status === 'paused') {
      return res.status(400).json({ message: 'Timer is already paused.' });
    }
    console.log("timer: ", timer)

    // Calculate elapsed time before pausing
    const currentTime = new Date();
    timer.lastPauseTime = currentTime; // Update lastPauseTime
    timer.status = 'paused';

    await timer.save();
    res.status(200).json({ lastPauseTime: timer.lastPauseTime, status: 'paused' });
  } catch (error) {
    res.status(500).json({ message: 'Error pausing the timer', error });
  }
};

const resumeTimer = async (req, res) => {
  const { userName } = req.body;

  try {
    const timer = await Timer.findOne({ userName });

    if (!timer) {
      return res.status(404).json({ message: 'Timer not found' });
    }

    if (timer.status === 'running') {
      return res.status(400).json({ message: 'Timer is already running.' });
    }

    // Calculate the duration of the pause
    const currentTime = new Date();
    const pausedDuration = Math.floor((currentTime - new Date(timer.lastPauseTime)) / 1000);

    // Adjust paused time and update the timer
    timer.pausedTime += pausedDuration;
    timer.status = 'running';

    await timer.save();
    res.status(200).json({ status: 'running', pausedTime: timer.pausedTime });
  } catch (error) {
    res.status(500).json({ message: 'Error resuming the timer', error });
  }
};


module.exports = { recordStartTime, completeTimer, pauseTimer, resumeTimer };
