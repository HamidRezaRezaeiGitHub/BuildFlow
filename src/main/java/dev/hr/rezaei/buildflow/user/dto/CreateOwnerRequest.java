package dev.hr.rezaei.buildflow.user.dto;

import dev.hr.rezaei.buildflow.user.ContactDto;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class CreateOwnerRequest {
    private boolean registered;
    private ContactDto contactDto;
}
