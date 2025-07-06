// src/components/Settings/SettingsPage.js
import React from "react";
import Layout from "../layout/Layout";
import AccountInfo from "./AccountInfo";
import "./Settings.css"; // Optional for page-specific styles

function SettingsPage() {
  return (
    <Layout>
      <div className="settings-wrapper">
        <AccountInfo />
      </div>
    </Layout>
  );
}

export default SettingsPage;
