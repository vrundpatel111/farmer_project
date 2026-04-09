import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = ({ search, setSearch }) => {

  const [profilePic, setProfilePic] = useState("");
  const [notifCount, setNotifCount] = useState(0);
  const [role, setRole] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setRole(user.role || "");

    if (userId) {
      // Fetch Profile
      axios.get(`http://localhost:8080/api/profile/${userId}`)
        .then(res => {
          if (res.data && res.data.profilePic) {
            setProfilePic(`http://localhost:8080/uploads/${res.data.profilePic}`);
          }
        })
        .catch(err => {
          console.error("Navbar failed to fetch user profile", err);
        });

      // Fetch Notifications
      axios.get(`http://localhost:8080/api/notifications/user/${userId}`)
        .then(res => {
          const unread = res.data.filter(n => !n.read).length;
          setNotifCount(unread);
        })
        .catch(err => console.error("Failed to fetch notifications", err));
    }
  }, [userId]);


  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/notifications" className="notification-icon-wrapper" style={{ position: 'relative', textDecoration: 'none', fontSize: '24px', marginLeft: '15px' }}>
          🔔
          {notifCount > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: '-5px', 
              right: '-8px', 
              backgroundColor: 'red', 
              color: 'white', 
              borderRadius: '50%', 
              padding: '2px 6px', 
              fontSize: '12px', 
              fontWeight: 'bold',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {notifCount}
            </span>
          )}
        </Link>
      </div>

      <div className="nav-right">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        {role === "FARMER" && (
          <>
            <button><Link to="/product-detail">Product Detail</Link></button>
            <button><Link to="/add-product">Add Product</Link></button>
          </>
        )}

        {role === "BUSINESSMAN" && (
          <>
            <button><Link to="/businessman-product-detail">Product Detail</Link></button>
            <button><Link to="/businessman-add-product">My Products</Link></button>
          </>
        )}

        {role === "TRANSPORTER" && (
          <>
            <button><Link to="/my-vehicle">My Vehicle</Link></button>
            <button><Link to="/assigned-vehicle">Assigned Vehicle</Link></button>
            <button><Link to="/track-vehicle">Track My Vehicle</Link></button>
          </>
        )}

        <div className="profile-btn">
          <Link to="/profile">
            {profilePic ? (
              <img
                src={profilePic}
                alt="profile"
                width="40"
                height="40"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: 40, height: 40, backgroundColor: "#eee", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <span style={{ fontSize: "12px", color: "#888" }}>User</span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
