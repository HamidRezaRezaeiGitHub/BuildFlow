package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.dto.Dto;
import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

@Data
@SuperBuilder
public class ContactDto implements Dto<Contact> {
    private UUID id;
    private String firstName;
    private String lastName;
    private List<String> labels;
    private String email;
    private String phone;
    private ContactAddressDto addressDto;
}
