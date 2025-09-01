package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import lombok.NonNull;

import java.util.ArrayList;
import java.util.stream.Collectors;

import static dev.hr.rezaei.buildflow.user.ContactAddressDtoMapper.*;
import static dev.hr.rezaei.buildflow.util.EnumUtil.fromUniqStrings;

public class ContactDtoMapper {

    public static ContactDto toContactDto(Contact contact) {
        if (contact == null) return null;
        return ContactDto.builder()
                .id(contact.getId())
                .firstName(contact.getFirstName())
                .lastName(contact.getLastName())
                .labels(contact.getLabels().stream().map(ContactLabel::name).collect(Collectors.toList()))
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .addressDto(toContactAddressDto(contact.getAddress()))
                .build();
    }

    public static ContactRequestDto toContactRequestDto(ContactDto dto) {
        if (dto == null) return null;
        return ContactRequestDto.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .labels(dto.getLabels())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .addressRequestDto(toContactAddressRequestDto(dto.getAddressDto()))
                .build();
    }

    public static ContactDto toContactDto(ContactRequestDto dto) {
        if (dto == null) return null;
        return ContactDto.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .labels(dto.getLabels())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .addressDto(toContactAddressDto(dto.getAddressRequestDto()))
                .build();
    }

    public static Contact toContactEntity(@NonNull ContactDto dto) {
        try {
            return map(dto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ContactDto: " + dto, e);
        }
    }

    public static Contact toContactEntity(@NonNull ContactRequestDto dto) {
        try {
            ContactDto contactDto = toContactDto(dto);
            return map(contactDto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ContactRequestDto: " + dto, e);
        }
    }

    private static Contact map(@NonNull ContactDto dto) {
        return Contact.builder()
                .id(dto.getId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .labels(new ArrayList<>(fromUniqStrings(ContactLabel.class, dto.getLabels())))
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddressDto() == null ? null : toContactAddressEntity(dto.getAddressDto()))
                .build();
    }
}
