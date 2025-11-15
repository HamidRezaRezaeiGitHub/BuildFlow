package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.user.Contact;
import dev.hr.rezaei.buildflow.user.ContactService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * ProjectParticipantService providing business logic for project participant management operations.
 * Follows the same pattern as ProjectService - operates on entities, not DTOs.
 * 
 * Note: Pagination removed since participant counts per project are expected to be small.
 */
@Slf4j
@Service
public class ProjectParticipantService {

    private final ProjectParticipantRepository participantRepository;
    private final ProjectRepository projectRepository;
    private final ContactService contactService;

    public ProjectParticipantService(ProjectParticipantRepository participantRepository,
                                     ProjectRepository projectRepository,
                                     ContactService contactService) {
        this.participantRepository = participantRepository;
        this.projectRepository = projectRepository;
        this.contactService = contactService;
    }

    /**
     * Find participant by ID.
     */
    public Optional<ProjectParticipant> findById(@NonNull UUID id) {
        return participantRepository.findById(id);
    }

    /**
     * List all participants for a given project.
     */
    @Transactional(readOnly = true)
    public List<ProjectParticipant> findByProjectId(@NonNull UUID projectId) {
        verifyProjectExists(projectId);
        return participantRepository.findByProjectId(projectId);
    }

    /**
     * Count participants by project ID.
     */
    public long countByProjectId(@NonNull UUID projectId) {
        return participantRepository.countByProjectId(projectId);
    }

    /**
     * Create a new participant for a project.
     * Similar to UserService.createUser(), this method receives Contact object and saves it.
     */
    @Transactional
    public ProjectParticipant createParticipant(@NonNull UUID projectId, @NonNull Contact contact, @NonNull String roleStr) {
        // Verify project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist."));

        // Validate role
        ProjectRole role;
        try {
            role = ProjectRole.valueOf(roleStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleStr + ". Must be BUILDER or OWNER.");
        }

        // Save the contact (similar to UserService pattern)
        contact = contactService.save(contact);

        ProjectParticipant participant = ProjectParticipant.builder()
                .project(project)
                .contact(contact)
                .role(role)
                .build();

        ProjectParticipant saved = participantRepository.save(participant);
        log.info("Created participant with ID {} for project ID {} with role {}", saved.getId(), projectId, role);
        return saved;
    }

    /**
     * Update an existing participant.
     * Similar to createParticipant(), this method receives Contact object and saves it.
     */
    @Transactional
    public ProjectParticipant updateParticipant(@NonNull UUID participantId, @NonNull Contact contact, @NonNull String roleStr) {
        ProjectParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ParticipantNotFoundException("Participant with ID " + participantId + " does not exist."));

        // Validate role
        ProjectRole role;
        try {
            role = ProjectRole.valueOf(roleStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleStr + ". Must be BUILDER or OWNER.");
        }

        // Save the contact (similar to UserService pattern)
        contact = contactService.save(contact);

        participant.setContact(contact);
        participant.setRole(role);

        ProjectParticipant updated = participantRepository.save(participant);
        log.info("Updated participant ID {} with contact ID {} and role {}", participantId, contact.getId(), role);
        return updated;
    }

    /**
     * Delete a participant by ID.
     */
    @Transactional
    public void deleteParticipant(@NonNull UUID participantId) {
        if (!participantRepository.existsById(participantId)) {
            throw new ParticipantNotFoundException("Participant with ID " + participantId + " does not exist.");
        }
        participantRepository.deleteById(participantId);
        log.info("Deleted participant with ID {}", participantId);
    }

    /**
     * Verify that a project exists.
     */
    private void verifyProjectExists(UUID projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException("Project with ID " + projectId + " does not exist.");
        }
    }
}
