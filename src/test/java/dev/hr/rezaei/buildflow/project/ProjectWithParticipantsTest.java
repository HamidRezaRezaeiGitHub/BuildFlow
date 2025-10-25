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
    void persistProject_withParticipants_shouldCascade() {
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
        savedProject.getParticipants().add(participant);

        // When: Saving the project with participants
        Project updatedProject = projectRepository.save(savedProject);

        // Then: Participants should be persisted
        assertEquals(1, updatedProject.getParticipants().size());
        ProjectParticipant savedParticipant = updatedProject.getParticipants().get(0);
        assertNotNull(savedParticipant.getId());
        assertEquals(ProjectRole.OWNER, savedParticipant.getRole());
    }

    @Test
    void deleteProject_shouldRemoveParticipants() {
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
        savedProject.getParticipants().add(participant);
        projectRepository.save(savedProject);

        // When: Deleting the project
        projectRepository.delete(savedProject);
        projectRepository.flush();

        // Then: Participants should be removed (orphanRemoval)
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
                    .estimates(new ArrayList<>())
                    .participants(new ArrayList<>())
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
                    .estimates(new ArrayList<>())
                    .participants(new ArrayList<>())
                    .build();
        });
    }
}
