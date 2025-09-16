package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import dev.hr.rezaei.buildflow.user.dto.CreateUserRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactEntity;
import static dev.hr.rezaei.buildflow.user.UserDtoMapper.toUserDto;

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
    public CreateUserResponse createUser(@NonNull CreateUserRequest request) {
        Contact contact = toContactEntity(request.getContactRequestDto());
        contact = contactService.save(contact);

        User user = User.builder()
                .contact(contact)
                .username(request.getUsername())
                .email(contact.getEmail())
                .registered(request.isRegistered())
                .build();
        log.info("Persisting new user with contact: {}, username: {}, registered: {}", contact, request.getUsername(), request.isRegistered());
        user = userRepository.save(user);

        UserDto userDto = toUserDto(user);
        return CreateUserResponse.builder()
                .userDto(userDto)
                .build();
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

    public UserDto getUserDtoByUsername(@NonNull String username) {
        Optional<User> userOptional = findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("User not found with username: " + username);
        }
        return toUserDto(userOptional.get());
    }

    public List<UserDto> getAllUserDtos() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserDtoMapper::toUserDto)
                .collect(Collectors.toList());
    }

    // Existence check methods

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
