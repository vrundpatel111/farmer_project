import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Common/navbar';
import '../../../Style/AddProduct.css';

const AssignedVehicle = () => {

  const userId = localStorage.getItem("userId");
  const [busyVehicles, setBusyVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8080/vehicles/user/${userId}`)
      .then(res => {
        setBusyVehicles(res.data.filter(v => v.status === "BUSY"));
      })
      .catch(err => console.error("Error fetching vehicles:", err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="add-product-container">
        <div className="add-product-card">

          <h1 className="title">🚛 Assigned Vehicles</h1>

          {loading ? (
            <p>Loading...</p>
          ) : busyVehicles.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>
              No vehicles are currently assigned (busy).
            </p>
          ) : (
            <div className="product-list">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Vehicle Name</th>
                    <th>Type</th>
                    <th>Plate</th>
                    <th>Capacity (tons)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {busyVehicles.map((v) => (
                    <tr key={v.id}>
                      <td>{v.vehicleName}</td>
                      <td>{v.vehicleType}</td>
                      <td>{v.plateNumber || "—"}</td>
                      <td>{v.capacity || "—"}</td>
                      <td>
                        <span style={{ color: "orange", fontWeight: "bold" }}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AssignedVehicle;
