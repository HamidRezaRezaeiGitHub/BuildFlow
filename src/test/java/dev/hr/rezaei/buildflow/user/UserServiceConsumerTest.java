package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import lombok.NonNull;

import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactDto;
import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactRequestDto;

public interface UserServiceConsumerTest {

    default User registerUser(@NonNull UserService userService, @NonNull User user) {
        ContactRequestDto contactRequestDto = toContactRequestDto(toContactDto(user.getContact()));
        return registerUser(userService, contactRequestDto, user.getUsername());
    }

    default User registerUser(@NonNull UserService userService, @NonNull Contact contact) {
        ContactRequestDto contactRequestDto = toContactRequestDto(toContactDto(contact));
        return registerUser(userService, contactRequestDto);
    }

    default User registerUser(@NonNull UserService userService, @NonNull ContactRequestDto contactRequestDto) {
        Contact contact = ContactDtoMapper.toContactEntity(contactRequestDto);
        return userService.createUser(contact, contactRequestDto.getEmail(), true);
    }

    default User registerUser(@NonNull UserService userService, @NonNull ContactRequestDto contactRequestDto, String username) {
        Contact contact = ContactDtoMapper.toContactEntity(contactRequestDto);
        return userService.createUser(contact, username, true);
    }
}
