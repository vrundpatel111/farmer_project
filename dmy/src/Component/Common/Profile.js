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
      setUser(res.data);
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

    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.put(
        `http://localhost:8080/api/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Profile Updated");

      setEditMode(false);
      setImage(null);
      fetchProfile();
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Error updating profile!");
    }
  };

  return (
    <div className="profile-container" style={{ padding: "20px", maxWidth: "400px", margin: "0 auto", textAlign: "center", border: "1px solid #ddd", borderRadius: "10px", marginTop: "50px" }}>

      {user.profilePic ? (
        <img
          src={`http://localhost:8080/uploads/${user.profilePic}`}
          alt="profile"
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginBottom: "15px" }}
        />
      ) : (
        <div style={{ width: 120, height: 120, backgroundColor: "#eee", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px auto", color: "#888", fontSize: "14px" }}>
          No Image
        </div>
      )}

      {editMode && (
        <div style={{ marginBottom: "15px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ fontSize: "14px" }}
          />
        </div>
      )}

      {editMode ? (
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={user.username || ""}
            onChange={handleChange}
            style={{ padding: "8px", width: "100%", boxSizing: "border-box" }}
          />
        </div>
      ) : (
        <h2 style={{ margin: "10px 0" }}>{user.username || "Unknown"}</h2>
      )}

      <p style={{ margin: "5px 0", color: "#555" }}>Email: {user.email || "N/A"}</p>

      {editMode ? (
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={user.address || ""}
            onChange={handleChange}
            style={{ padding: "8px", width: "100%", boxSizing: "border-box" }}
          />
        </div>
      ) : (
        <p style={{ margin: "5px 0 20px 0", color: "#555" }}>Address: {user.address || "Not provided"}</p>
      )}

      {!editMode ? (
        <button onClick={() => setEditMode(true)} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}>
          Edit Profile
        </button>
      ) : (
        <div>
          <button onClick={handleUpdate} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", marginRight: "10px" }}>
            Update
          </button>
          <button onClick={() => { setEditMode(false); setImage(null); fetchProfile(); }} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px" }}>
            Cancel
          </button>
        </div>
      )}

    </div>
  );
};

export default Profile;