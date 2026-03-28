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

  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:8080/products/user/${id}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address || "No address provided"}</p>
        <p><strong>Role:</strong> {user.role}</p>
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
              <p style={{ textAlign: "center", gridColumn: "1/-1" }}>No products found</p>
            )}
          </div>
        </>
      )}

      {/* Vehicles Section — visible only for TRANSPORTER */}
      {user.role === "TRANSPORTER" && (
        <VehiclesSection transporterId={id} />
      )}

    </div>
  );
};

export default SeeProfile;