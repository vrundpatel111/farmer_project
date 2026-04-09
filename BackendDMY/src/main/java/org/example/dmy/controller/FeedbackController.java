package org.example.dmy.controller;

import org.example.dmy.model.Feedback;
import org.example.dmy.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public Feedback addFeedback(@RequestBody Feedback feedback) {
        return feedbackService.saveFeedback(feedback);
    }

    @GetMapping("/user/{userId}")
    public List<Feedback> getFeedbackForUser(@PathVariable Long userId) {
        return feedbackService.getFeedbackForUser(userId);
    }

    @GetMapping("/rating/{userId}")
    public Map<String, Double> getAverageRating(@PathVariable Long userId) {
        Map<String, Double> response = new HashMap<>();
        response.put("averageRating", feedbackService.getAverageRating(userId));
        return response;
    }
}
