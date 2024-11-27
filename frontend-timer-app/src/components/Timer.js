import React, { useState, useEffect } from 'react';
import { getStartTime, completeTimer , resumeTimer, pauseTimer} from '../api'; // Import the API functions
import { formatTime } from '../utils/utils';

const Timer = () => {
  const [startTime, setStartTime] = useState(null); // Start time fetched from the GitHub API
  const [currentTime, setCurrentTime] = useState(0); // Time elapsed since start time
  const [endTime, setEndTime] = useState(null); // End time (when user clicks 'Complete')
  const [isTimerRunning, setIsTimerRunning] = useState(true); // State to handle timer status (running or stopped)
  const [userName, setUsername] = useState('srirambadalgama123/fs-assessment');  // Hardcoded username for now
  const [repo, setRepo] = useState('fs-assessment');  // Hardcoded repo for now
  const [isPaused, setIsPaused] = useState(false);

  // Timer logic to calculate elapsed time
  useEffect(() => {
    // Fetch start time as soon as component mounts
    const fetchStartTime = async () => {
      const startTimeDetails = await getStartTime(userName);
      console.log("fetchedStartTime", startTimeDetails)
      if (startTimeDetails) {
        if(startTimeDetails.status == 'paused') {
            setIsPaused(true);
            setCurrentTime(Math.floor((new Date(startTimeDetails.lastPauseTime) - new Date(startTimeDetails.start_time)) / 1000))
        } else if(startTimeDetails.status == 'completed') {
            setIsTimerRunning(false);
            setCurrentTime(startTimeDetails.totalElapsedTime)
        } else {
            setCurrentTime(Math.floor((new Date() - new Date(startTimeDetails.start_time)) / 1000))
        }

        const startDate = new Date(startTimeDetails.start_time); // Replace with your date object
        const startDateInSeconds = Math.floor(startDate.getTime() / 1000);
        setStartTime(startTimeDetails.start_time);
      }
    };

    fetchStartTime();
},[])

useEffect(() => {
    // Timer logic: Update the current time every second
    let intervalId;
    if (isTimerRunning && startTime && !isPaused) {
      intervalId = setInterval(() => {
        setCurrentTime((prev) => prev+1); // Time in seconds
      }, 1000);
    } else  {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [isTimerRunning, startTime, isPaused]);

  
  // Handle completing the timer (this will be triggered when 'Complete' button is clicked)
  const handleComplete = async () => {
    const stopTime = new Date().toISOString(); // Get the current time as the stop time
    setEndTime(stopTime); // Set the stop time

    const response = await completeTimer(userName, startTime, stopTime); // Call backend API to save data
    if (response) {
      setIsTimerRunning(false); // Stop the timer
      setCurrentTime(response.totalElapsedTime)
      console.log('Timer completed!', response); // Optionally log the completed data or handle it
    }
  };

  const handleResume = async () => {
    const response = await resumeTimer(userName);
    setIsPaused(false);
    if (response) {
      console.log('Timer resumed!');
    }
  };

  const handlePause = async () => {
    const response = await pauseTimer(userName);
    setIsPaused(true);
    if (response) {
      console.log('Timer paused!');
    } else {
        console.log("error occured while updating lastPauseTime in DB: ", response)
    }
  };

  return (
    <div>
      <h1>Timer</h1>
      {isTimerRunning ? (
        <div>
            {startTime ? (
                <div>
                    <p>Start Time: {new Date(startTime).toLocaleString()}</p>
                    <p>Elapsed Time: {formatTime(currentTime)}s</p>
                </div>
                ) : (
                    <p>Loading start time...</p> // Loading message until start time is fetched
            )}
            <button onClick={handleComplete}>Complete</button> {/* 'Complete' button */}
            {isPaused ? (
            <button onClick={handleResume}>Resume</button> // 'Resume' button when paused
            ) : (
            <button onClick={handlePause}>Pause</button> // 'Pause' button when running
            )}
      </div>
      ) : (
        <div>
          <h2>Timer Completed!</h2>
          <p>Start Time: {new Date(startTime).toLocaleString()}</p>
          <p>Total Time: {formatTime(currentTime)}s</p>
        </div>
      )}
    </div>
  );
};

export default Timer;
