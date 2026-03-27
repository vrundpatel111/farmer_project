import React from 'react'

import { useEffect, useState } from "react";
import axios from "axios";
import MeetingCard from "./MeetingCard";

const MeetingPanel = () => {

  const [meetings, setMeetings] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {

    const res = await axios.get(
      `http://localhost:8080/api/meetings/receiver/${userId}`
    );

    setMeetings(res.data);
  };

  return (
    <div className="meeting-panel">

      <h3>Meeting Requests</h3>

      {meetings.filter(m => m.status === 'PENDING').length === 0 && <p>No requests</p>}

      {meetings.filter(m => m.status === 'PENDING').map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} onAction={fetchMeetings} />
      ))}

    </div>
  );
};

export default MeetingPanel;