import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../../Style/AddProduct.css";

export const PendingOrders = () => {
  const [meetings, setMeetings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id || localStorage.getItem("userId");
  const role = user.role;
  const navigate = useNavigate();

  const handleBack = () => {
    if (role === 'BUSINESSMAN') navigate("/business-dashboard");
    else if (role === 'TRANSPORTER') navigate("/transporter-dashboard");
    else navigate("/farmer-dashboard");
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data for userId:", userId, "Role:", role);
      try {
        const [sentRes, receivedRes, notifRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/meetings/farmer/${userId}`),
          axios.get(`http://localhost:8080/api/meetings/receiver/${userId}`),
          axios.get(`http://localhost:8080/api/notifications/user/${userId}`)
        ]);

        console.log("Sent Requests:", sentRes.data);
        console.log("Received Requests:", receivedRes.data);

        // Process meetings safely
        const sentData = Array.isArray(sentRes.data) ? sentRes.data : [];
        const receivedData = Array.isArray(receivedRes.data) ? receivedRes.data : [];

        const sent = sentData.map(m => ({ ...m, type: 'Sent' }));
        const received = receivedData
          .filter(m => m.status && m.status.toUpperCase() !== 'PENDING') // Be case insensitive
          .map(m => ({ ...m, type: 'Received' }));

        const merged = [...sent, ...received].sort((a, b) => {
          const dateA = new Date(a.meetingTime);
          const dateB = new Date(b.meetingTime);
          return dateB - dateA;
        });

        console.log("Final Merged Meetings:", merged);
        setMeetings(merged);
        setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);

        // Mark unread notifications as read
        const unread = (notifRes.data || []).filter(n => !n.read);
        if (unread.length > 0) {
          await Promise.all(unread.map(n => axios.put(`http://localhost:8080/api/notifications/read/${n.id}`)));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
    else setLoading(false);
  }, [userId, role]);

  if (loading) return <div className="add-product-container"><p>Loading...</p></div>;

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        
        {/* Debug info - temporary */}
        <div style={{ fontSize: '10px', color: '#ccc', textAlign: 'right' }}>
          ID: {userId} | Role: {role}
        </div>

        {/* NOTIFICATIONS SECTION */}
        <div className="product-list" style={{ marginBottom: '40px' }}>
          <h1 className="title">🔔 Recent Notifications</h1>
          {notifications.length === 0 ? (
            <p>No new notifications.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {notifications.map(n => (
                <li key={n.id} style={{ 
                  backgroundColor: n.read ? '#f9f9f9' : '#e8f5e9', 
                  padding: '10px', 
                  marginBottom: '10px', 
                  borderRadius: '5px',
                  borderLeft: n.read ? 'none' : '5px solid #4caf50'
                }}>
                  {n.message}
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <h1 className="title">🤝 Your Meetings History</h1>
        
        <div className="product-list">
          {meetings.length === 0 ? (
            <p>No meeting history found.</p>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Other Party</th>
                  <th>Role</th>
                  <th>Meeting Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((m) => (
                  <tr key={m.id}>
                    <td>
                       <span style={{ 
                        color: m.type === 'Sent' ? '#1976d2' : '#7b1fa2', 
                        fontWeight: 'bold' 
                      }}>{m.type}</span>
                    </td>
                    <td>{m.type === 'Sent' ? m.receiver?.username : m.farmer?.username}</td>
                    <td>{m.type === 'Sent' ? m.receiver?.role : m.farmer?.role}</td>
                    <td>{new Date(m.meetingTime).toLocaleString()}</td>
                    <td>
                      <span style={{ 
                        color: m.status === "ACCEPTED" ? "green" : m.status === "REJECTED" ? "red" : "#fbc02d",
                        fontWeight: 'bold'
                      }}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button className="submit-btn" onClick={() => navigate("/farmer-dashboard")}>
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;