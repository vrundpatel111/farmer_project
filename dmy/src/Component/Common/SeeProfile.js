import { useEffect, useState } from "react";
import axios from "axios";
import "../../Style/SeeProfile.css";
import { useParams } from "react-router-dom";

const VehiclesSection = ({ transporterId }) => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/vehicles/user/${transporterId}`)
      .then(res => setVehicles(res.data))
      .catch(err => console.error("Error fetching vehicles:", err));
  }, [transporterId]);

  return (
    <>
      <h2 className="product-title">🚚 Available Vehicles</h2>
      <div className="product-grid">
        {vehicles.filter(v => v.status === "AVAILABLE").length > 0 ? (
          vehicles.filter(v => v.status === "AVAILABLE").map((v) => (
            <div className="product-card" key={v.id}>
              <h3>{v.vehicleName}</h3>
              <p><strong>Type:</strong> {v.vehicleType}</p>
              {v.plateNumber && <p><strong>Plate:</strong> {v.plateNumber}</p>}
              {v.capacity && <p><strong>Capacity:</strong> {v.capacity} tons</p>}
              <p><strong>Status:</strong> <span style={{ color: "green", fontWeight: "bold" }}>{v.status}</span></p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", gridColumn: "1/-1" }}>No available vehicles</p>
        )}
      </div>
    </>
  );
};

const SeeProfile = () => {
  const { id } = useParams();
  const loggedInUserId = localStorage.getItem("userId");
  const loggedInUserRole = localStorage.getItem("role");

  // Debug logging to help identify why the form might not show
  console.log("Viewing Profile ID:", id);
  console.log("Logged In User ID:", loggedInUserId);
  console.log("Logged In User Role:", loggedInUserRole);

  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetchUserData();
    fetchAverageRating();
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUserData = () => {
    axios.get(`http://localhost:8080/api/users/${id}`)
      .then(res => {
        setUser(res.data);
        if (res.data.role === "FARMER") {
          axios.get(`http://localhost:8080/products/user/${id}`)
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  };

  const fetchAverageRating = () => {
    axios.get(`http://localhost:8080/api/feedback/rating/${id}`)
      .then(res => setAverageRating(res.data.averageRating))
      .catch(err => console.error("Error fetching rating:", err));
  };

  const fetchFeedbacks = () => {
    axios.get(`http://localhost:8080/api/feedback/user/${id}`)
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error("Error fetching feedbacks:", err));
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const feedbackData = {
      senderId: loggedInUserId,
      senderName: localStorage.getItem("username") || "Farmer",
      receiverId: id,
      rating: newFeedback.rating,
      comment: newFeedback.comment
    };

    axios.post(`http://localhost:8080/api/feedback`, feedbackData)
      .then(() => {
        alert("Feedback submitted!");
        setNewFeedback({ rating: 5, comment: "" });
        fetchAverageRating();
        fetchFeedbacks();
      })
      .catch(err => console.error("Error submitting feedback:", err));
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "star filled" : "star"}>★</span>
        ))}
        <span className="rating-value">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="profile-container">

      {/* User Info */}
      <div className="farmer-info">
        <div className="card-top" style={{ display: "flex", justifyContent: "center" }}>
          {user.profilePic ? (
            <img className="profile-img" src={`http://localhost:8080/uploads/${user.profilePic}`} alt="profile" style={{ objectFit: "cover" }} />
          ) : (
            <div className="profile-img"></div>
          )}
        </div>

        <h2>{user.username}</h2>
        {user.role === "BUSINESSMAN" && renderStars(averageRating)}
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address || "No address provided"}</p>
        <p><strong>Role:</strong> {user.role}</p>

        <div className="profile-description">
          <h3>About</h3>
          <p>{user.description || "No description provided."}</p>
        </div>
      </div>

      {/* Products Section — visible only for FARMER */}
      {user.role === "FARMER" && (
        <>
          <h2 className="product-title">Products</h2>
          <div className="product-grid">
            {products.filter(p => p.status === "AVAILABLE").length > 0 ? (
              products.filter(p => p.status === "AVAILABLE").map((p) => (
                <div className="product-card" key={p.id}>
                  <h3>{p.productName}</h3>
                  <p><strong>Price:</strong> ₹{p.price}</p>
                  <p><strong>Quantity:</strong> {p.quantity} kg</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", gridColumn: "1/-1", color: "white" }}>No products found</p>
            )}
          </div>
        </>
      )}

      {/* Vehicles Section — visible only for TRANSPORTER */}
      {user.role === "TRANSPORTER" && (
        <VehiclesSection transporterId={id} />
      )}

      {/* Feedback Section for Businessman */}
      {user.role === "BUSINESSMAN" && (
        <div className="feedback-section">
          <h2 className="section-title">Feedbacks & Ratings</h2>

          {/* Feedback Form — only for Farmer viewing Businessman */}
          {loggedInUserRole === "FARMER" && (
            <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
              <h3>Give Feedback</h3>
              <div className="rating-input">
                <label>Rating: </label>
                <select
                  value={newFeedback.rating}
                  onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <textarea
                placeholder="Write your feedback here..."
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                required
              />
              <button type="submit">Submit Feedback</button>
            </form>
          )}

          {/* Feedback List */}
          <div className="feedback-list">
            {feedbacks.length > 0 ? (
              feedbacks.map((f) => (
                <div className="feedback-item" key={f.id}>
                  <div className="feedback-header">
                    <span className="sender-name">{f.senderName}</span>
                    <span className="feedback-date">{new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>
                  {renderStars(f.rating)}
                  <p className="feedback-comment">{f.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "white" }}>No feedbacks yet.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SeeProfile;