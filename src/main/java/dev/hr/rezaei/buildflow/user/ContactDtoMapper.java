package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import lombok.NonNull;

import java.util.ArrayList;
import java.util.stream.Collectors;

import static dev.hr.rezaei.buildflow.user.ContactAddressDtoMapper.fromContactAddress;
import static dev.hr.rezaei.buildflow.user.ContactAddressDtoMapper.toContactAddress;
import static dev.hr.rezaei.buildflow.util.EnumUtil.fromUniqStrings;

public class ContactDtoMapper {

    public static ContactDto fromContact(Contact contact) {
        if (contact == null) return null;
        return ContactDto.builder()
                .id(contact.getId())
                .firstName(contact.getFirstName())
                .lastName(contact.getLastName())
                .labels(contact.getLabels().stream().map(ContactLabel::name).collect(Collectors.toList()))
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .addressDto(fromContactAddress(contact.getAddress()))
                .build();
    }

    public static Contact toContact(@NonNull ContactDto dto) {
        try {
            return map(dto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ContactDto: " + dto, e);
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
                .address(toContactAddress(dto.getAddressDto()))
                .build();
    }
}
