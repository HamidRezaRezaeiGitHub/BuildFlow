package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.base.BaseAddressDto;
import dev.hr.rezaei.buildflow.dto.Dto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * ContactAddressDto representing complete address information for API responses.
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
@AllArgsConstructor
@Schema(description = "Contact address information")
public class ContactAddressDto extends BaseAddressDto implements Dto<ContactAddress> {
    @Schema(description = "Unique identifier for the contact address", example = "123e4567-e89b-12d3-a456-426614174000")
    protected UUID id;
}
