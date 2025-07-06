// src/components/TaskCard.js
import React from 'react';
import { FaEdit, FaTrashAlt, FaShareAlt, FaCalendarAlt } from 'react-icons/fa';
import '../components/Dashboard/Dashboard.css'; // Make sure it can access task-card styles

const TaskCard = ({ task, onToggleStatus, onDelete }) => {
  const isCompleted = task.status === 'Completed';

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  // Function to calculate "days ago" or "days left"
  const getRelativeDate = (dateString, status) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = Math.abs(targetDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (status === 'Completed' && task.completedAt) {
      const completedDate = new Date(task.completedAt);
      const completionDiffTime = Math.abs(today - completedDate);
      const completionDiffDays = Math.ceil(completionDiffTime / (1000 * 60 * 60 * 24));
      if (completionDiffDays === 0) return 'Completed today';
      if (completionDiffDays === 1) return 'Completed yesterday';
      return `Completed ${completionDiffDays} days ago`;
    }

    if (targetDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (targetDate < today) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`; // Past due
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`; // Days until due
    }
  };


  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-card-title">{task.title}</h3>
        <div className="task-actions">
          {/* Checkbox for status toggle */}
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleStatus(task._id)}
            title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
          />
          {/* Edit Button (placeholder for now) */}
          <button className="icon-button edit-button" onClick={() => alert(`Edit task: ${task.title}`)} title="Edit Task">
            <FaEdit />
          </button>
          {/* Delete Button */}
          <button className="icon-button delete-button" onClick={() => onDelete(task._id)} title="Delete Task">
            <FaTrashAlt />
          </button>
          {/* Share Button (optional) */}
          {/* <button className="icon-button share-button" onClick={() => alert(`Share task: ${task.title}`)} title="Share Task">
            <FaShareAlt />
          </button> */}
        </div>
      </div>
      <p className="task-card-description">{task.description}</p>
      <div className="task-card-footer">
        {task.dueDate && (
            <span className="task-date">
                <FaCalendarAlt /> {formatDate(task.dueDate)} - {getRelativeDate(task.dueDate, task.status)}
            </span>
        )}
        <span className={`task-priority priority-${task.priority.toLowerCase()}`}>Priority: {task.priority}</span>
        <span className={`task-status status-${task.status.toLowerCase().replace(/\s/g, '-')}`}>Status: {task.status}</span>
        {/* You can add created date or category here if needed */}
        {/* <span className="task-created">Created: {new Date(task.createdAt).toLocaleDateString()}</span> */}
        {/* {task.category && <span className="task-category">{task.category.name}</span>} */}
      </div>
    </div>
  );
};

export default TaskCard;