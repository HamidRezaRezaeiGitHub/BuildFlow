package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import lombok.NonNull;

public class ContactAddressDtoMapper {

    public static ContactAddressDto fromContactAddress(ContactAddress address) {
        if (address == null) return null;
        return ContactAddressDto.builder()
                .id(address.getId())
                .unitNumber(address.getUnitNumber())
                .streetNumber(address.getStreetNumber())
                .streetName(address.getStreetName())
                .city(address.getCity())
                .stateOrProvince(address.getStateOrProvince())
                .postalOrZipCode(address.getPostalOrZipCode())
                .country(address.getCountry())
                .build();
    }

    public static ContactAddress toContactAddress(@NonNull ContactAddressDto dto) {
        try {
            return map(dto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ContactAddressDto: " + dto, e);
        }
    }

    private static ContactAddress map(@NonNull ContactAddressDto dto) {
        return ContactAddress.builder()
                .id(dto.getId())
                .unitNumber(dto.getUnitNumber())
                .streetNumber(dto.getStreetNumber())
                .streetName(dto.getStreetName())
                .city(dto.getCity())
                .stateOrProvince(dto.getStateOrProvince())
                .postalOrZipCode(dto.getPostalOrZipCode())
                .country(dto.getCountry())
                .build();
    }

}
