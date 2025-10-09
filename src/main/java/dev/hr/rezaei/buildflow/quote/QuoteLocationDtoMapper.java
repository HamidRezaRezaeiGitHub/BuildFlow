package dev.hr.rezaei.buildflow.quote;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import lombok.NonNull;

public class QuoteLocationDtoMapper {

    public static QuoteLocationDto fromQuoteLocation(QuoteLocation location) {
        if (location == null) return null;
        return QuoteLocationDto.builder()
                .id(location.getId())
                .unitNumber(location.getUnitNumber())
                .streetNumberAndName(location.getStreetNumberAndName())
                .city(location.getCity())
                .stateOrProvince(location.getStateOrProvince())
                .postalOrZipCode(location.getPostalOrZipCode())
                .country(location.getCountry())
                .build();
    }

    public static QuoteLocation toQuoteLocation(@NonNull QuoteLocationDto dto) {
        try {
            return map(dto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid QuoteLocationDto: " + dto, e);
        }
    }

    private static QuoteLocation map(@NonNull QuoteLocationDto dto) {
        return QuoteLocation.builder()
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
