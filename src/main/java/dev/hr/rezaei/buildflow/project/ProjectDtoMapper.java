package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.base.UpdatableEntityDtoMapper;
import dev.hr.rezaei.buildflow.user.User;
import lombok.NonNull;

public class ProjectDtoMapper {

    public static ProjectDto fromProject(Project project) {
        if (project == null) return null;
        return ProjectDto.builder()
                .id(project.getId())
                .builderUserId(project.getBuilderUser().getId())
                .ownerId(project.getOwner().getId())
                .locationDto(ProjectLocationDtoMapper.fromProjectLocation(project.getLocation()))
                .createdAt(UpdatableEntityDtoMapper.toString(project.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.toString(project.getLastUpdatedAt()))
                .build();
    }

    public static Project toProject(@NonNull ProjectDto dto, User builderUser, User owner) {
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
                .location(ProjectLocationDtoMapper.toProjectLocation(dto.getLocationDto()))
                .createdAt(UpdatableEntityDtoMapper.fromString(dto.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.fromString(dto.getLastUpdatedAt()))
                .build();
    }
}
