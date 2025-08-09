package dev.hr.rezaei.buildflow.user;

import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
public class UserDto {
    private UUID id;
    private String email;
    private boolean registered;
    private ContactDto contactDto;
}

