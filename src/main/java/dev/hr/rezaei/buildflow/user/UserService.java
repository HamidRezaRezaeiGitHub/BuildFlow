package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.user.dto.CreateBuilderRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderResponse;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    private final ContactService contactService;

    public UserService(UserRepository userRepository, ContactService contactService) {
        this.userRepository = userRepository;
        this.contactService = contactService;
    }

    public User newUnregisteredUser(@NonNull Contact contact, ContactLabel... labels) {
        User newUser = toUser(contact, labels);

        Contact newContact = newUser.getContact();
        newContact = contactService.save(newContact);

        newUser.setRegistered(false);
        log.info("Persisting new unregistered user with contact: {}, labels: {}", newContact, labels);
        return userRepository.save(newUser);
    }

    public User newRegisteredUser(@NonNull Contact contact, ContactLabel... labels) {
        User newUser = toUser(contact, labels);

        Contact newContact = newUser.getContact();
        newContact = contactService.save(newContact);

        newUser.setRegistered(true);
        log.info("Persisting new registered user with contact: {}, labels: {}", newContact, labels);
        return userRepository.save(newUser);
    }

    public CreateBuilderResponse createBuilder(@NonNull CreateBuilderRequest request) {
        Contact contact = ContactDtoMapper.toContact(request.getContactDto());
        User user = request.isRegistered() ?
                newRegisteredUser(contact, ContactLabel.BUILDER) :
                newUnregisteredUser(contact, ContactLabel.BUILDER);

        UserDto userDto = UserDtoMapper.fromUser(user);
        return CreateBuilderResponse.builder()
                .userDto(userDto)
                .build();
    }

    public static User toUser(@NonNull Contact contact, ContactLabel... labels) {
        if (labels != null && labels.length != 0) {
            Collection<ContactLabel> collection = contact.getLabels();
            for (ContactLabel label : labels) {
                if (!collection.contains(label)) {
                    collection.add(label);
                }
            }
        }

        return toUser(contact);
    }

    public static User toUser(@NonNull Contact contact) {
        return User.builder()
                .username(contact.getEmail()) // Using email as username for simplicity
                .email(contact.getEmail())
                .contact(contact)
                .build();
    }

    public User update(@NonNull User user) {
        if (!isPersisted(user)) {
            throw new IllegalArgumentException("User must be already persisted.");
        }
        return userRepository.save(user);
    }

    public void delete(@NonNull User user) {
        if (!isPersisted(user)) {
            throw new IllegalArgumentException("User must be already persisted.");
        }
        userRepository.delete(user);
    }

    public boolean isPersisted(@NonNull User user) {
        return user.getId() != null && userRepository.existsById(user.getId());
    }

    public boolean existsByEmail(@NonNull String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(@NonNull String username) {
        return userRepository.existsByUsername(username);
    }

    public Optional<User> findById(@NonNull UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(@NonNull String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(@NonNull String username) {
        return userRepository.findByUsername(username);
    }
}
