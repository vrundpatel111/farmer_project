package org.example.dmy.repository;

import org.example.dmy.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);
}
