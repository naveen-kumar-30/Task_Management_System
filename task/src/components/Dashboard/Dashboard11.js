import React, { useState, useEffect } from "react";
import WelcomeSection from "./WelcomeSection";
import TaskList from "./TaskList";
import CircularProgress from '../CircularProgress/CircularProgress';
import "./Dashboard11.css";

function Dashboard({ searchTerm, filter }) {
  const [displayName, setDisplayName] = useState("Guest");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setDisplayName(storedName);
    }
    const handleStorageChange = (e) => {
      if (e.key === 'userName') {
        setDisplayName(e.newValue || "Guest");
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No authentication token found.");
          setLoading(false);
          setTasks([]);
          return;
        }

        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        if (filter && filter !== 'all') {
          queryParams.append('filter', filter);
        }

        const url = `${API_BASE_URL}/tasks?${queryParams.toString()}`;
        console.log("Fetching tasks from Dashboard with URL:", url);

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const responseData = await response.json();

        // ⭐ NEW: Log the raw response data here ⭐
        console.log("Backend Raw Response (Dashboard):", responseData);

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            setError("Session expired. Please log in again.");
          } else {
            setError(responseData.error || `HTTP error! status: ${response.status}`);
          }
          setTasks([]);
          return;
        }

        // ⭐ MODIFIED: Improve the check for valid task array ⭐
        if (responseData.success && Array.isArray(responseData.data) && responseData.data.every(item => typeof item === 'object' && item !== null && '_id' in item)) {
          setTasks(responseData.data);
        } else {
          // ⭐ IMPROVED ERROR LOGGING ⭐
          console.error(
            "Backend response 'data' is not a valid array of task objects:",
            "Success status:", responseData.success,
            "Is data array:", Array.isArray(responseData.data),
            "Data content:", responseData.data
          );
          setError("Unexpected data format from server. Displaying no tasks.");
          setTasks([]);
        }

      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again. (Network Error)");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [searchTerm, filter]);

  const handleSaveTask = async (taskData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }

    const formData = new FormData();
    for (const key in taskData) {
      if (key === 'image' && taskData[key] instanceof File) {
        formData.append(key, taskData[key]);
      } else if (key === 'image' && (taskData[key] === null || taskData[key] === 'null' || taskData[key] === undefined)) {
        formData.append('clearImage', 'true');
      }
      else {
        formData.append(key, taskData[key]);
      }
    }

    try {
      let response;
      let url;

      if (taskData._id) {
        url = `${API_BASE_URL}/tasks/${taskData._id}`;
        response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        url = `${API_BASE_URL}/tasks`;
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
      }

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.error || `HTTP error! status: ${response.status}`);
      }

      const savedTask = responseJson.data;

      if (taskData._id) {
        setTasks((prev) =>
          prev.map((t) => (t._id === savedTask._id ? savedTask : t))
        );
      } else {
        setTasks((prev) => [...prev, savedTask]);
      }
    } catch (error) {
      console.error("Error saving task:", error);
      alert(`Failed to save task: ${error.message}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.error || `HTTP error! status: ${response.status}`);
      }

      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(`Failed to delete task: ${error.message}`);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const notStartedTasks = tasks.filter(task => task.status === 'Not Started').length;

  const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const inProgressPercentage = totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0;
  const notStartedPercentage = totalTasks > 0 ? (notStartedTasks / totalTasks) * 100 : 0;

  return (
    <div>
      <WelcomeSection userName={displayName} />

      {/* ⭐ ADDED: Dashboard title for task status ⭐ */}
     

      <TaskList
        tasks={tasks}
        searchTerm={searchTerm}
        filter={filter}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default Dashboard;