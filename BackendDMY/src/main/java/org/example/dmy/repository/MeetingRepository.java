package org.example.dmy.repository;

import org.example.dmy.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findByReceiverId(Long receiverId);
    List<Meeting> findByFarmerId(Long farmerId);
}
