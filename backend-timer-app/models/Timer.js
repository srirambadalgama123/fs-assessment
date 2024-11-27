const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true }, // Unique identifier for each user
  start_time: { type: Date, required: true },               // When the timer was started
  totalElapsedTime: { type: Number, default: 0 },          // Total elapsed time in seconds
  pausedTime: { type: Number, default: 0 },                // Total time the timer was paused
  lastPauseTime: { type: Date },                           // Time when the timer was last paused
  status: { type: String, enum: ['running', 'paused', 'completed'], default: 'running' },
  updatedAt: { type: Date, default: Date.now },            // Last updated timestamp
},
{ timestamps: true });

const Timer = mongoose.model('Timer', timerSchema);

module.exports = Timer;
