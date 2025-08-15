package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.project.dto.ProjectLocationRequestDto;
import lombok.NonNull;

public class ProjectLocationDtoMapper {

    public static ProjectLocationDto toProjectLocationDto(ProjectLocation location) {
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

    public static ProjectLocationDto toProjectLocationDto(ProjectLocationRequestDto dto) {
        if (dto == null) return null;
        return ProjectLocationDto.builder()
                .unitNumber(dto.getUnitNumber())
                .streetNumber(dto.getStreetNumber())
                .streetName(dto.getStreetName())
                .city(dto.getCity())
                .stateOrProvince(dto.getStateOrProvince())
                .postalOrZipCode(dto.getPostalOrZipCode())
                .country(dto.getCountry())
                .build();
    }

    public static ProjectLocationRequestDto toProjectLocationRequestDto(ProjectLocationDto dto) {
        if (dto == null) return null;
        return ProjectLocationRequestDto.builder()
                .unitNumber(dto.getUnitNumber())
                .streetNumber(dto.getStreetNumber())
                .streetName(dto.getStreetName())
                .city(dto.getCity())
                .stateOrProvince(dto.getStateOrProvince())
                .postalOrZipCode(dto.getPostalOrZipCode())
                .country(dto.getCountry())
                .build();
    }

    public static ProjectLocationRequestDto toProjectLocationRequestDto(ProjectLocation location) {
        if (location == null) return null;
        return toProjectLocationRequestDto(toProjectLocationDto(location));
    }

    public static ProjectLocation toProjectLocationEntity(@NonNull ProjectLocationDto dto) {
        try {
            return map(dto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ProjectLocationDto: " + dto, e);
        }
    }

    public static ProjectLocation toProjectLocationEntity(@NonNull ProjectLocationRequestDto dto) {
        try {
            ProjectLocationDto projectLocationDto = toProjectLocationDto(dto);
            return map(projectLocationDto);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ProjectLocationRequestDto: " + dto, e);
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
