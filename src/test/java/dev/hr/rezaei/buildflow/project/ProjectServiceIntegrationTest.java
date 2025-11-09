package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import dev.hr.rezaei.buildflow.user.*;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
class ProjectServiceIntegrationTest extends AbstractModelJpaTest implements UserServiceConsumerTest {

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
        public ProjectService projectService(ProjectRepository projectRepository,
                                             UserService userService) {
            return new ProjectService(projectRepository, userService);
        }
    }

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Test
    void validate_shouldPass_whenValidCreateProjectRequest() {
        // Arrange
        persistProjectDependencies(testProject);
        ProjectLocation location = testProject.getLocation();
        User builder = testProject.getUser();

        // Act & Assert - should not throw any exception
        assertDoesNotThrow(() -> projectService.validate(builder.getId(), "BUILDER", location));
    }

    @Test
    void validate_shouldThrow_whenBuilderNotFound() {
        // Arrange
        UUID nonExistentBuilderId = UUID.randomUUID();
        ProjectLocation location = testProject.getLocation();

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.validate(nonExistentBuilderId, "BUILDER", location));
    }

    @Test
    void validate_shouldThrow_whenOwnerNotFound() {
        // Arrange
        UUID nonExistentOwnerId = UUID.randomUUID();
        ProjectLocation location = testProject.getLocation();

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.validate(nonExistentOwnerId, "OWNER", location));
    }

    @Test
    void validate_shouldThrow_whenLocationIsNull() {
        // Arrange
        persistProjectDependencies(testProject);
        User builder = testProject.getUser();

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> projectService.validate(builder.getId(), "BUILDER", null));
    }

    @Test
    void createProject_shouldPersistProject_whenValidRequest() {
        // Arrange
        persistProjectDependencies(testProject);
        ProjectLocation location = testProject.getLocation();
        User builder = testProject.getUser();

        // Act
        Project project = projectService.createProject(builder.getId(), "BUILDER", location);

        // Assert
        assertNotNull(project);
        assertNotNull(project.getId());
        assertEquals(builder.getId(), project.getUser().getId());
        assertEquals(ProjectRole.BUILDER, project.getRole());
        assertNotNull(project.getLocation());
        assertNotNull(project.getCreatedAt());
        assertNotNull(project.getLastUpdatedAt());

        // Verify persistence by finding the project in the database
        Optional<Project> persistedProject = projectService.findById(project.getId());
        assertTrue(persistedProject.isPresent());
        Project foundProject = persistedProject.get();
        assertEquals(project.getId(), foundProject.getId());
        assertEquals(builder.getId(), foundProject.getUser().getId());
    }

    @Test
    void createProject_shouldThrow_whenValidationFails() {
        // Arrange
        UUID nonExistentBuilderId = UUID.randomUUID();
        ProjectLocation location = testProject.getLocation();

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.createProject(nonExistentBuilderId, "BUILDER", location));
    }

    @Test
    void update_shouldThrow_whenProjectIsNotPersisted() {
        // Arrange
        Project nonPersistedProject = Project.builder()
                .user(testBuilderUser)
                    .role(ProjectRole.BUILDER)
                .location(testProjectLocation)
                .createdAt(Instant.now())
                .lastUpdatedAt(Instant.now())
                .build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> projectService.update(nonPersistedProject));
    }

    @Test
    void update_shouldPersistChanges_whenProjectIsPersisted() {
        // Arrange
        User builder = registerUser(userService, testProject.getUser());
        assertNotNull(builder.getId());
        ProjectLocation location = testProject.getLocation();

        Project project = projectService.createProject(builder.getId(), "BUILDER", location);
        Instant originalLastUpdated = project.getLastUpdatedAt();

        // Small delay to ensure timestamp difference
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Act
        Project updatedProject = projectService.update(project);

        // Assert
        assertNotNull(updatedProject);
        assertEquals(project.getId(), updatedProject.getId());
        assertTrue(updatedProject.getLastUpdatedAt().isAfter(originalLastUpdated));
    }

    @Test
    void delete_shouldThrow_whenProjectIsNotPersisted() {
        // Arrange
        Project nonPersistedProject = Project.builder()
                .user(testBuilderUser)
                    .role(ProjectRole.BUILDER)
                .location(testProjectLocation)
                .createdAt(Instant.now())
                .lastUpdatedAt(Instant.now())
                .build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> projectService.delete(nonPersistedProject));
    }

    @Test
    void delete_shouldRemoveProject_whenProjectIsPersisted() {
        // Arrange
        User builder = registerUser(userService, testProject.getUser());
        assertNotNull(builder.getId());
        ProjectLocation location = testProject.getLocation();

        Project project = projectService.createProject(builder.getId(), "BUILDER", location);

        // Act
        projectService.delete(project);

        // Assert
        assertFalse(projectService.findById(project.getId()).isPresent());
        assertTrue(projectService.findById(project.getId()).isEmpty());
    }

    @Test
    void isPersisted_shouldReturnTrue_whenProjectIsPersisted() {
        // Arrange
        User builder = registerUser(userService, testProject.getUser());
        assertNotNull(builder.getId());
        ProjectLocation location = testProject.getLocation();

        Project project = projectService.createProject(builder.getId(), "BUILDER", location);

        // Act & Assert
        assertTrue(projectService.isPersisted(project));
    }

    @Test
    void isPersisted_shouldReturnFalse_whenProjectIsNotPersisted() {
        // Arrange
        Project nonPersistedProject = Project.builder()
                .user(testBuilderUser)
                    .role(ProjectRole.BUILDER)
                .location(testProjectLocation)
                .createdAt(Instant.now())
                .lastUpdatedAt(Instant.now())
                .build();

        // Act & Assert
        assertFalse(projectService.isPersisted(nonPersistedProject));
    }

    @Test
    void findById_shouldReturnProject_whenExists() {
        // Arrange
        User builder = registerUser(userService, testProject.getUser());
        assertNotNull(builder.getId());
        ProjectLocation location = testProject.getLocation();

        Project project = projectService.createProject(builder.getId(), "BUILDER", location);

        // Act
        Optional<Project> found = projectService.findById(project.getId());

        // Assert
        assertTrue(found.isPresent());
        assertEquals(project.getId(), found.get().getId());
    }

    @Test
    void findById_shouldReturnEmpty_whenNotExists() {
        // Act
        Optional<Project> found = projectService.findById(UUID.randomUUID());

        // Assert
        assertTrue(found.isEmpty());
    }

    @Test
    void findByUserId_shouldReturnProjects_whenUserHasProjects() {
        // Arrange
        User user = registerUser(userService, testProject.getUser());
        assertNotNull(user.getId());

        // Create first project using test location data
        ProjectLocation location1 = testProject.getLocation();

        // Create second project with different location data
        ProjectLocation location2 = ProjectLocation.builder()
                .unitNumber("20")
                .streetNumberAndName("456 Second Street")
                .city("Test City")
                .stateOrProvince("TC")
                .postalOrZipCode("67890")
                .country("Test Country")
                .build();

        projectService.createProject(user.getId(), "BUILDER", location1);
        projectService.createProject(user.getId(), "BUILDER", location2);

        // Act
        List<Project> userProjects = projectService.findByUserId(user.getId());

        // Assert
        assertEquals(2, userProjects.size());
        assertTrue(userProjects.stream().allMatch(p -> p.getUser().getId().equals(user.getId())));
    }

    @Test
    void findByUserId_shouldReturnEmpty_whenUserHasNoProjects() {
        // Arrange
        User user = registerUser(userService, testProject.getUser());

        // Act
        List<Project> userProjects = projectService.findByUserId(user.getId());

        // Assert
        assertTrue(userProjects.isEmpty());
    }


    @Test
    void getProjectsByUserId_shouldReturnProjects_whenUserExists() {
        // Arrange
        User user = registerUser(userService, testProject.getUser());
        assertNotNull(user.getId());
        ProjectLocation location = testProject.getLocation();

        projectService.createProject(user.getId(), "BUILDER", location);

        // Act
        List<Project> projects = projectService.getProjectsByUserId(user.getId());

        // Assert
        assertEquals(1, projects.size());
        assertEquals(user.getId(), projects.getFirst().getUser().getId());
        assertEquals(ProjectRole.BUILDER, projects.getFirst().getRole());
    }

    @Test
    void getProjectsByUserId_shouldThrowUserNotFoundException_whenUserNotFound() {
        // Arrange
        UUID nonExistentUserId = UUID.randomUUID();

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.getProjectsByUserId(nonExistentUserId));
    }
}
