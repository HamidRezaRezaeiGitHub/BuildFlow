package dev.hr.rezaei.buildflow.user.dto;

import dev.hr.rezaei.buildflow.user.UserDto;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class CreateOwnerResponse {
    private UserDto userDto;
}
