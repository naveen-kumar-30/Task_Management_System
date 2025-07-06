// src/components/CircularProgress/CircularProgress.js
import React from 'react';
import './CircularProgress.css'; // This CSS file will style the progress circle

const CircularProgress = ({ percentage, color, label }) => {
  // Calculate the circumference of the circle (2 * PI * radius)
  // Assuming a radius of 45 for a viewBox of 0 0 100 100 (circle has a diameter of 90)
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // Approximately 282.74

  // Calculate the offset for the stroke-dashoffset property to show the progress
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circular-progress-container">
      <svg className="circular-progress-svg" viewBox="0 0 100 100">
        {/* Background circle - fixed light grey */}
        <circle
          className="circular-progress-bg"
          cx="50"
          cy="50"
          r={radius} // Use the radius variable
        ></circle>
        {/* Foreground circle - represents the progress */}
        <circle
          className="circular-progress-bar"
          cx="50"
          cy="50"
          r={radius} // Use the radius variable
          style={{
            strokeDasharray: circumference, // Total length of the stroke
            strokeDashoffset: offset,      // How much of the stroke is hidden/visible
            stroke: color,                 // Dynamic color based on prop
          }}
        ></circle>
      </svg>
      {/* Content displayed in the center of the circle */}
      <div className="circular-progress-content">
        <span className="percentage-text" style={{ color: color }}>
          {percentage.toFixed(0)}% {/* Display percentage, rounded to whole number */}
        </span>
        <span className="label-text">{label}</span> {/* Label (e.g., "Completed") */}
      </div>
    </div>
  );
};

export default CircularProgress;