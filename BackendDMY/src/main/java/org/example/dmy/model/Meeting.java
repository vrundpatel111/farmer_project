package org.example.dmy.model;

import jakarta.persistence.*;
import lombok.*;
import org.example.dmy.enums.MeetingStatus;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "meetings")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private LocalDateTime meetingTime;

    @Enumerated(EnumType.STRING)
    private MeetingStatus status = MeetingStatus.PENDING;
}
