package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.user.Contact;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ProjectParticipantTest extends AbstractModelJpaTest {

    @Test
    void persistProjectParticipant_shouldSucceed() {
        // Given: A project with a participant
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

        // When: Saving the participant
        ProjectParticipant savedParticipant = projectParticipantRepository.save(participant);

        // Then: Should be persisted correctly
        assertNotNull(savedParticipant.getId());
        assertEquals(ProjectRole.OWNER, savedParticipant.getRole());
        assertEquals(participantContact.getId(), savedParticipant.getContact().getId());
        assertEquals(savedProject.getId(), savedParticipant.getProject().getId());
    }

    @Test
    void findProjectParticipantsByProjectId_shouldReturnParticipants() {
        // Given: A project with participants
        persistProjectDependencies(testProject);
        Project savedProject = projectRepository.save(testProject);

        Contact contact1 = Contact.builder()
                .firstName("Contact1")
                .lastName("User")
                .email("contact1@example.com")
                .phone("1111111111")
                .labels(new ArrayList<>())
                .build();
        contactRepository.save(contact1);

        Contact contact2 = Contact.builder()
                .firstName("Contact2")
                .lastName("User")
                .email("contact2@example.com")
                .phone("2222222222")
                .labels(new ArrayList<>())
                .build();
        contactRepository.save(contact2);

        ProjectParticipant participant1 = ProjectParticipant.builder()
                .project(savedProject)
                .role(ProjectRole.OWNER)
                .contact(contact1)
                .build();
        projectParticipantRepository.save(participant1);

        ProjectParticipant participant2 = ProjectParticipant.builder()
                .project(savedProject)
                .role(ProjectRole.BUILDER)
                .contact(contact2)
                .build();
        projectParticipantRepository.save(participant2);

        // When: Finding participants by project ID
        var participants = projectParticipantRepository.findByProjectId(savedProject.getId());

        // Then: Should return both participants
        assertEquals(2, participants.size());
    }

    @Test
    void toString_shouldNotThrow() {
        Contact participantContact = Contact.builder()
                .firstName("Test")
                .lastName("Participant")
                .email("test@example.com")
                .phone("5555555555")
                .labels(new ArrayList<>())
                .build();

        ProjectParticipant participant = ProjectParticipant.builder()
                .project(testProject)
                .role(ProjectRole.BUILDER)
                .contact(participantContact)
                .build();

        assertDoesNotThrow(participant::toString);
    }
}
