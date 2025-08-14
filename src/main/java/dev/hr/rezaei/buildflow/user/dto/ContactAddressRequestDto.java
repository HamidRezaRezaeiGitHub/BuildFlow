package dev.hr.rezaei.buildflow.user.dto;

import dev.hr.rezaei.buildflow.base.BaseAddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@Schema(description = "Contact address request information for creating new addresses")
public class ContactAddressRequestDto extends BaseAddressDto {
    // No ID field - this is for creation requests only
}
