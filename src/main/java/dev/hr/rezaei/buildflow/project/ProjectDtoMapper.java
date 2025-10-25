package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.base.UpdatableEntityDtoMapper;
import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.user.User;
import lombok.NonNull;

public class ProjectDtoMapper {

    public static ProjectDto toProjectDto(Project project) {
        if (project == null) return null;
        // TODO: Phase 2 - Update to use new user/role structure
        User user = project.getUser();
        return ProjectDto.builder()
                .id(project.getId())
                .builderId(user != null && project.getRole() == ProjectRole.BUILDER ? user.getId() : null)
                .ownerId(user != null && project.getRole() == ProjectRole.OWNER ? user.getId() : null)
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
        // TODO: Phase 2 - Update to use new user/role/participants structure
        // Temporary implementation: Use builderUser as the main user if present, otherwise owner
        User mainUser = builderUser != null ? builderUser : owner;
        ProjectRole role = builderUser != null ? ProjectRole.BUILDER : ProjectRole.OWNER;
        
        return Project.builder()
                .id(dto.getId())
                .user(mainUser)
                .role(role)
                .location(ProjectLocationDtoMapper.toProjectLocationEntity(dto.getLocationDto()))
                .createdAt(UpdatableEntityDtoMapper.fromString(dto.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.fromString(dto.getLastUpdatedAt()))
                .build();
    }
}
