package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.user.DuplicateUserException;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.user.ContactLabel;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(value = "app.admin.initialize", havingValue = "true")
public class AdminUserInitializer implements ApplicationRunner {

    private final AuthService authService;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Initializing Admin User: {}", adminUsername);
        validate();

        if (authService.isValidNewUsername(adminUsername)) {
            createAdmin();
            return;
        }

        Optional<UserAuthentication> optionalUserAuthentication = authService.findUserAuthByUsername(adminUsername);
        if (optionalUserAuthentication.isPresent()) {
            Role currentRole = optionalUserAuthentication.get().getRole();
            if (!Role.ADMIN.equals(currentRole)) {
                log.error("Cannot create admin user. Username already exists with different role: {}", currentRole);
                throw new DuplicateUserException("Username already exists with role: " + currentRole);
            } else {
                log.info("A user with admin role already exists with username: {}", adminUsername);
            }
        } else {
            log.error("Cannot create admin user. Username doesn't exist, yet isValidNewUsername returned false!");
            throw new IllegalStateException("Inconsistent state for username: " + adminUsername);
        }
    }

    private void validate() {
        if (adminUsername == null || adminUsername.isBlank()) {
            throw new IllegalArgumentException("Admin username must be provided");
        }
        if (adminPassword == null || adminPassword.isBlank()) {
            throw new IllegalArgumentException("Admin password must be provided");
        }
        if (adminEmail == null || adminEmail.isBlank()) {
            throw new IllegalArgumentException("Admin email must be provided");
        }
    }

    private void createAdmin() {
        ContactRequestDto contactRequestDto = ContactRequestDto.builder()
                .email(adminEmail)
                .firstName("Admin")
                .lastName("Admin")
                .labels(List.of(ContactLabel.ADMINISTRATOR.name()))
                .build();
        SignUpRequest signUpRequest = SignUpRequest.builder()
                .username(adminUsername)
                .password(adminPassword)
                .contactRequestDto(contactRequestDto)
                .build();
        authService.createAdminUser(signUpRequest);
    }
}
