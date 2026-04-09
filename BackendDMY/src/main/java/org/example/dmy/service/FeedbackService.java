package org.example.dmy.service;

import org.example.dmy.model.Feedback;
import org.example.dmy.repository.FeedbackRepository;
import org.example.dmy.repository.UserRepository;
import org.example.dmy.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public Feedback saveFeedback(Feedback feedback) {
        System.out.println("Processing feedback: Sender=" + feedback.getSenderName() + ", ReceiverId=" + feedback.getReceiverId() + ", Rating=" + feedback.getRating());
        
        Feedback savedFeedback = feedbackRepository.save(feedback);
        
        if (feedback.getReceiverId() != null) {
            Optional<User> receiverOpt = userRepository.findById(feedback.getReceiverId());
            if (receiverOpt.isPresent()) {
                User receiver = receiverOpt.get();
                System.out.println("Found receiver: " + receiver.getUsername());
                String message = String.format("🌟 You received a new %d-star review from %s!", 
                                feedback.getRating(), 
                                feedback.getSenderName() != null ? feedback.getSenderName() : "a customer");
                notificationService.createNotification(receiver, message);
                System.out.println("Notification created successfully for user " + receiver.getUsername());
            } else {
                System.out.println("DEBUG: Could not find receiver in database for ID: " + feedback.getReceiverId());
            }
        }
        
        return savedFeedback;
    }

    public List<Feedback> getFeedbackForUser(Long userId) {
        return feedbackRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }

    public Double getAverageRating(Long userId) {
        List<Feedback> feedbacks = feedbackRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
        if (feedbacks.isEmpty()) {
            return 0.0;
        }
        double sum = 0;
        for (Feedback f : feedbacks) {
            sum += f.getRating();
        }
        return sum / feedbacks.size();
    }
}
