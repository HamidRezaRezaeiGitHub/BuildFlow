package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.config.mvc.DateFilter;
import dev.hr.rezaei.buildflow.user.UserNotFoundException;
import dev.hr.rezaei.buildflow.user.*;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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

    // ============================================
    // Date Filtering Tests
    // ============================================

    @Test
    void getProjectsByUserId_withDateFilter_shouldFilterByCreatedAfter() {
        // Arrange
        Contact contact = Contact.builder()
                .firstName("Builder")
                .lastName("User")
                .email("builder@example.com")
                .build();
        User user = registerUser(userService, contact);
        
        Instant baseTime = Instant.now().truncatedTo(ChronoUnit.SECONDS);
        Instant oldTime = baseTime.minus(30, ChronoUnit.DAYS);
        Instant recentTime = baseTime.minus(5, ChronoUnit.DAYS);

        // Create old project
        ProjectLocation oldLocation = createProjectLocation("Old Street");
        Project oldProject = projectService.createProject(user.getId(), "BUILDER", oldLocation);
        oldProject.setCreatedAt(oldTime);
        oldProject.setLastUpdatedAt(oldTime);
        projectService.update(oldProject);

        // Create recent project
        ProjectLocation recentLocation = createProjectLocation("Recent Street");
        Project recentProject = projectService.createProject(user.getId(), "BUILDER", recentLocation);
        recentProject.setCreatedAt(recentTime);
        recentProject.setLastUpdatedAt(recentTime);
        projectService.update(recentProject);

        // Create date filter for projects created in last 10 days
        Instant threshold = baseTime.minus(10, ChronoUnit.DAYS);
        DateFilter dateFilter = DateFilter.builder()
                .createdAfter(threshold)
                .build();

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Project> result = projectService.getProjectsByUserId(user.getId(), pageable, dateFilter);

        // Assert
        assertEquals(1, result.getContent().size());
        assertTrue(result.getContent().get(0).getCreatedAt().isAfter(threshold) ||
                   result.getContent().get(0).getCreatedAt().equals(threshold));
    }

    @Test
    void getProjectsByUserId_withDateFilter_shouldFilterByUpdatedAfter() {
        // Arrange
        Contact contact = Contact.builder()
                .firstName("Builder2")
                .lastName("User")
                .email("builder2@example.com")
                .build();
        User user = registerUser(userService, contact);
        
        Instant baseTime = Instant.now().truncatedTo(ChronoUnit.SECONDS);

        // Create project with old update time
        ProjectLocation location = createProjectLocation("Test Street");
        Project project = projectService.createProject(user.getId(), "BUILDER", location);
        Instant oldUpdateTime = baseTime.minus(20, ChronoUnit.DAYS);
        project.setLastUpdatedAt(oldUpdateTime);
        // Save directly to repository to preserve custom lastUpdatedAt
        projectRepository.save(project);

        // Create date filter for recently updated projects
        Instant threshold = baseTime.minus(10, ChronoUnit.DAYS);
        DateFilter dateFilter = DateFilter.builder()
                .updatedAfter(threshold)
                .build();

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Project> result = projectService.getProjectsByUserId(user.getId(), pageable, dateFilter);

        // Assert
        // Should be empty since project was last updated 20 days ago
        assertEquals(0, result.getContent().size());
    }

    @Test
    void getProjectsByUserId_withEmptyDateFilter_shouldReturnAllProjects() {
        // Arrange
        Contact contact = Contact.builder()
                .firstName("Builder3")
                .lastName("User")
                .email("builder3@example.com")
                .build();
        User user = registerUser(userService, contact);
        
        ProjectLocation location1 = createProjectLocation("Street 1");
        ProjectLocation location2 = createProjectLocation("Street 2");
        projectService.createProject(user.getId(), "BUILDER", location1);
        projectService.createProject(user.getId(), "OWNER", location2);

        DateFilter emptyFilter = DateFilter.empty();
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Project> result = projectService.getProjectsByUserId(user.getId(), pageable, emptyFilter);

        // Assert
        assertEquals(2, result.getContent().size());
    }

    @Test
    void getAllProjects_withDateFilter_shouldFilterAllProjects() {
        // Arrange
        Contact contact1 = Contact.builder()
                .firstName("User1")
                .lastName("Test")
                .email("user1@example.com")
                .build();
        User user1 = registerUser(userService, contact1);
        
        Contact contact2 = Contact.builder()
                .firstName("User2")
                .lastName("Test")
                .email("user2@example.com")
                .build();
        User user2 = registerUser(userService, contact2);
        
        Instant baseTime = Instant.now().truncatedTo(ChronoUnit.SECONDS);
        Instant oldTime = baseTime.minus(30, ChronoUnit.DAYS);
        Instant recentTime = baseTime.minus(5, ChronoUnit.DAYS);

        // Create old project for user1
        ProjectLocation oldLocation = createProjectLocation("Old Street User1");
        Project oldProject = projectService.createProject(user1.getId(), "BUILDER", oldLocation);
        oldProject.setCreatedAt(oldTime);
        oldProject.setLastUpdatedAt(oldTime);
        projectService.update(oldProject);

        // Create recent project for user2
        ProjectLocation recentLocation = createProjectLocation("Recent Street User2");
        Project recentProject = projectService.createProject(user2.getId(), "OWNER", recentLocation);
        recentProject.setCreatedAt(recentTime);
        recentProject.setLastUpdatedAt(recentTime);
        projectService.update(recentProject);

        // Create date filter
        Instant threshold = baseTime.minus(10, ChronoUnit.DAYS);
        DateFilter dateFilter = DateFilter.builder()
                .createdAfter(threshold)
                .build();

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Project> result = projectService.getAllProjects(pageable, dateFilter);

        // Assert
        assertEquals(1, result.getContent().size());
        assertEquals(user2.getId(), result.getContent().get(0).getUser().getId());
    }

    private ProjectLocation createProjectLocation(String street) {
        return ProjectLocation.builder()
                .streetNumberAndName(street)
                .city("TestCity")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("TestCountry")
                .build();
    }
}
