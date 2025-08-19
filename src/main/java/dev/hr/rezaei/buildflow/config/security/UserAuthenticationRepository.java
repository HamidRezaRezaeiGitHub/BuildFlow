package dev.hr.rezaei.buildflow.config.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAuthenticationRepository extends JpaRepository<UserAuthentication, UUID> {

    Optional<UserAuthentication> findByUsername(String username);

    boolean existsByUsername(String username);
}
