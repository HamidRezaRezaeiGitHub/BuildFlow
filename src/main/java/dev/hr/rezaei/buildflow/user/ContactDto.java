package dev.hr.rezaei.buildflow.user;

import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

@Data
@SuperBuilder
public class ContactDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private List<String> labels;
    private String email;
    private String phone;
    private ContactAddressDto addressDto;
}
