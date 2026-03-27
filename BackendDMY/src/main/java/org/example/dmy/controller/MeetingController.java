package org.example.dmy.controller;

import org.example.dmy.enums.MeetingStatus;
import org.example.dmy.model.Meeting;
import org.example.dmy.model.User;
import org.example.dmy.repository.UserRepository;
import org.example.dmy.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "http://localhost:3000")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Meeting schedule(@RequestBody Map<String, Object> body) {
        User farmer = userRepository.findById(Long.valueOf(body.get("farmerId").toString())).orElseThrow();
        User receiver = userRepository.findById(Long.valueOf(body.get("receiverId").toString())).orElseThrow();
        
        Meeting m = new Meeting();
        m.setFarmer(farmer);
        m.setReceiver(receiver);
        m.setMeetingTime(LocalDateTime.parse(body.get("meetingTime").toString().replace("Z", "")));
        return meetingService.scheduleMeeting(m);
    }

    @GetMapping("/receiver/{userId}")
    public List<Meeting> getForReceiver(@PathVariable Long userId) {
        return meetingService.getMeetingsForReceiver(userId);
    }

    @GetMapping("/farmer/{userId}")
    public List<Meeting> getForFarmer(@PathVariable Long userId) {
        return meetingService.getMeetingsForFarmer(userId);
    }

    @PostMapping("/accept/{id}")
    public Meeting accept(@PathVariable Long id) {
        return meetingService.updateStatus(id, MeetingStatus.ACCEPTED);
    }

    @PostMapping("/reject/{id}")
    public Meeting reject(@PathVariable Long id) {
        return meetingService.updateStatus(id, MeetingStatus.REJECTED);
    }
}
