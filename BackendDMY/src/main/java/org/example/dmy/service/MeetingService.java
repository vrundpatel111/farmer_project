package org.example.dmy.service;

import org.example.dmy.enums.MeetingStatus;
import org.example.dmy.model.Meeting;
import org.example.dmy.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MeetingService {

    @Autowired
    private MeetingRepository meetingRepository;

    @Autowired
    private NotificationService notificationService;

    public Meeting scheduleMeeting(Meeting meeting) {
        Meeting m = meetingRepository.save(meeting);
        notificationService.createNotification(m.getReceiver(), 
            "New meeting request from " + m.getFarmer().getUsername());
        return m;
    }

    public List<Meeting> getMeetingsForReceiver(Long receiverId) {
        return meetingRepository.findByReceiverId(receiverId);
    }

    public List<Meeting> getMeetingsForFarmer(Long farmerId) {
        return meetingRepository.findByFarmerId(farmerId);
    }

    public Meeting updateStatus(Long id, MeetingStatus status) {
        Meeting m = meetingRepository.findById(id).orElseThrow();
        m.setStatus(status);
        
        String message = "Meeting with " + m.getReceiver().getUsername() + " was " + status.toString().toLowerCase();
        notificationService.createNotification(m.getFarmer(), message);
        
        return meetingRepository.save(m);
    }
}
