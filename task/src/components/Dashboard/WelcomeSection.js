// src/components/Dashboard/WelcomeSection.js
import React from "react";
import "./WelcomeSection.css";

function WelcomeSection({ userName }) {
  const TASK_STATUS = [
    { label: "Completed", value: 84, color: "green" },
    { label: "In Progress", value: 46, color: "blue" },
    { label: "Not Started", value: 13, color: "red" },
  ];

  return (
    <div className="welcome-section">
      <div className="welcome-text">
        <h2>Welcome back, {userName} </h2>
      </div>
    </div>
  );
}

export default WelcomeSection;
