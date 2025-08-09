package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import lombok.NonNull;

public class ProjectLocationDtoMapper {

    public static ProjectLocationDto fromProjectLocation(ProjectLocation location) {
        if (location == null) return null;
        return ProjectLocationDto.builder()
                .id(location.getId())
                .unitNumber(location.getUnitNumber())
                .streetNumber(location.getStreetNumber())
                .streetName(location.getStreetName())
                .city(location.getCity())
                .stateOrProvince(location.getStateOrProvince())
                .postalOrZipCode(location.getPostalOrZipCode())
                .country(location.getCountry())
                .build();
    }

    public static ProjectLocation toProjectLocation(@NonNull ProjectLocationDto dto) {
        try {
            return map(dto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ProjectLocationDto: " + dto, e);
        }
    }

    private static ProjectLocation map(@NonNull ProjectLocationDto dto) {
        return ProjectLocation.builder()
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
