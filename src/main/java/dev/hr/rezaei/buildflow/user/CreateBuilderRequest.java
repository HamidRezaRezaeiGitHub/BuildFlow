package dev.hr.rezaei.buildflow.user;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class CreateBuilderRequest {
    private boolean registered;
    private ContactDto contactDto;
}
