// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Or './App.css' if that's your main CSS
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- 1. Import this

const root = ReactDOM.createRoot(document.getElementById('root'));

// <-- 2. REPLACE 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com' with your actual Client ID
// You must get this from your Google Cloud Console project.
const GOOGLE_CLIENT_ID = '978510048405-df343l6lvnmlfmhkbvunscung0f5tf8g.apps.googleusercontent.com';

root.render(
  <React.StrictMode>
    {/* <-- 3. Wrap your App component with GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you previously had `reportWebVitals();` keep it