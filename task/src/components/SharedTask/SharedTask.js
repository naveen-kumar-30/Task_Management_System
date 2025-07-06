import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import "./SharedTask.css";

function SharedTask() {
  const [sharedByMe, setSharedByMe] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "https://task-management-system-jyrv.onrender.com/api";

  useEffect(() => {
    const fetchSharedTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const [fromMeRes, toMeRes] = await Promise.all([
          fetch(`${API_BASE_URL}/tasks/shared-by-me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/tasks/shared-with-me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const fromMeJson = await fromMeRes.json();
        const toMeJson = await toMeRes.json();

        setSharedByMe(Array.isArray(fromMeJson.data) ? fromMeJson.data : []);
        setSharedWithMe(Array.isArray(toMeJson.data) ? toMeJson.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching shared tasks:", err);
        setError("Failed to load shared tasks.");
        setLoading(false);
      }
    };

    fetchSharedTasks();
  }, []);

  const handleRemoveSharedUser = async (taskId, email) => {
    const token = localStorage.getItem("token");
    const confirmed = window.confirm(`Remove access for ${email}?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/unshare`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to unshare task.");
      }

      setSharedByMe((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? {
                ...task,
                sharedWith: task.sharedWith.filter((e) => e !== email),
              }
            : task
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to remove user from shared task.");
    }
  };

  return (
    <Layout>
      <div className="shared-task-container">
        <h2>Shared Tasks</h2>

        {loading && <p className="loading-message">Loading shared tasks...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <>
            <div className="shared-section">
              <h3>✅ Tasks Shared By Me</h3>
              {sharedByMe.length === 0 ? (
                <p>You haven't shared any tasks yet.</p>
              ) : (
                sharedByMe.map((task) => (
                  <div key={task._id} className="shared-card">
                    <h4>{task.title}</h4>
                    <p>
                      <strong>Shared With:</strong>
                    </p>
                    <ul>
                      {task.sharedWith.map((email, idx) => (
                        <li key={idx}>
                          {email}
                          <button
                            className="unshare-btn"
                            onClick={() =>
                              handleRemoveSharedUser(task._id, email)
                            }
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>

            <div className="shared-section">
              <h3>📥 Tasks Shared With Me</h3>
              {sharedWithMe.length === 0 ? (
                <p>No one has shared tasks with you yet.</p>
              ) : (
                sharedWithMe.map((task) => (
                  <div key={task._id} className="shared-card">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <p>
                      <strong>From:</strong> {task.ownerEmail || "Unknown"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default SharedTask;
