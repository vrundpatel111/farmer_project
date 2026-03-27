package org.example.dmy.service;

import org.example.dmy.model.Notification;
import org.example.dmy.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification markAsRead(Long id) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        n.setRead(true);
        return notificationRepository.save(n);
    }

    public Notification createNotification(org.example.dmy.model.User user, String message) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        return notificationRepository.save(n);
    }
}
