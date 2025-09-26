package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.base.UpdatableEntityDtoMapper;
import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.user.User;
import lombok.NonNull;

public class ProjectDtoMapper {

    public static ProjectDto toProjectDto(Project project) {
        if (project == null) return null;
        User builder = project.getBuilderUser();
        User owner = project.getOwner();
        return ProjectDto.builder()
                .id(project.getId())
                .builderId(builder == null ? null : builder.getId())
                .ownerId(owner == null ? null : owner.getId())
                .locationDto(ProjectLocationDtoMapper.toProjectLocationDto(project.getLocation()))
                .createdAt(UpdatableEntityDtoMapper.toString(project.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.toString(project.getLastUpdatedAt()))
                .build();
    }

    public static Project toProjectEntity(@NonNull ProjectDto dto, User builderUser, User owner) {
        try {
            return map(dto, builderUser, owner);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ProjectDto: " + dto, e);
        }
    }

    private static Project map(@NonNull ProjectDto dto, User builderUser, User owner) {
        return Project.builder()
                .id(dto.getId())
                .builderUser(builderUser)
                .owner(owner)
                .location(ProjectLocationDtoMapper.toProjectLocationEntity(dto.getLocationDto()))
                .createdAt(UpdatableEntityDtoMapper.fromString(dto.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.fromString(dto.getLastUpdatedAt()))
                .build();
    }
}
