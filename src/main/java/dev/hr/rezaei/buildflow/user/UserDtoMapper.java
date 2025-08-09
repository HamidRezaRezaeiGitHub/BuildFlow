package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import lombok.NonNull;

public class UserDtoMapper {

    public static UserDto fromUser(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .registered(user.isRegistered())
                .contactDto(ContactDtoMapper.fromContact(user.getContact()))
                .build();
    }

    public static User toUser(@NonNull UserDto dto) {
        try {
            return map(dto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid UserDto: " + dto, e);
        }
    }

    private static User map(@NonNull UserDto dto) {
        return User.builder()
                .id(dto.getId())
                .username(dto.getEmail())
                .email(dto.getEmail())
                .registered(dto.isRegistered())
                .contact(ContactDtoMapper.toContact(dto.getContactDto()))
                .build();
    }
}
