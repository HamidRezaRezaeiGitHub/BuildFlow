package dev.hr.rezaei.buildflow.user.dto;

import dev.hr.rezaei.buildflow.base.BaseAddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

/**
 * ContactAddressRequestDto representing address information for creation requests (without ID).
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>User package documentation: "UserDtos.md"</li>
 *     <li>Base package documentation: "../Dtos.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@Schema(description = "Contact address request information for creating new addresses")
public class ContactAddressRequestDto extends BaseAddressDto {
    // No ID field - this is for creation requests only
}
