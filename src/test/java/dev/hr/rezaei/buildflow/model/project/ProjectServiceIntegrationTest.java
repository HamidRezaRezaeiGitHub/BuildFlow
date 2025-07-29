package dev.hr.rezaei.buildflow.model.project;

import dev.hr.rezaei.buildflow.model.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.model.user.*;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
class ProjectServiceIntegrationTest extends AbstractModelJpaTest {

    @Autowired
    private ContactService contactService;

    @TestConfiguration
    static class ProjectServiceTestConfig {
        @Bean
        public ContactService contactService(ContactRepository contactRepository) {
            return new ContactService(contactRepository);
        }

        @Bean
        public UserService userService(UserRepository userRepository, ContactService contactService) {
            return new UserService(userRepository, contactService);
        }

        @Bean
        public ProjectLocationService projectLocationService(ProjectLocationRepository repo) {
            return new ProjectLocationService(repo);
        }

        @Bean
        public ProjectService projectService(ProjectRepository projectRepository,
                                             ProjectLocationService projectLocationService,
                                             UserService userService) {
            return new ProjectService(projectRepository, projectLocationService, userService);
        }
    }

    @Autowired
    private ProjectService projectService;
    @Autowired
    private UserService userService;

    @Test
    void create_shouldPersistProject() {
        User builder = userService.newRegisteredBuilder(testContact);
        Contact ownerContact = Contact.builder()
                .email("owner@test.com")
                .firstName("owner")
                .lastName("owners")
                .build();
        User owner = userService.newUnregisteredOwner(ownerContact);

        Project project = projectService.create(builder.getId(), owner.getId(), testProjectLocation);

        assertNotNull(project.getId());
        assertTrue(projectService.isPersisted(project));
        assertEquals(builder.getId(), project.getBuilderUser().getId());
        assertEquals(owner.getId(), project.getOwner().getId());
        assertTrue(projectService.findById(project.getId()).isPresent());
    }

    @Test
    void update_shouldThrow_whenProjectIsNotPersisted() {
        assertThrows(RuntimeException.class, () -> projectService.update(testProject));
    }

    @Test
    void update_shouldPersistChanges_whenProjectIsPersisted() {
        User builder = userService.newRegisteredUser(testContact);
        Contact ownerContact = Contact.builder()
                .email("owner@test.com")
                .firstName("owner")
                .lastName("owners")
                .build();
        User owner = userService.newUnregisteredOwner(ownerContact);

        Project project = projectService.create(builder.getId(), owner.getId(), testProjectLocation);
        project.setLocation(ProjectLocation.builder().unitNumber("2").streetName("Second St").city("NewCity").build());
        Project updated = projectService.update(project);

        assertNotNull(updated.getId());
        assertEquals("2", updated.getLocation().getUnitNumber());
        assertEquals("Second St", updated.getLocation().getStreetName());
    }

    @Test
    void delete_shouldThrow_whenProjectIsNotPersisted() {
        assertThrows(RuntimeException.class, () -> projectService.delete(testProject));
    }

    @Test
    void delete_shouldRemoveProject_whenProjectIsPersisted() {
        User builder = userService.newRegisteredUser(testContact);
        Contact ownerContact = Contact.builder()
                .email("owner@test.com")
                .firstName("owner")
                .lastName("owners")
                .build();
        User owner = userService.newUnregisteredOwner(ownerContact);

        Project project = projectService.create(builder.getId(), owner.getId(), testProjectLocation);
        projectService.delete(project);

        assertFalse(projectService.isPersisted(project));
        assertFalse(projectRepository.existsById(project.getId()));
    }

    @Test
    void findByBuilderId_shouldReturnProjects_forBuilder() {
        User builder = userService.newRegisteredUser(testContact);
        Contact ownerContact = Contact.builder()
                .email("owner@test.com")
                .firstName("owner")
                .lastName("owners")
                .build();
        User owner = userService.newUnregisteredOwner(ownerContact);
        Project project = projectService.create(builder.getId(), owner.getId(), testProjectLocation);

        List<Project> projects = projectService.findByBuilderId(builder.getId());

        assertFalse(projects.isEmpty());
        assertTrue(projects.contains(project));
        assertEquals(1, projects.size());
        Project first = projects.getFirst();
        assertEquals(project, first);
        assertEquals(builder.getId(), first.getBuilderUser().getId());
    }

    @Test
    void findByOwnerId_shouldReturnProjects_forOwner() {
        User owner = userService.newRegisteredOwner(testContact);
        Contact builderContact = Contact.builder()
                .email("builder@test.com")
                .firstName("bil")
                .lastName("der")
                .build();
        User builder = userService.newUnregisteredBuilder(builderContact);
        Project project = projectService.create(builder.getId(), owner.getId(), testProjectLocation);

        List<Project> projects = projectService.findByOwnerId(owner.getId());

        assertFalse(projects.isEmpty());
        assertTrue(projects.contains(project));
        assertEquals(1, projects.size());
        Project first = projects.getFirst();
        assertEquals(project, first);
        assertEquals(owner.getId(), first.getOwner().getId());
    }
}

