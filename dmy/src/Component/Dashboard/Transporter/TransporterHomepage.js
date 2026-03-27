import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../Style/TransporterHomepage.css";
import Navbar from "../../Common/navbar";

const TransporterHomepage = () => {
  const [search, setSearch] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [businessmen, setBusinessmen] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [farmerRes, businessRes] = await Promise.all([
        axios.get("http://localhost:8080/api/farmers"),
        axios.get("http://localhost:8080/api/businessmen"),
      ]);

      setFarmers(farmerRes.data);
      setBusinessmen(businessRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeProfile = (user) => {
    console.log("Viewing profile:", user);

    navigate(`/profile/${user.id}`);
  };

  const filteredFarmers = farmers.filter((f) =>
    f.username?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBusinessmen = businessmen.filter((b) =>
    b.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Navbar search={search} setSearch={setSearch} />

      {loading ? (
        <p className="loading-text">Loading data...</p>
      ) : (
        <>
          {/* ================= Farmers Section ================= */}
          <div className="card-section">
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((f) => (
                <div className="farmer-card" key={f.id}>
                  <div className="card-top">
                    {f.profilePic ? (
                      <img className="profile-photo" src={`http://localhost:8080/uploads/${f.profilePic}`} alt="profile" style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="profile-photo"></div>
                    )}
                    <button
                      className="see-profile"
                      onClick={() => handleSeeProfile(f)}
                    >
                      See Profile
                    </button>
                  </div>

                  <div className="card-info">
                    <h3>{f.username}</h3>
                    <p><strong>Email:</strong> {f.email}</p>
                    <p><strong>Role:</strong> {f.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-result">No farmer found</p>
            )}
          </div>

          {/* ================= Businessmen Section ================= */}
          <div className="card-section">
             {filteredBusinessmen.length > 0 ? (
              filteredBusinessmen.map((b) => (
                <div className="farmer-card" key={b.id}>
                  <div className="card-top">
                    {b.profilePic ? (
                      <img className="profile-photo" src={`http://localhost:8080/uploads/${b.profilePic}`} alt="profile" style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="profile-photo"></div>
                    )}
                    <button
                      className="see-profile"
                      onClick={() => handleSeeProfile(b)}
                    >
                      See Profile
                    </button>
                  </div>

                  <div className="card-info">
                    <h3>{b.username}</h3>
                    <p><strong>Email:</strong> {b.email}</p>
                    <p><strong>Role:</strong> {b.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-result">No businessman found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TransporterHomepage;