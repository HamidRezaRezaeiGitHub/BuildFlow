package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.user.Contact;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ProjectWithParticipantsTest extends AbstractModelJpaTest {

    @Test
    void persistProject_withUserAndRole_shouldSucceed() {
        // Given: A project with user and role
        persistProjectDependencies(testProject);

        // When: Saving the project
        Project savedProject = projectRepository.save(testProject);

        // Then: Should be persisted with correct fields
        assertNotNull(savedProject.getId());
        assertNotNull(savedProject.getUser());
        assertEquals(ProjectRole.BUILDER, savedProject.getRole());
        assertNotNull(savedProject.getLocation());
    }

    @Test
    void persistProject_withParticipants_shouldSucceed() {
        // Given: A project with participants
        persistProjectDependencies(testProject);
        Project savedProject = projectRepository.save(testProject);

        Contact participantContact = Contact.builder()
                .firstName("Participant")
                .lastName("User")
                .email("participant@example.com")
                .phone("5555555555")
                .labels(new ArrayList<>())
                .build();
        contactRepository.save(participantContact);

        ProjectParticipant participant = ProjectParticipant.builder()
                .project(savedProject)
                .role(ProjectRole.OWNER)
                .contact(participantContact)
                .build();
        
        // When: Saving the participant directly (unidirectional)
        ProjectParticipant savedParticipant = projectParticipantRepository.save(participant);

        // Then: Participant should be persisted
        assertNotNull(savedParticipant.getId());
        assertEquals(ProjectRole.OWNER, savedParticipant.getRole());
        assertEquals(savedProject.getId(), savedParticipant.getProject().getId());
        
        // Verify we can query participants by project
        var participants = projectParticipantRepository.findByProjectId(savedProject.getId());
        assertEquals(1, participants.size());
    }

    @Test
    void deleteProject_shouldRequireManualParticipantDeletion() {
        // Given: A project with participants (unidirectional relationship)
        persistProjectDependencies(testProject);
        Project savedProject = projectRepository.save(testProject);

        Contact participantContact = Contact.builder()
                .firstName("Participant")
                .lastName("User")
                .email("participant@example.com")
                .phone("5555555555")
                .labels(new ArrayList<>())
                .build();
        contactRepository.save(participantContact);

        ProjectParticipant participant = ProjectParticipant.builder()
                .project(savedProject)
                .role(ProjectRole.OWNER)
                .contact(participantContact)
                .build();
        projectParticipantRepository.save(participant);

        // Verify participant was saved
        var participantsBeforeDelete = projectParticipantRepository.findByProjectId(savedProject.getId());
        assertEquals(1, participantsBeforeDelete.size());

        // When: Deleting participants manually before deleting the project
        projectParticipantRepository.deleteAll(participantsBeforeDelete);
        projectRepository.delete(savedProject);

        // Then: Both project and participants should be deleted
        assertFalse(projectRepository.existsById(savedProject.getId()));
        var remainingParticipants = projectParticipantRepository.findByProjectId(savedProject.getId());
        assertEquals(0, remainingParticipants.size());
    }

    @Test
    void ensureUserAndRole_shouldThrowException_whenUserIsNull() {
        // Given/When/Then: Should throw NullPointerException due to @NonNull annotation
        assertThrows(NullPointerException.class, () -> {
            Project.builder()
                    .user(null)
                    .role(ProjectRole.BUILDER)
                    .location(testProjectLocation)
                    .build();
        });
    }

    @Test
    void ensureUserAndRole_shouldThrowException_whenRoleIsNull() {
        // Given/When/Then: Should throw NullPointerException due to @NonNull annotation
        assertThrows(NullPointerException.class, () -> {
            Project.builder()
                    .user(testBuilderUser)
                    .role(null)
                    .location(testProjectLocation)
                    .build();
        });
    }
}
