import { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../../Style/ScheduleMeeting.css";

const ScheduleMeeting = ({ onClose, user }) => {

  const [selectedDate, setSelectedDate] = useState(new Date());

  const farmerId = localStorage.getItem("userId");

  const handleSubmit = async () => {
    try {

      await axios.post("http://localhost:8080/api/meetings", {
        farmerId: farmerId,
        receiverId: user.id,
        meetingTime: selectedDate
      });

      alert("Meeting Scheduled Successfully");

      onClose();

    } catch (error) {
      console.error(error);
      alert("Failed to schedule meeting");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h2>Schedule Meeting with {user.username}</h2>

        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="date-picker"
        />

        <div className="modal-buttons">

          <button className="confirm-btn" onClick={handleSubmit}>
            Confirm
          </button>

          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;