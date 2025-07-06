import React, { useState, useEffect } from "react";
import "./AccountInfo.css";
import  photo from './image.png';
function AccountInfo() {
  const [profile, setProfile] = useState(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");
    return {
      name: storedUserName || "Loading Name...",
      email: storedUserEmail || "loading@example.com",
      image: photo,
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  useEffect(() => {
    setTempProfile(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({ ...tempProfile, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setTempProfile({ ...tempProfile, image: imageURL });
    }
  };

  const handleSave = async () => {
    setProfile(tempProfile);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Not logged in.");
        return;
      }

      const nameParts = tempProfile.name.split(" ");
      const response = await fetch("https://task-management-system-jyrv.onrender.com/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: tempProfile.email,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("userName", data.data.displayName);
        localStorage.setItem("userEmail", data.data.email);
        setProfile({
          name: data.data.displayName,
          email: data.data.email,
          image: tempProfile.image,
        });
      } else {
        alert(data.error || "Failed to update");
        setTempProfile(profile);
      }
    } catch (err) {
      alert("Network error");
      setTempProfile(profile);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="account-container">
      <div className="account-card">
        <h2>Account Information</h2>
        <img src={tempProfile.image} alt="Profile" className="avatar-preview" />
        {isEditing && (
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        )}
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={tempProfile.name}
          onChange={handleChange}
          readOnly={!isEditing}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={tempProfile.email}
          onChange={handleChange}
          readOnly={!isEditing}
        />
        <div className="account-buttons">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;
