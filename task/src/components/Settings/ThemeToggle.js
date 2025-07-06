// src/components/Settings/ThemeToggle.js
import React, { useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme; // Apply theme to body
  };

  return (
    <div className="settings-section">
      <h3>Theme</h3>
      <button onClick={toggleTheme} className="theme-btn">
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </div>
  );
}

export default ThemeToggle;
