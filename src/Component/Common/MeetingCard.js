import axios from "axios";
import "../../Style/Meeting.css";

const MeetingCard = ({ meeting, onAction }) => {

  const acceptMeeting = async () => {
    await axios.post(
      `http://localhost:8080/api/meetings/accept/${meeting.id}`
    );
    alert("Meeting Accepted");
    if (onAction) onAction();
  };

  const rejectMeeting = async () => {
    await axios.post(
      `http://localhost:8080/api/meetings/reject/${meeting.id}`
    );
    alert("Meeting Rejected");
    if (onAction) onAction();
  };

  return (
    <div className="meeting-card">

      <p className="meeting-text">
        <b>{meeting.farmer?.username}</b> ({meeting.farmer?.role}) requested a meeting
      </p>

      <p className="meeting-time">
        Time: {new Date(meeting.meetingTime).toLocaleString()}
      </p>

      <div className="meeting-actions">
        <button className="accept-btn" onClick={acceptMeeting}>
          Accept
        </button>

        <button className="reject-btn" onClick={rejectMeeting}>
          Reject
        </button>
      </div>

    </div>
  );
};

export default MeetingCard;