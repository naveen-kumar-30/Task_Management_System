import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChartPie, FaUserFriends, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";
// Import your local image here
import defaultProfileImage from './image.png'; // <--- THIS IS THE KEY CHANGE

const links = [
  { name: "Dashboard", path: "/DashboardPage", icon: <FaChartPie /> },
  { name: "Shared Task", path: "/SharedTask", icon: <FaUserFriends /> },
  { name: "Settings", path: "/SettingsPage", icon: <FaCog /> },
  { name: "Logout", path: "/login", icon: <FaSignOutAlt /> },
];

function Sidebar() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    displayName: "Loading...",
    email: "Loading...",
    image: defaultProfileImage, // Use the imported local image here
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserInfo({
          displayName: "Guest User",
          email: "guest@example.com",
          image: defaultProfileImage, // Use the imported local image here
        });
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            displayName: data.data.displayName || data.data.email.split("@")[0],
            email: data.data.email,
            image: defaultProfileImage, // Use the imported local image here
            // If your backend were to provide a profile image URL,
            // you could conditionally use that here: image: data.data.profileImageUrl || defaultProfileImage,
          });
          localStorage.setItem(
            "userName",
            data.data.displayName || data.data.email.split("@")[0]
          );
          localStorage.setItem("userEmail", data.data.email);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch user profile:", errorData.error);
          setUserInfo({
            displayName: "Error User",
            email: "error@example.com",
            image: defaultProfileImage, // Use the imported local image here
          });
          if (response.status === 401) handleLogout();
        }
      } catch (error) {
        console.error("Network error or failed to fetch user profile:", error);
        setUserInfo({
          displayName: "Network Error",
          email: "check@connection.com",
          image: defaultProfileImage, // Use the imported local image here
        });
      }
    };

    fetchUserProfile();

    const handleStorageChange = (e) => {
      if (e.key === "userName" || e.key === "userEmail") {
        const storedName = localStorage.getItem("userName");
        const storedEmail = localStorage.getItem("userEmail");
        setUserInfo((prev) => ({
          ...prev,
          displayName: storedName || prev.displayName,
          email: storedEmail || prev.email,
        }));
      } else if (e.key === "token" && !e.newValue) {
        setUserInfo({
          displayName: "Guest User",
          email: "guest@example.com",
          image: defaultProfileImage, // Use the imported local image here
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="sidebar">
      <h2 className="logo">TO-DO LIST</h2>

      <div className="user-info">
        <img src={userInfo.image} alt="User" className="avatar" />
        <h3>{userInfo.displayName}</h3>
        <p>{userInfo.email}</p>
      </div>

      <nav className="navs-links">
        {links.map((link, i) => (
          <NavLink
            key={i}
            to={link.path}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={link.name === "Logout" ? handleLogout : undefined}
          >
            <span className="icon">{link.icon}</span>
            <span className="link-text">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;