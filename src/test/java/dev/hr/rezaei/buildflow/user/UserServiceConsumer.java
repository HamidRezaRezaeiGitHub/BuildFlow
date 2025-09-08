package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import lombok.NonNull;

public interface UserServiceConsumer {

    default CreateUserResponse createUser(@NonNull UserService userService, @NonNull ContactRequestDto contactRequestDto) {
        CreateUserRequest createUserRequest = CreateUserRequest.builder()
                .contactRequestDto(contactRequestDto)
                .registered(true)
                .username(contactRequestDto.getEmail())
                .build();
        return userService.createUser(createUserRequest);
    }

    default CreateUserResponse createUniqUser(@NonNull UserService userService, @NonNull ContactRequestDto baseContactRequestDto) {
        int uniq = (int) (Math.random() * 100);
        ContactRequestDto contactRequestDto = ContactRequestDto.builder()
                .firstName(baseContactRequestDto.getFirstName())
                .lastName(baseContactRequestDto.getLastName())
                .labels(baseContactRequestDto.getLabels())
                .phone(baseContactRequestDto.getPhone())
                .email(uniq + baseContactRequestDto.getEmail())
                .build();
        return createUser(userService, contactRequestDto);
    }
}
