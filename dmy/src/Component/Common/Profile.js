import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {

  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (!userId) return;
      const res = await axios.get(
        `http://localhost:8080/api/profile/${userId}`
      );
      const data = res.data;
      if (!data.description) data.description = ""; // Initialize description
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdate = async () => {

    const formData = new FormData();

    formData.append("username", user.username || "");
    formData.append("address", user.address || "");
    formData.append("description", user.description || "");

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Updated User Response:", response.data);
      alert("Profile Updated Successfully!");

      setEditMode(false);
      setImage(null);
      fetchProfile();
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Error updating profile! Check console for details.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="profile-container" style={{ padding: "20px", maxWidth: "450px", margin: "50px auto", textAlign: "center", border: "1px solid #eee", borderRadius: "15px", backgroundColor: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>

      <div style={{ position: "relative", display: "inline-block" }}>
        {user.profilePic ? (
          <img
            src={`http://localhost:8080/uploads/${user.profilePic}`}
            alt="profile"
            style={{ width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", marginBottom: "15px", border: "3px solid #007bff", padding: "3px" }}
          />
        ) : (
          <div style={{ width: 130, height: 130, backgroundColor: "#f8f9fa", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px auto", color: "#adb5bd", fontSize: "14px", border: "2px dashed #dee2e6" }}>
            No Image
          </div>
        )}
      </div>

      {editMode && (
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "5px" }}>Change Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ fontSize: "14px", width: "100%", maxWidth: "200px" }}
          />
        </div>
      )}

      {editMode ? (
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={user.username || ""}
            onChange={handleChange}
            style={{ padding: "12px", width: "100%", boxSizing: "border-box", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }}
          />
        </div>
      ) : (
        <h2 style={{ margin: "5px 0", color: "#212529", fontWeight: "700" }}>{user.username || "Unknown"}</h2>
      )}

      <p style={{ margin: "5px 0", color: "#6c757d", fontSize: "15px" }}><strong>Email:</strong> {user.email || "N/A"}</p>

      {editMode ? (
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={user.address || ""}
            onChange={handleChange}
            style={{ padding: "12px", width: "100%", boxSizing: "border-box", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }}
          />
        </div>
      ) : (
        <p style={{ margin: "5px 0", color: "#6c757d", fontSize: "15px" }}><strong>Address:</strong> {user.address || "Not provided"}</p>
      )}

      {editMode ? (
        <div style={{ marginBottom: "25px", textAlign: "left" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "5px", color: "#495057" }}>Description</label>
          <textarea
            name="description"
            placeholder="Tell us about yourself..."
            value={user.description || ""}
            onChange={handleChange}
            style={{ padding: "12px", width: "100%", height: "120px", boxSizing: "border-box", borderRadius: "8px", border: "1px solid #ddd", resize: "none", fontSize: "14px", lineHeight: "1.5" }}
          />
        </div>
      ) : (
        <div style={{ margin: "20px 0 30px 0", textAlign: "left", padding: "18px", backgroundColor: "#f8f9fa", borderRadius: "12px", border: "1px solid #e9ecef" }}>
          <h4 style={{ marginTop: 0, marginBottom: "8px", fontSize: "15px", color: "#343a40", borderBottom: "1px solid #dee2e6", paddingBottom: "5px" }}>Description</h4>
          <p style={{ margin: 0, color: "#495057", fontSize: "14px", lineHeight: "1.6" }}>{user.description || "No description provided."}</p>
        </div>
      )}

      {!editMode ? (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={() => setEditMode(true)} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold" }}>
            Edit Profile
          </button>
          <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold" }}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <button onClick={handleUpdate} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", marginRight: "10px", fontWeight: "bold" }}>
            Update
          </button>
          <button onClick={() => { setEditMode(false); setImage(null); fetchProfile(); }} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold" }}>
            Cancel
          </button>
        </div>
      )}

    </div>
  );
};

export default Profile;