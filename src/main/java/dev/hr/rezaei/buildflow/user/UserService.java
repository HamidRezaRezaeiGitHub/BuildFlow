package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * UserService providing business logic for user management operations.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>User package documentation: "UserServices.md"</li>
 *     <li>Base package documentation: "../Services.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ContactService contactService;

    @Transactional
    public User createUser(@NonNull Contact contact, @NonNull String username, boolean registered) {
        contact = contactService.save(contact);

        User user = User.builder()
                .contact(contact)
                .username(username)
                .email(contact.getEmail())
                .registered(registered)
                .build();
        log.info("Persisting new user with contact: {}, username: {}, registered: {}", contact, username, registered);
        user = userRepository.save(user);

        return user;
    }

    @Transactional
    public User update(@NonNull User user) {
        if (!isPersisted(user)) {
            throw new IllegalArgumentException("User must be already persisted.");
        }
        return userRepository.save(user);
    }

    @Transactional
    public void delete(@NonNull User user) {
        if (!isPersisted(user)) {
            throw new IllegalArgumentException("User must be already persisted.");
        }
        userRepository.delete(user);
    }

    public boolean isPersisted(@NonNull User user) {
        return user.getId() != null && userRepository.existsById(user.getId());
    }

    public User getUserByUsername(@NonNull String username) {
        Optional<User> userOptional = findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("User not found with username: " + username);
        }
        return userOptional.get();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(@NonNull String username) {
        return userRepository.findByUsername(username);
    }

    public boolean existsByEmail(@NonNull String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(@NonNull String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsById(@NonNull UUID id) {
        return userRepository.existsById(id);
    }
}
