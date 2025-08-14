package dev.hr.rezaei.buildflow.user.dto;

import dev.hr.rezaei.buildflow.user.ContactDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOwnerRequest {
    @NotNull(message = "Registered status is required")
    private boolean registered;

    @Valid
    @NotNull(message = "Contact information is required")
    private ContactDto contactDto;
}
