import React, { useEffect, useState } from "react";
import {
  FaShareAlt,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaRedo,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskFormModal from "./TaskFormModal";
import ShareTaskModal from "./ShareTaskModal";
import "./TaskList.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [shareModalTaskId, setShareModalTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("date-desc");

  const API = "http://localhost:5000/api";

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilterSort();
  }, [tasks, sortOption]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error();
      setTasks(await res.json());
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilterSort = () => {
    let arr = [...tasks];
    const today = new Date().toISOString().split("T")[0];

    switch (sortOption) {
      case "date-asc":
        arr.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "date-desc":
        arr.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "due-today":
        arr = arr.filter(
          (t) => new Date(t.date).toISOString().split("T")[0] === today
        );
        break;
      case "overdue":
        arr = arr.filter((t) => new Date(t.date) < new Date(today));
        break;
      case "priority-low":
        arr = arr.filter((t) => t.priority === "Low");
        break;
      case "priority-medium":
        arr = arr.filter((t) => t.priority === "Medium");
        break;
      case "priority-high":
        arr = arr.filter((t) => t.priority === "High");
        break;
      default:
        break;
    }

    setFilteredTasks(arr);
  };

  const toastify = (msg, type = "info") => toast[type](msg);

  const handleSave = async (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => form.append(k, v ?? ""));
    const url = editTask ? `${API}/tasks/${editTask._id}` : `${API}/tasks`;
    const res = await fetch(url, {
      method: editTask ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: form,
    });

    if (res.ok) {
      const saved = await res.json();
      setTasks((prev) =>
        editTask
          ? prev.map((t) => (t._id === saved._id ? saved : t))
          : [...prev, saved]
      );
      toastify(editTask ? "Task updated!" : "Task added!", "success");
      setModalOpen(false);
    } else {
      toastify("Failed to save task", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete task?")) return;
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toastify("Task deleted!", "info");
    } else {
      toastify("Delete failed", "error");
    }
  };

  const handleToggle = async (task) => {
    const updated = {
      ...task,
      status: task.status === "Completed" ? "In Progress" : "Completed",
    };

    const res = await fetch(`${API}/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
      toastify("Status updated!", "success");
    } else {
      toastify("Status update failed", "error");
    }
  };

  const handleShare = async (id, recipients) => {
    const res = await fetch(`${API}/tasks/${id}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ recipients }),
    });

    toastify(
      res.ok ? "Task shared!" : "Share failed",
      res.ok ? "success" : "error"
    );
  };

  if (loading) return <div className="loading">Loading…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="todo-section">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="todo-header">
        <h3>My Tasks</h3>
        <div className="controls">
          <select
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="due-today">Due Today</option>
            <option value="overdue">Overdue</option>
            <option value="priority-high">High Priority</option>
            <option value="priority-medium">Medium Priority</option>
            <option value="priority-low">Low Priority</option>
          </select>
          <button
            className="btn primary"
            onClick={() => {
              setEditTask(null);
              setModalOpen(true);
            }}
          >
            + Add Task
          </button>
        </div>
      </header>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-info">
                <span className="task-date">
                  {new Date(task.date).toLocaleDateString()}
                </span>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <div className="meta">
                  <span
                    className={`tag priority ${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`tag status ${task.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {task.status}
                  </span>
                  <span className="tag">{task.progress}</span>
                </div>
              </div>
              <div className="task-actions">
                <button
                  title="Toggle Status"
                  onClick={() => handleToggle(task)}
                >
                  {task.status === "Completed" ? <FaRedo /> : <FaCheckCircle />}
                </button>
                <button
                  title="Share"
                  onClick={() => setShareModalTaskId(task._id)}
                >
                  <FaShareAlt />
                </button>
                <button
                  title="Edit"
                  onClick={() => {
                    setEditTask(task);
                    setModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button title="Delete" onClick={() => handleDelete(task._id)}>
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <TaskFormModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editTask}
        />
      )}

      {shareModalTaskId && (
        <ShareTaskModal
          taskId={shareModalTaskId}
          onClose={() => setShareModalTaskId(null)}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

export default TaskList;
