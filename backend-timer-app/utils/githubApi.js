const axios = require('axios');

const getForkTime = async (username) => {
  try {

    // GitHub API URL to fetch the list of forks

    // Fetch the list of forks
    const response = await axios.get("https://api.github.com/repos/pankajexa/fs-assessment/forks", {
        headers:{
           'Authorization' : process.env.GIT_HUB_API_URL_AUTH_KEY
        }
    });
    console.log("response from github API: ", response)

    // Iterate through the forks and search for the specific full_name
    const fork = response.data.find(fork => fork.full_name === username);
    
    // If the fork is found, return the created_at timestamp
    if (fork) {
      return fork.created_at;
    } else {
      console.log(`Fork not found with full_name: ${repoOwner}/${repoName}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching fork data from GitHub:', error.message);
    return null;
  }
};

module.exports = getForkTime
