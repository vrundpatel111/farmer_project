import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MeetingCard from "./MeetingCard";
import "../../Style/AddProduct.css";

const NotificationCenter = () => {
    const [meetingsHistory, setMeetingsHistory] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || localStorage.getItem("userId");
    const role = user.role;
    const navigate = useNavigate();

    const fetchData = async () => {
        if (!userId) return;
        try {
            const [sentRes, receivedRes, notifRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/meetings/farmer/${userId}`),
                axios.get(`http://localhost:8080/api/meetings/receiver/${userId}`),
                axios.get(`http://localhost:8080/api/notifications/user/${userId}`)
            ]);

            const sentData = Array.isArray(sentRes.data) ? sentRes.data : [];
            const receivedData = Array.isArray(receivedRes.data) ? receivedRes.data : [];
            
            // Pending requests for the "Meeting Requests" section
            setPendingRequests(receivedData.filter(m => m.status === 'PENDING'));

            // Process meetings history
            const sent = sentData.map(m => ({ ...m, type: 'Sent' }));
            const received = receivedData
                .filter(m => m.status && m.status.toUpperCase() !== 'PENDING')
                .map(m => ({ ...m, type: 'Received' }));

            const merged = [...sent, ...received].sort((a, b) => new Date(b.meetingTime) - new Date(a.meetingTime));
            setMeetingsHistory(merged);
            
            // Notifications
            const notifData = Array.isArray(notifRes.data) ? notifRes.data : [];
            setNotifications(notifData);

            // Mark unread notifications as read
            const unread = notifData.filter(n => !n.read);
            if (unread.length > 0) {
                await Promise.all(unread.map(n => axios.put(`http://localhost:8080/api/notifications/read/${n.id}`)));
            }
        } catch (error) {
            console.error("Error fetching notification center data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const handleBack = () => {
        if (role === 'BUSINESSMAN') navigate("/business-dashboard");
        else if (role === 'TRANSPORTER') navigate("/transporter-dashboard");
        else navigate("/farmer-dashboard");
    };

    if (loading) return <div className="add-product-container"><p>Loading Notification Center...</p></div>;

    return (
        <div className="add-product-container">
            <div className="add-product-card" style={{ maxWidth: '900px' }}>
                <h1 className="title" style={{ textAlign: 'center', fontSize: '2rem' }}>🔔 Notification Center</h1>

                {/* PENDING MEETING REQUESTS */}
                <div className="product-list" style={{ marginBottom: '40px' }}>
                    <h2 className="title" style={{ fontSize: '1.5rem', color: '#1976d2' }}>🤝 Pending Meeting Requests</h2>
                    {pendingRequests.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>No pending requests.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {pendingRequests.map((meeting) => (
                                <MeetingCard key={meeting.id} meeting={meeting} onAction={fetchData} />
                            ))}
                        </div>
                    )}
                </div>

                {/* SYSTEM NOTIFICATIONS */}
                <div className="product-list" style={{ marginBottom: '40px' }}>
                    <h2 className="title" style={{ fontSize: '1.5rem', color: '#4caf50' }}>📜 Recent Notifications</h2>
                    {notifications.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>No new system notifications.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {notifications.map(n => (
                                <li key={n.id} style={{ 
                                    backgroundColor: n.read ? '#f9f9f9' : '#e8f5e9', 
                                    padding: '15px', 
                                    marginBottom: '10px', 
                                    borderRadius: '8px',
                                    borderLeft: n.read ? '5px solid #eee' : '5px solid #4caf50',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ fontWeight: n.read ? 'normal' : 'bold' }}>{n.message}</div>
                                    <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                                        {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* MEETING HISTORY */}
                <div className="product-list">
                    <h2 className="title" style={{ fontSize: '1.5rem', color: '#7b1fa2' }}>🕰️ Meeting History</h2>
                    {meetingsHistory.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>No meeting history found.</p>
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
                                {meetingsHistory.map((m) => (
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

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button className="submit-btn" onClick={handleBack} style={{ padding: '10px 30px' }}>
                        ⬅ Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;
