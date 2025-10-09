package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.user.dto.ContactAddressRequestDto;
import lombok.NonNull;

public class ContactAddressDtoMapper {

    public static ContactAddressDto toContactAddressDto(ContactAddress address) {
        if (address == null) return null;
        return ContactAddressDto.builder()
                .id(address.getId())
                .unitNumber(address.getUnitNumber())
                .streetNumberAndName(address.getStreetNumberAndName())
                .city(address.getCity())
                .stateOrProvince(address.getStateOrProvince())
                .postalOrZipCode(address.getPostalOrZipCode())
                .country(address.getCountry())
                .build();
    }

    public static ContactAddressRequestDto toContactAddressRequestDto(ContactAddressDto dto) {
        if (dto == null) return null;
        return ContactAddressRequestDto.builder()
                .unitNumber(dto.getUnitNumber())
                .streetNumberAndName(dto.getStreetNumberAndName())
                .city(dto.getCity())
                .stateOrProvince(dto.getStateOrProvince())
                .postalOrZipCode(dto.getPostalOrZipCode())
                .country(dto.getCountry())
                .build();
    }

    public static ContactAddressDto toContactAddressDto(ContactAddressRequestDto dto) {
        if (dto == null) return null;
        return ContactAddressDto.builder()
                .unitNumber(dto.getUnitNumber())
                .streetNumberAndName(dto.getStreetNumberAndName())
                .city(dto.getCity())
                .stateOrProvince(dto.getStateOrProvince())
                .postalOrZipCode(dto.getPostalOrZipCode())
                .country(dto.getCountry())
                .build();
    }

    public static ContactAddress toContactAddressEntity(@NonNull ContactAddressDto dto) {
        try {
            return map(dto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ContactAddressDto: " + dto, e);
        }
    }

    public static ContactAddress toContactAddressEntity(@NonNull ContactAddressRequestDto dto) {
        try {
            ContactAddressDto contactAddressDto = toContactAddressDto(dto);
            return map(contactAddressDto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ContactAddressRequestDto: " + dto, e);
        }
    }

    private static ContactAddress map(@NonNull ContactAddressDto dto) {
        return ContactAddress.builder()
                .id(dto.getId())
                .unitNumber(dto.getUnitNumber())
                .streetNumberAndName(dto.getStreetNumberAndName())
                .city(dto.getCity())
                .stateOrProvince(dto.getStateOrProvince())
                .postalOrZipCode(dto.getPostalOrZipCode())
                .country(dto.getCountry())
                .build();
    }

}
