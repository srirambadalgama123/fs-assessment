import axios from 'axios';

// Define your backend server URL (adjust if running locally or hosted)
const API_URL = 'http://localhost:5000'; // Change to your backend URL if deployed

// Function to get the start time based on the forked repo
export const getStartTime = async (userName) => {
  try {
    const response = await axios.post(`${API_URL}/api/timer/start`, { userName });
    return response.data.timer;
  } catch (error) {
    console.error('Error getting start time:', error);
    return null;
  }
};

// Function to record the stop time and save the data in the DB
export const completeTimer = async (userName, startTime, stopTime) => {
  try {
    console.log("values: ",userName, startTime, stopTime)
    const response = await axios.post(`${API_URL}/api/timer/complete`, { userName: userName });
    return response.data;
  } catch (error) {
    console.error('Error completing timer:', error);
    return null;
  }
};

export const pauseTimer = async (userName) => {
    try {
      console.log("values: ",userName)
      const response = await axios.post(`${API_URL}/api/timer/pause`, { userName: userName });
      return response;
    } catch (error) {
      console.error('Error completing timer:', error);
      return null;
    }
  };

  export const resumeTimer = async (userName) => {
    try {
      console.log("values: ",userName)
      const response = await axios.post(`${API_URL}/api/timer/resume`, { userName: userName });
      return response.data;
    } catch (error) {
      console.error('Error completing timer:', error);
      return null;
    }
  };

  
