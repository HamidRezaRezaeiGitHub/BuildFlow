package dev.hr.rezaei.buildflow.config.security;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Authentication entity to store user credentials separately from the domain User entity.
 * This keeps authentication concerns decoupled from the business domain.
 */
@Entity
@Table(name = "user_authentication", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_auth_username", columnNames = "username")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAuthentication {

    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(length = 100, nullable = false)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role = Role.USER;

    @Builder.Default
    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Builder.Default
    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "last_login")
    private Instant lastLogin;
}
