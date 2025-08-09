package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.base.BaseAddressDto;
import dev.hr.rezaei.buildflow.dto.Dto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
@SuperBuilder
public class ContactAddressDto extends BaseAddressDto implements Dto<ContactAddress> {
    protected UUID id;
}

