package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import lombok.NonNull;

public class UserDtoMapper {

    public static UserDto toUserDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .registered(user.isRegistered())
                .contactDto(ContactDtoMapper.toContactDto(user.getContact()))
                .build();
    }

    public static UserDto toUserDto(ContactDto contactDto) {
        if (contactDto == null) return null;
        return UserDto.builder()
                .username(contactDto.getEmail())
                .email(contactDto.getEmail())
                .registered(false)
                .contactDto(contactDto)
                .build();
    }

    public static User toUserEntity(@NonNull UserDto dto) {
        try {
            return map(dto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid UserDto: " + dto, e);
        }
    }

    private static User map(@NonNull UserDto dto) {
        return User.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .registered(dto.isRegistered())
                .contact(ContactDtoMapper.toContactEntity(dto.getContactDto()))
                .build();
    }
}
