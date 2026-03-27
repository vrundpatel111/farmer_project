package org.example.dmy.repository;

import org.example.dmy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.dmy.enums.UserRole;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
}
