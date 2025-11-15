package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.base.UpdatableEntityDtoMapper;
import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.user.User;
import lombok.NonNull;

public class ProjectDtoMapper {

    public static ProjectDto toProjectDto(Project project) {
        if (project == null) return null;
        
        User user = project.getUser();
        
        return ProjectDto.builder()
                .id(project.getId())
                .userId(user != null ? user.getId() : null)
                .role(project.getRole() != null ? project.getRole().name() : null)
                .locationDto(ProjectLocationDtoMapper.toProjectLocationDto(project.getLocation()))
                .createdAt(UpdatableEntityDtoMapper.toString(project.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.toString(project.getLastUpdatedAt()))
                .build();
    }

    public static Project toProjectEntity(@NonNull ProjectDto dto, @NonNull User user) {
        try {
            return map(dto, user);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ProjectDto: " + dto, e);
        }
    }

    private static Project map(@NonNull ProjectDto dto, @NonNull User user) {
        ProjectRole role;
        try {
            role = dto.getRole() != null ? ProjectRole.valueOf(dto.getRole()) : null;
        } catch (IllegalArgumentException e) {
            throw new DtoMappingException("Invalid role: " + dto.getRole(), e);
        }
        
        if (role == null) {
            throw new DtoMappingException("Role is required");
        }
        
        Project project = Project.builder()
                .id(dto.getId())
                .user(user)
                .role(role)
                .location(ProjectLocationDtoMapper.toProjectLocationEntity(dto.getLocationDto()))
                .createdAt(UpdatableEntityDtoMapper.fromString(dto.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.fromString(dto.getLastUpdatedAt()))
                .build();
        
        return project;
    }
}
