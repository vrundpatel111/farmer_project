import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Common/navbar";
import "../../../Style/AddProduct.css";
import { useNavigate } from "react-router-dom";

const MyVehicle = () => {

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [vehicle, setVehicle] = useState({
    vehicleName: "",
    vehicleType: "",
    plateNumber: "",
    capacity: "",
    status: "AVAILABLE",
  });

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // FETCH VEHICLES
  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/vehicles/user/${userId}`);
      setVehicles(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  // ADD OR UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`http://localhost:8080/vehicles/${editId}`, {
          ...vehicle,
          capacity: vehicle.capacity ? Number(vehicle.capacity) : null,
        });
        alert("Vehicle Updated Successfully ✅");
        setEditId(null);
      } else {
        await axios.post(`http://localhost:8080/vehicles/add/${userId}`, {
          ...vehicle,
          capacity: vehicle.capacity ? Number(vehicle.capacity) : null,
        });
        alert("Vehicle Added Successfully ✅");
      }
      setVehicle({ vehicleName: "", vehicleType: "", plateNumber: "", capacity: "", status: "AVAILABLE" });
      fetchVehicles();
    } catch (error) {
      console.error("Operation error:", error);
      alert("Failed operation ❌");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (vehicleId) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      await axios.delete(`http://localhost:8080/vehicles/${vehicleId}`);
      fetchVehicles();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // EDIT
  const handleEdit = (v) => {
    setVehicle({
      vehicleName: v.vehicleName,
      vehicleType: v.vehicleType,
      plateNumber: v.plateNumber || "",
      capacity: v.capacity || "",
      status: v.status,
    });
    setEditId(v.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="add-product-container">
        <div className="add-product-card">

          <h1 className="title">
            {editId ? "✏ Update Vehicle" : "🚚 Add New Vehicle"}
          </h1>

          <form className="add-product-form" onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Vehicle Name</label>
              <input
                type="text"
                name="vehicleName"
                value={vehicle.vehicleName}
                onChange={handleChange}
                placeholder="e.g. Truck A-101"
                required
              />
            </div>

            <div className="input-group">
              <label>Vehicle Type</label>
              <input
                type="text"
                name="vehicleType"
                value={vehicle.vehicleType}
                onChange={handleChange}
                placeholder="e.g. Heavy Loader, Mini Van"
                required
              />
            </div>

            <div className="input-group">
              <label>Plate Number</label>
              <input
                type="text"
                name="plateNumber"
                value={vehicle.plateNumber}
                onChange={handleChange}
                placeholder="e.g. GJ-01-AB-1234"
              />
            </div>

            <div className="input-group">
              <label>Capacity (tons)</label>
              <input
                type="number"
                name="capacity"
                value={vehicle.capacity}
                onChange={handleChange}
                placeholder="e.g. 5"
              />
            </div>

            <div className="input-group">
              <label>Status</label>
              <select name="status" value={vehicle.status} onChange={handleChange}>
                <option value="AVAILABLE">Available</option>
                <option value="BUSY">Busy</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <button className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : editId ? "✔ Update Vehicle" : "➕ Add Vehicle"}
            </button>

          </form>

          {/* VEHICLE TABLE */}
          <div className="product-list">
            <h2>My Vehicles</h2>
            {vehicles.length === 0 ? (
              <p>No vehicles added yet.</p>
            ) : (
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Plate</th>
                    <th>Capacity (tons)</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <td>{v.vehicleName}</td>
                      <td>{v.vehicleType}</td>
                      <td>{v.plateNumber || "—"}</td>
                      <td>{v.capacity || "—"}</td>
                      <td>
                        <span style={{ color: v.status === "AVAILABLE" ? "green" : v.status === "BUSY" ? "orange" : "red", fontWeight: "bold" }}>
                          {v.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEdit(v)}>✏ Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(v.id)}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button className="submit-btn" onClick={() => navigate("/transporter-dashboard")}>
                ⬅ Back to Dashboard
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyVehicle;
