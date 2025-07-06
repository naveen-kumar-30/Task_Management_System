import React, { useState, useEffect } from "react";
import "./TaskFormModal.css";

function TaskFormModal({ onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    priority: "Medium",
    description: "",
    status: "Not Started",
    progress: "0%",
    image: null,
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date ? initialData.date.split("T")[0] : "",
        image: null, // prevent sending string during form submission
      });
      if (initialData.image) {
        setImagePreviewUrl(`https://task-management-system-jyrv.onrender.com${initialData.image}`);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        setImagePreviewUrl(URL.createObjectURL(file));
      } else {
        setImagePreviewUrl(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleClearImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreviewUrl(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{initialData ? "Edit Task" : "Add Task"}</h3>
        <form onSubmit={handleSubmit} className="task-form">
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
          />

          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Not Started</option>
          </select>

          <label>Progress</label>
          <input
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            placeholder="e.g. 50%"
            required
          />

          <label>Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          {imagePreviewUrl && (
            <div className="image-preview">
              <img
                src={imagePreviewUrl}
                alt="Preview"
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  marginTop: "10px",
                }}
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="clear-image-btn"
              >
                Clear Image
              </button>
            </div>
          )}

          <div className="modal-buttons">
            <button type="submit">{initialData ? "Update" : "Add"}</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormModal;
