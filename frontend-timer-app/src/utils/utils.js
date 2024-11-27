/**
 * Converts seconds into a formatted string of hours, minutes, and seconds.
 * @param {number} totalSeconds - The total number of seconds to convert.
 * @returns {string} - The formatted string in "HH:mm:ss" format.
 */
export function formatTime(totalSeconds) {
    if (typeof totalSeconds !== 'number' || totalSeconds < 0) {
      throw new Error('Invalid input: totalSeconds must be a non-negative number.');
    }
  
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
  
    // Format with leading zeroes
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  
//   module.exports = {
//     formatTime,
//   };
  