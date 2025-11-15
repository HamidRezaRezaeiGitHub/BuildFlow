package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.user.Contact;
import dev.hr.rezaei.buildflow.user.ContactDtoMapper;
import lombok.NonNull;

/**
 * Mapper for converting between ProjectParticipant entities and ProjectParticipantDto objects.
 * Follows the same pattern as ProjectDtoMapper and ProjectLocationDtoMapper.
 */
public class ProjectParticipantDtoMapper {

    /**
     * Convert ProjectParticipant entity to DTO.
     * Maps the contact relationship to ContactDto.
     *
     * @param participant The participant entity to convert
     * @return The participant DTO, or null if input is null
     */
    public static ProjectParticipantDto toProjectParticipantDto(ProjectParticipant participant) {
        if (participant == null) return null;
        
        return ProjectParticipantDto.builder()
                .id(participant.getId())
                .role(participant.getRole() != null ? participant.getRole().name() : null)
                .contact(ContactDtoMapper.toContactDto(participant.getContact()))
                .build();
    }

    /**
     * Convert ProjectParticipantDto to entity.
     * Requires Project and Contact entities to be provided separately.
     *
     * @param dto The participant DTO to convert
     * @param project The project entity this participant belongs to
     * @param contact The contact entity for this participant
     * @return The participant entity
     * @throws DtoMappingException if DTO is invalid
     */
    public static ProjectParticipant toProjectParticipantEntity(
            @NonNull ProjectParticipantDto dto, 
            @NonNull Project project, 
            @NonNull Contact contact) {
        try {
            ProjectRole role = dto.getRole() != null ? ProjectRole.valueOf(dto.getRole()) : null;
            if (role == null) {
                throw new DtoMappingException("Participant role is required");
            }
            
            return ProjectParticipant.builder()
                    .id(dto.getId())
                    .project(project)
                    .role(role)
                    .contact(contact)
                    .build();
        } catch (IllegalArgumentException e) {
            throw new DtoMappingException("Invalid participant role: " + dto.getRole(), e);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid ProjectParticipantDto: " + dto, e);
        }
    }
}
