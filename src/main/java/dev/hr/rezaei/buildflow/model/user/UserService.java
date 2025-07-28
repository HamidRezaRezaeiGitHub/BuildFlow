package dev.hr.rezaei.buildflow.model.user;

import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ContactService contactService;

    public UserService(UserRepository userRepository, ContactService contactService) {
        this.userRepository = userRepository;
        this.contactService = contactService;
    }

    public User registerNewUser(@NonNull Contact contact) {
        // Check if everything is valid in the contact
        Contact savedContact = contactService.save(contact);

        // Create a new user with the saved contact
        User newUser = User.builder()
                .username(savedContact.getEmail()) // Using email as username for simplicity
                .email(savedContact.getEmail())
                .registered(true)
                .contact(savedContact)
                .build();

        // Save the user to the repository
        return userRepository.save(newUser);
    }

    public User update(User user) {
        if (!isPersisted(user)) {
            throw new IllegalArgumentException("User must be already persisted.");
        }
        return userRepository.save(user);
    }

    public void delete(User user) {
        if (!isPersisted(user)) {
            throw new IllegalArgumentException("User must be already persisted.");
        }
        userRepository.delete(user);
    }

    public boolean isPersisted(User user) {
        return user.getId() != null && userRepository.existsById(user.getId());
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
