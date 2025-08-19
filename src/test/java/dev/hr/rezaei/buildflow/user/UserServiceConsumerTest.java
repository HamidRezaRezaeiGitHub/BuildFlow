package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import lombok.NonNull;

import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactDto;
import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactRequestDto;
import static dev.hr.rezaei.buildflow.user.UserDtoMapper.toUserEntity;

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
        CreateUserRequest createUserRequest = CreateUserRequest.builder()
                .contactRequestDto(contactRequestDto)
                .registered(true)
                .username(contactRequestDto.getEmail())
                .build();
        return registerUser(userService, createUserRequest);
    }

    default User registerUser(@NonNull UserService userService, @NonNull ContactRequestDto contactRequestDto, String username) {
        CreateUserRequest createUserRequest = CreateUserRequest.builder()
                .contactRequestDto(contactRequestDto)
                .registered(true)
                .username(username)
                .build();
        return registerUser(userService, createUserRequest);
    }

    default User registerUser(@NonNull UserService userService, @NonNull CreateUserRequest createUserRequest) {
        CreateUserResponse response = userService.createUser(createUserRequest);
        return toUserEntity(response.getUserDto());
    }
}
