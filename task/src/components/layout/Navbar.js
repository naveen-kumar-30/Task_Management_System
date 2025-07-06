import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [currentTime, setCurrentTime] = useState("");
  const dateInputRef = useRef(null); // 👈 reference to hidden input

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setCurrentTime(now.toLocaleString("en-IN", options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker(); // opens native calendar
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
      </div>

      <div className="navbar-right">
        
        <button className="icon-btn" onClick={handleCalendarClick}>
          📅
        </button>
        <input
          type="date"
          ref={dateInputRef}
          className="hidden-calendar"
          onChange={(e) => console.log("Selected:", e.target.value)}
        />
        <span className="current-date">{currentTime}</span>
      </div>
    </div>
  );
}

export default Navbar;
