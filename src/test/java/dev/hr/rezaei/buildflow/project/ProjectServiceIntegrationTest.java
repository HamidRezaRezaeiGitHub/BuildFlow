package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectResponse;
import dev.hr.rezaei.buildflow.project.dto.ProjectLocationRequestDto;
import dev.hr.rezaei.buildflow.user.*;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static dev.hr.rezaei.buildflow.project.ProjectLocationDtoMapper.toProjectLocationRequestDto;
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
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());
        User builder = testProject.getBuilderUser();

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .isBuilder(true)
                .locationRequestDto(locationRequestDto)
                .build();

        // Act & Assert - should not throw any exception
        assertDoesNotThrow(() -> projectService.validate(request));
    }

    @Test
    void validate_shouldThrow_whenBuilderNotFound() {
        // Arrange
        UUID nonExistentBuilderId = UUID.randomUUID();
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(nonExistentBuilderId)
                .isBuilder(true)
                .locationRequestDto(locationRequestDto)
                .build();

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.validate(request));
    }

    @Test
    void validate_shouldThrow_whenOwnerNotFound() {
        // Arrange
        UUID nonExistentOwnerId = UUID.randomUUID();
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(nonExistentOwnerId)
                .isBuilder(false)
                .locationRequestDto(locationRequestDto)
                .build();

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.validate(request));
    }

    @Test
    void validate_shouldThrow_whenLocationIsNull() {
        // Arrange
        persistProjectDependencies(testProject);
        User builder = testProject.getBuilderUser();

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .isBuilder(true)
                .locationRequestDto(null)
                .build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> projectService.validate(request));
    }

    @Test
    void createProject_shouldPersistProject_whenValidRequest() {
        // Arrange
        persistProjectDependencies(testProject);
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());
        User builder = testProject.getBuilderUser();

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .isBuilder(true)
                .locationRequestDto(locationRequestDto)
                .build();

        // Act
        CreateProjectResponse response = projectService.createProject(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getProjectDto());
        ProjectDto projectDto = response.getProjectDto();
        assertNotNull(projectDto.getId());
        assertEquals(builder.getId(), projectDto.getBuilderId());
        assertNotNull(projectDto.getLocationDto());
        assertNotNull(projectDto.getCreatedAt());
        assertNotNull(projectDto.getLastUpdatedAt());

        // Verify persistence by finding the project in the database
        Optional<Project> persistedProject = projectService.findById(projectDto.getId());
        assertTrue(persistedProject.isPresent());
        Project foundProject = persistedProject.get();
        assertEquals(projectDto.getId(), foundProject.getId());
        assertEquals(builder.getId(), foundProject.getBuilderUser().getId());
    }

    @Test
    void createProject_shouldThrow_whenValidationFails() {
        // Arrange
        UUID nonExistentBuilderId = UUID.randomUUID();
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(nonExistentBuilderId)
                .isBuilder(true)
                .locationRequestDto(locationRequestDto)
                .build();

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.createProject(request));
    }

    @Test
    void update_shouldThrow_whenProjectIsNotPersisted() {
        // Arrange
        Project nonPersistedProject = Project.builder()
                .builderUser(testBuilderUser)
                .owner(testOwnerUser)
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
        User builder = registerUser(userService, testProject.getBuilderUser());
        assertNotNull(builder.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .isBuilder(true)
                .locationRequestDto(locationRequestDto)
                .build();

        CreateProjectResponse response = projectService.createProject(request);
        Optional<Project> projectOptional = projectService.findById(response.getProjectDto().getId());
        assertTrue(projectOptional.isPresent());
        Project project = projectOptional.get();

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
                .builderUser(testBuilderUser)
                .owner(testOwnerUser)
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
        User builder = registerUser(userService, testProject.getBuilderUser());
        assertNotNull(builder.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .isBuilder(true)
                .locationRequestDto(locationRequestDto)
                .build();

        CreateProjectResponse response = projectService.createProject(request);
        Optional<Project> projectOptional = projectService.findById(response.getProjectDto().getId());
        assertTrue(projectOptional.isPresent());
        Project project = projectOptional.get();

        // Act
        projectService.delete(project);

        // Assert
        assertFalse(projectService.findById(project.getId()).isPresent());
        assertTrue(projectService.findById(project.getId()).isEmpty());
    }

    @Test
    void isPersisted_shouldReturnTrue_whenProjectIsPersisted() {
        // Arrange
        User builder = registerUser(userService, testProject.getBuilderUser());
        assertNotNull(builder.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .isBuilder(true)
                .locationRequestDto(locationRequestDto)
                .build();

        CreateProjectResponse response = projectService.createProject(request);
        Optional<Project> projectOptional = projectService.findById(response.getProjectDto().getId());
        assertTrue(projectOptional.isPresent());
        Project project = projectOptional.get();

        // Act & Assert
        assertTrue(projectService.isPersisted(project));
    }

    @Test
    void isPersisted_shouldReturnFalse_whenProjectIsNotPersisted() {
        // Arrange
        Project nonPersistedProject = Project.builder()
                .builderUser(testBuilderUser)
                .owner(testOwnerUser)
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
        User builder = registerUser(userService, testProject.getBuilderUser());
        assertNotNull(builder.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .isBuilder(true)
                .locationRequestDto(locationRequestDto)
                .build();

        CreateProjectResponse response = projectService.createProject(request);

        // Act
        Optional<Project> found = projectService.findById(response.getProjectDto().getId());

        // Assert
        assertTrue(found.isPresent());
        assertEquals(response.getProjectDto().getId(), found.get().getId());
    }

    @Test
    void findById_shouldReturnEmpty_whenNotExists() {
        // Act
        Optional<Project> found = projectService.findById(UUID.randomUUID());

        // Assert
        assertTrue(found.isEmpty());
    }

    @Test
    void findByBuilderId_shouldReturnProjects_whenBuilderHasProjects() {
        // Arrange
        User builder = registerUser(userService, testProject.getBuilderUser());
        assertNotNull(builder.getId());

        // Create first project using test location data
        ProjectLocationRequestDto locationRequestDto1 = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request1 = CreateProjectRequest.builder()
                .userId(builder.getId())
                .isBuilder(true)
                .locationRequestDto(locationRequestDto1)
                .build();

        // Create second project with different location data
        ProjectLocationRequestDto locationRequestDto2 = ProjectLocationRequestDto.builder()
                .unitNumber("20")
                .streetNumber("456")
                .streetName("Second Street")
                .city("Test City")
                .stateOrProvince("TC")
                .postalOrZipCode("67890")
                .country("Test Country")
                .build();

        CreateProjectRequest request2 = CreateProjectRequest.builder()
                .userId(builder.getId())
                .isBuilder(true)
                .locationRequestDto(locationRequestDto2)
                .build();

        projectService.createProject(request1);
        projectService.createProject(request2);

        // Act
        List<Project> builderProjects = projectService.findByBuilderId(builder.getId());

        // Assert
        assertEquals(2, builderProjects.size());
        assertTrue(builderProjects.stream().allMatch(p -> p.getBuilderUser().getId().equals(builder.getId())));
    }

    @Test
    void findByBuilderId_shouldReturnEmpty_whenBuilderHasNoProjects() {
        // Arrange
        User builder = registerUser(userService, testProject.getBuilderUser());

        // Act
        List<Project> builderProjects = projectService.findByBuilderId(builder.getId());

        // Assert
        assertTrue(builderProjects.isEmpty());
    }

    @Test
    void findByOwnerId_shouldReturnProjects_whenOwnerHasProjects() {
        // Arrange
        User owner = registerUser(userService, testProject.getOwner());
        assertNotNull(owner.getId());

        // Create first project using test location data
        ProjectLocationRequestDto locationRequestDto1 = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request1 = CreateProjectRequest.builder()
                .userId(owner.getId())
                .isBuilder(false)
                .locationRequestDto(locationRequestDto1)
                .build();

        // Create second project with different location data
        ProjectLocationRequestDto locationRequestDto2 = ProjectLocationRequestDto.builder()
                .unitNumber("30")
                .streetNumber("789")
                .streetName("Third Street")
                .city("Test City")
                .stateOrProvince("TC")
                .postalOrZipCode("11111")
                .country("Test Country")
                .build();

        CreateProjectRequest request2 = CreateProjectRequest.builder()
                .userId(owner.getId())
                .isBuilder(false)
                .locationRequestDto(locationRequestDto2)
                .build();

        projectService.createProject(request1);
        projectService.createProject(request2);

        // Act
        List<Project> ownerProjects = projectService.findByOwnerId(owner.getId());

        // Assert
        assertEquals(2, ownerProjects.size());
        assertTrue(ownerProjects.stream().allMatch(p -> p.getOwner().getId().equals(owner.getId())));
    }

    @Test
    void findByOwnerId_shouldReturnEmpty_whenOwnerHasNoProjects() {
        // Arrange
        User owner = registerUser(userService, testProject.getOwner());

        // Act
        List<Project> ownerProjects = projectService.findByOwnerId(owner.getId());

        // Assert
        assertTrue(ownerProjects.isEmpty());
    }

    @Test
    void getProjectsByBuilderId_shouldReturnProjectDtos_whenBuilderExists() {
        // Arrange
        User builder = registerUser(userService, testProject.getBuilderUser());
        assertNotNull(builder.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .isBuilder(true)
                .locationRequestDto(locationRequestDto)
                .build();

        projectService.createProject(request);

        // Act
        List<ProjectDto> projectDtos = projectService.getProjectsByBuilderId(builder.getId());

        // Assert
        assertEquals(1, projectDtos.size());
        assertEquals(builder.getId(), projectDtos.getFirst().getBuilderId());
    }

    @Test
    void getProjectsByBuilderId_shouldThrowUserNotFoundException_whenBuilderNotFound() {
        // Arrange
        UUID nonExistentBuilderId = UUID.randomUUID();

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.getProjectsByBuilderId(nonExistentBuilderId));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnProjectDtos_whenOwnerExists() {
        // Arrange
        User owner = registerUser(userService, testProject.getOwner());
        assertNotNull(owner.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(owner.getId())
                .isBuilder(false)
                .locationRequestDto(locationRequestDto)
                .build();

        projectService.createProject(request);

        // Act
        List<ProjectDto> projectDtos = projectService.getProjectsByOwnerId(owner.getId());

        // Assert
        assertEquals(1, projectDtos.size());
        assertEquals(owner.getId(), projectDtos.getFirst().getOwnerId());
    }

    @Test
    void getProjectsByOwnerId_shouldThrowUserNotFoundException_whenOwnerNotFound() {
        // Arrange
        UUID nonExistentOwnerId = UUID.randomUUID();

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.getProjectsByOwnerId(nonExistentOwnerId));
    }
}
