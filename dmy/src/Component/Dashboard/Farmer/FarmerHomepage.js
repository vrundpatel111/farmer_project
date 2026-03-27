import { useState, useEffect } from "react";
import axios from "axios";
import "../../../Style/FarmerHomepage.css";
import Navbar from "../../Common/navbar";
import { useNavigate } from "react-router-dom";
import ScheduleMeeting from "../../Common/ScheduleMeeting";

const FarmerHomepage = () => {
  const [search, setSearch] = useState("");
  const [businessmen, setBusinessmen] = useState([]);
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
      const [businessRes, transporterRes] = await Promise.all([
        axios.get("http://localhost:8080/api/businessmen"),
        axios.get("http://localhost:8080/api/transporters"),
      ]);

      setBusinessmen(businessRes.data);
      setTransporters(transporterRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinessmen = businessmen.filter((b) =>
    b.username?.toLowerCase().includes(search.toLowerCase())
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
          {/* Businessmen */}
          <div className="card-section">
            {filteredBusinessmen.map((b) => (
              <div className="business-card" key={b.id}>

                <div className="card-top">
                  {b.profilePic ? (
                    <img className="profile-photo" src={`http://localhost:8080/uploads/${b.profilePic}`} alt="profile" />
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

                <button
                  className="meeting-card-btn"
                  onClick={() => handleScheduleMeeting(b)}
                >
                  Schedule Meeting
                </button>

              </div>
            ))}
          </div>

          {/* Transporters */}
          <div className="card-section">
            {filteredTransporters.map((t) => (
              <div className="business-card" key={t.id}>

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

export default FarmerHomepage;