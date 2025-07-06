import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Correct path
import SharedTask from "./components/SharedTask/SharedTask";
// Lazy load the AuthPages components
const LazyLogin = lazy(() => import('./components/AuthPages/Login'));
const LazySignUp = lazy(() => import('./components/AuthPages/SignUp'));
// ADDED: Lazy load Dashboard
const LazyDashboardPage = lazy(() => import("./pages/DashboardPage")); 
const LazySettingsPage = lazy(() => import("./components/Settings/SettingsPage"));
// ADDED: Import ProtectedRoute


function App() {
  return (
    <Router>
      <div className="App">
        {/* This is the fixed-size background layer - keep as is */}
        <div className="fixed-custom-background"></div>

        {/* Wrap your Routes with Suspense */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<LazyLogin pageType="login" />} />
            <Route path="/signup" element={<LazySignUp pageType="signup" />} />
            {/* Set default route to Login */}
            <Route path="/" element={<LazyLogin pageType="login" />} />
            {/* ADDED: Protected Dashboard Route */}

            <Route
              path="/DashboardPage"
              element={
                <ProtectedRoute>
                  <LazyDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/SharedTask" element={<SharedTask />} />

            <Route
              path="/SettingsPage" // Corrected route name to match Sidebar
              element={
                <ProtectedRoute>
                  <LazySettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;