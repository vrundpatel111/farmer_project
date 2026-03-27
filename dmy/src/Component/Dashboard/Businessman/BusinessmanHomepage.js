import { useState, useEffect } from "react";
import axios from "axios";
import "../../../Style/BusinessmanHomepage.css";
import Navbar from "../../Common/navbar";
import { useNavigate } from "react-router-dom";
import ScheduleMeeting from "../../Common/ScheduleMeeting";

const BusinessmanHomepage = () => {

  const [search, setSearch] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const [farmerRes, transporterRes] = await Promise.all([
        axios.get("http://localhost:8080/api/farmers"),
        axios.get("http://localhost:8080/api/transporters"),
      ]);

      setFarmers(farmerRes.data);
      setTransporters(transporterRes.data);

    } catch (error) {

      console.error("Error fetching data:", error);

    } finally {

      setLoading(false);

    }
  };

  const filteredFarmers = farmers.filter((f) =>
    f.username?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTransporters = transporters.filter((t) =>
    t.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSeeProfile = (user) => {
    navigate(`/profile/${user.id}`);
  };

  const handleScheduleMeeting = (user) => {
    setSelectedUser(user);
    setShowMeetingModal(true);
  };

  return (

    <div className="dashboard">

      <Navbar search={search} setSearch={setSearch} />

      {loading ? (
        <p className="loading-text">Loading data...</p>
      ) : (
        <>

          {/* Farmers */}

          <div className="card-section">

            {filteredFarmers.map((f) => (

              <div className="farmer-card" key={f.id}>

                <div className="card-top">

                  {f.profilePic ? (
                    <img className="profile-photo" src={`http://localhost:8080/uploads/${f.profilePic}`} alt="profile" />
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

                <button
                  className="meeting-card-btn"
                  onClick={() => handleScheduleMeeting(f)}
                >
                  Schedule Meeting
                </button>

              </div>

            ))}

          </div>

          {/* Transporters */}

          <div className="card-section">

            {filteredTransporters.map((t) => (

              <div className="farmer-card" key={t.id}>

                <div className="card-top">

                  {t.profilePic ? (
                    <img className="profile-photo" src={`http://localhost:8080/uploads/${t.profilePic}`} alt="profile" />
                  ) : (
                    <div className="profile-photo"></div>
                  )}

                  <button
                    className="see-profile"
                    onClick={() => handleSeeProfile(t)}
                  >
                    See Profile
                  </button>

                </div>

                <div className="card-info">

                  <h3>{t.username}</h3>
                  <p><strong>Email:</strong> {t.email}</p>
                  <p><strong>Role:</strong> {t.role}</p>

                </div>

                <button
                  className="meeting-card-btn"
                  onClick={() => handleScheduleMeeting(t)}
                >
                  Schedule Meeting
                </button>

              </div>

            ))}

          </div>

          {/* Meeting Modal */}

          {showMeetingModal && (
            <ScheduleMeeting
              user={selectedUser}
              onClose={() => setShowMeetingModal(false)}
            />
          )}

        </>
      )}

    </div>

  );
};

export default BusinessmanHomepage;