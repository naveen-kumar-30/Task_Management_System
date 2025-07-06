import React, { useState } from "react";
import "./ShareTaskModal.css";

function ShareTaskModal({ onClose, taskId, onShare }) {
  const [inputValue, setInputValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleInputKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      if (!selectedUsers.includes(inputValue.trim())) {
        setSelectedUsers([...selectedUsers, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      alert("Please enter at least one email or username");
      return;
    }

    for (let user of selectedUsers) {
      await onShare(taskId, user);
    }

    setSelectedUsers([]);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Share Task</h3>
        <form onSubmit={handleSubmit}>
          <label>Email(s) or Username(s):</label>
          <div className="chip-input-wrapper">
            {selectedUsers.map((user, i) => (
              <div className="chip" key={i}>
                {user}
                <span
                  className="remove-chip"
                  onClick={() => handleRemoveUser(user)}
                >
                  ×
                </span>
              </div>
            ))}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Enter and press Enter or comma"
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="btn-share">
              Share
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShareTaskModal;
