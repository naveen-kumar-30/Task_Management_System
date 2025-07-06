import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">
      <button
        className="toggle-sidebar-button"
        onClick={() =>
          document.querySelector(".sidebar").classList.toggle("open")
        }
      >
        ☰
      </button>
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
