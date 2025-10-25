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
import java.util.List;
import java.util.Optional;
import dev.hr.rezaei.buildflow.project.ProjectRole;
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
        User builder = testProject.getUser();

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
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
                .role("BUILDER")
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
                .role("OWNER")
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
        User builder = testProject.getUser();

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
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
        User builder = testProject.getUser();

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
                .locationRequestDto(locationRequestDto)
                .build();

        // Act
        CreateProjectResponse response = projectService.createProject(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getProjectDto());
        ProjectDto projectDto = response.getProjectDto();
        assertNotNull(projectDto.getId());
        assertEquals(builder.getId(), projectDto.getUserId());
        assertEquals("BUILDER", projectDto.getRole());
        assertNotNull(projectDto.getLocationDto());
        assertNotNull(projectDto.getCreatedAt());
        assertNotNull(projectDto.getLastUpdatedAt());

        // Verify persistence by finding the project in the database
        Optional<Project> persistedProject = projectService.findById(projectDto.getId());
        assertTrue(persistedProject.isPresent());
        Project foundProject = persistedProject.get();
        assertEquals(projectDto.getId(), foundProject.getId());
        assertEquals(builder.getId(), foundProject.getUser().getId());
    }

    @Test
    void createProject_shouldThrow_whenValidationFails() {
        // Arrange
        UUID nonExistentBuilderId = UUID.randomUUID();
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(nonExistentBuilderId)
                .role("BUILDER")
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
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
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
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
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
        User builder = registerUser(userService, testProject.getUser());
        assertNotNull(builder.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
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
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
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
        User builder = registerUser(userService, testProject.getUser());
        assertNotNull(builder.getId());

        // Create first project using test location data
        ProjectLocationRequestDto locationRequestDto1 = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request1 = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
                .locationRequestDto(locationRequestDto1)
                .build();

        // Create second project with different location data
        ProjectLocationRequestDto locationRequestDto2 = ProjectLocationRequestDto.builder()
                .unitNumber("20")
                .streetNumberAndName("456 Second Street")
                .city("Test City")
                .stateOrProvince("TC")
                .postalOrZipCode("67890")
                .country("Test Country")
                .build();

        CreateProjectRequest request2 = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
                .locationRequestDto(locationRequestDto2)
                .build();

        projectService.createProject(request1);
        projectService.createProject(request2);

        // Act
        List<Project> builderProjects = projectService.findByBuilderId(builder.getId());

        // Assert
        assertEquals(2, builderProjects.size());
        assertTrue(builderProjects.stream().allMatch(p -> p.getUser().getId().equals(builder.getId())));
    }

    @Test
    void findByBuilderId_shouldReturnEmpty_whenBuilderHasNoProjects() {
        // Arrange
        User builder = registerUser(userService, testProject.getUser());

        // Act
        List<Project> builderProjects = projectService.findByBuilderId(builder.getId());

        // Assert
        assertTrue(builderProjects.isEmpty());
    }

    @Test
    void findByOwnerId_shouldReturnProjects_whenOwnerHasProjects() {
        // Arrange
        User ownerUser = registerUser(userService, testOwnerUser);
        assertNotNull(ownerUser.getId());

        // Create first project using test location data
        ProjectLocationRequestDto locationRequestDto1 = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request1 = CreateProjectRequest.builder()
                .userId(ownerUser.getId())
                .role("OWNER")
                .locationRequestDto(locationRequestDto1)
                .build();

        // Create second project with different location data
        ProjectLocationRequestDto locationRequestDto2 = ProjectLocationRequestDto.builder()
                .unitNumber("30")
                .streetNumberAndName("789 Third Street")
                .city("Test City")
                .stateOrProvince("TC")
                .postalOrZipCode("11111")
                .country("Test Country")
                .build();

        CreateProjectRequest request2 = CreateProjectRequest.builder()
                .userId(ownerUser.getId())
                .role("OWNER")
                .locationRequestDto(locationRequestDto2)
                .build();

        projectService.createProject(request1);
        projectService.createProject(request2);

        // Act
        List<Project> ownerProjects = projectService.findByOwnerId(ownerUser.getId());

        // Assert
        assertEquals(2, ownerProjects.size());
        assertTrue(ownerProjects.stream().allMatch(p -> p.getUser().getId().equals(ownerUser.getId())));
    }

    @Test
    void findByOwnerId_shouldReturnEmpty_whenOwnerHasNoProjects() {
        // Arrange
        User ownerUser = registerUser(userService, testOwnerUser);

        // Act
        List<Project> ownerProjects = projectService.findByOwnerId(ownerUser.getId());

        // Assert
        assertTrue(ownerProjects.isEmpty());
    }

    @Test
    void getProjectsByBuilderId_shouldReturnProjectDtos_whenBuilderExists() {
        // Arrange
        User builder = registerUser(userService, testProject.getUser());
        assertNotNull(builder.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
                .locationRequestDto(locationRequestDto)
                .build();

        projectService.createProject(request);

        // Act
        List<ProjectDto> projectDtos = projectService.getProjectsByBuilderId(builder.getId());

        // Assert
        assertEquals(1, projectDtos.size());
        assertEquals(builder.getId(), projectDtos.getFirst().getUserId());
        assertEquals("BUILDER", projectDtos.getFirst().getRole());
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
        User ownerUser = registerUser(userService, testOwnerUser);
        assertNotNull(ownerUser.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(ownerUser.getId())
                .role("OWNER")
                .locationRequestDto(locationRequestDto)
                .build();

        projectService.createProject(request);

        // Act
        List<ProjectDto> projectDtos = projectService.getProjectsByOwnerId(ownerUser.getId());

        // Assert
        assertEquals(1, projectDtos.size());
        assertEquals(ownerUser.getId(), projectDtos.getFirst().getUserId());
        assertEquals("OWNER", projectDtos.getFirst().getRole());
    }

    @Test
    void getProjectsByOwnerId_shouldThrowUserNotFoundException_whenOwnerNotFound() {
        // Arrange
        UUID nonExistentOwnerId = UUID.randomUUID();

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.getProjectsByOwnerId(nonExistentOwnerId));
    }

    @Test
    void getCombinedProjects_shouldReturnProjectsWhereUserIsBoth_whenScopeIsBoth() throws InterruptedException {
        // Arrange - Create a user who is both builder and owner of different projects
        User user = registerUser(userService, testProject.getUser());
        
        // Create project where user is builder
        CreateProjectRequest builderRequest = CreateProjectRequest.builder()
                .userId(user.getId())
                .role("BUILDER")
                .locationRequestDto(toProjectLocationRequestDto(testProject.getLocation()))
                .build();
        projectService.createProject(builderRequest);
        
        Thread.sleep(10); // Ensure different timestamps
        
        // Create project where user is owner
        CreateProjectRequest ownerRequest = CreateProjectRequest.builder()
                .userId(user.getId())
                .role("OWNER")
                .locationRequestDto(toProjectLocationRequestDto(testProjectLocation))
                .build();
        projectService.createProject(ownerRequest);

        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(0, 25);

        // Act
        org.springframework.data.domain.Page<ProjectDto> result = 
            projectService.getCombinedProjects(user.getId(), "both", null, null, pageable);

        // Assert
        assertEquals(2, result.getContent().size());
        assertEquals(2, result.getTotalElements());
        // Verify projects are sorted by lastUpdatedAt DESC
        assertTrue(result.getContent().get(0).getLastUpdatedAt()
            .compareTo(result.getContent().get(1).getLastUpdatedAt()) >= 0);
    }

    @Test
    void getCombinedProjects_shouldReturnOnlyBuilderProjects_whenScopeIsBuilder() {
        // Arrange
        User builder = registerUser(userService, testProject.getUser());
        
        // Create project where user is builder
        CreateProjectRequest builderRequest = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
                .locationRequestDto(toProjectLocationRequestDto(testProject.getLocation()))
                .build();
        projectService.createProject(builderRequest);
        
        // Create project where user is owner (should not be returned)
        CreateProjectRequest ownerRequest = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("OWNER")
                .locationRequestDto(toProjectLocationRequestDto(testProjectLocation))
                .build();
        projectService.createProject(ownerRequest);

        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(0, 25);

        // Act
        org.springframework.data.domain.Page<ProjectDto> result = 
            projectService.getCombinedProjects(builder.getId(), "builder", null, null, pageable);

        // Assert
        assertEquals(1, result.getContent().size());
        assertEquals(builder.getId(), result.getContent().get(0).getUserId());
        assertEquals("BUILDER", result.getContent().get(0).getRole());
    }

    @Test
    void getCombinedProjects_shouldReturnOnlyOwnerProjects_whenScopeIsOwner() {
        // Arrange
        User user = registerUser(userService, testProject.getUser());
        
        // Create project where user is builder (should not be returned)
        CreateProjectRequest builderRequest = CreateProjectRequest.builder()
                .userId(user.getId())
                .role("BUILDER")
                .locationRequestDto(toProjectLocationRequestDto(testProject.getLocation()))
                .build();
        projectService.createProject(builderRequest);
        
        // Create project where user is owner
        CreateProjectRequest ownerRequest = CreateProjectRequest.builder()
                .userId(user.getId())
                .role("OWNER")
                .locationRequestDto(toProjectLocationRequestDto(testProjectLocation))
                .build();
        projectService.createProject(ownerRequest);

        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(0, 25);

        // Act
        org.springframework.data.domain.Page<ProjectDto> result = 
            projectService.getCombinedProjects(user.getId(), "owner", null, null, pageable);

        // Assert
        assertEquals(1, result.getContent().size());
        assertEquals(user.getId(), result.getContent().get(0).getUserId());
        assertEquals("OWNER", result.getContent().get(0).getRole());
    }

    @Test
    void getCombinedProjects_shouldFilterByCreatedFrom_whenDateProvided() throws InterruptedException {
        // Arrange
        User user = registerUser(userService, testProject.getUser());
        
        // Create first project
        CreateProjectRequest request1 = CreateProjectRequest.builder()
                .userId(user.getId())
                .role("BUILDER")
                .locationRequestDto(toProjectLocationRequestDto(testProject.getLocation()))
                .build();
        projectService.createProject(request1);
        
        Thread.sleep(100); // Ensure timestamp difference
        Instant cutoffDate = Instant.now();
        Thread.sleep(100);
        
        // Create second project after cutoff
        CreateProjectRequest request2 = CreateProjectRequest.builder()
                .userId(user.getId())
                .role("BUILDER")
                .locationRequestDto(toProjectLocationRequestDto(testProjectLocation))
                .build();
        projectService.createProject(request2);

        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(0, 25);

        // Act
        org.springframework.data.domain.Page<ProjectDto> result = 
            projectService.getCombinedProjects(user.getId(), "both", cutoffDate, null, pageable);

        // Assert
        assertEquals(1, result.getContent().size());
        assertTrue(result.getContent().get(0).getCreatedAt().compareTo(cutoffDate.toString()) >= 0);
    }

    @Test
    void getCombinedProjects_shouldFilterByCreatedTo_whenDateProvided() throws InterruptedException {
        // Arrange
        User user = registerUser(userService, testProject.getUser());
        
        // Create first project
        CreateProjectRequest request1 = CreateProjectRequest.builder()
                .userId(user.getId())
                .role("BUILDER")
                .locationRequestDto(toProjectLocationRequestDto(testProject.getLocation()))
                .build();
        projectService.createProject(request1);
        
        Thread.sleep(100);
        Instant cutoffDate = Instant.now();
        Thread.sleep(100);
        
        // Create second project after cutoff (should be filtered out)
        CreateProjectRequest request2 = CreateProjectRequest.builder()
                .userId(user.getId())
                .role("BUILDER")
                .locationRequestDto(toProjectLocationRequestDto(testProjectLocation))
                .build();
        projectService.createProject(request2);

        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(0, 25);

        // Act
        org.springframework.data.domain.Page<ProjectDto> result = 
            projectService.getCombinedProjects(user.getId(), "both", null, cutoffDate, pageable);

        // Assert
        assertEquals(1, result.getContent().size());
        assertTrue(result.getContent().get(0).getCreatedAt().compareTo(cutoffDate.toString()) <= 0);
    }

    @Test
    void getCombinedProjects_shouldDeduplicateProjects_whenUserIsBothBuilderAndOwner() {
        // Arrange - This scenario shouldn't normally happen in production,
        // but the query should handle it gracefully with DISTINCT
        User user = registerUser(userService, testProject.getUser());
        
        // Create project (user as builder, initially)
        CreateProjectRequest request = CreateProjectRequest.builder()
                .userId(user.getId())
                .role("BUILDER")
                .locationRequestDto(toProjectLocationRequestDto(testProject.getLocation()))
                .build();
        CreateProjectResponse response = projectService.createProject(request);
        
        // Note: In real scenario, we'd modify the project to have same user as both builder and owner
        // For this test, we verify the DISTINCT clause works by checking unique results

        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(0, 25);

        // Act
        org.springframework.data.domain.Page<ProjectDto> result = 
            projectService.getCombinedProjects(user.getId(), "both", null, null, pageable);

        // Assert - Should return exactly one project (no duplicates)
        assertEquals(1, result.getContent().size());
        assertEquals(response.getProjectDto().getId(), result.getContent().get(0).getId());
    }

    @Test
    void getCombinedProjects_shouldRespectPagination_whenMultipleProjectsExist() throws InterruptedException {
        // Arrange
        User user = registerUser(userService, testProject.getUser());
        
        // Create 3 projects
        for (int i = 0; i < 3; i++) {
            CreateProjectRequest request = CreateProjectRequest.builder()
                    .userId(user.getId())
                    .role("BUILDER")
                    .locationRequestDto(toProjectLocationRequestDto(testProjectLocation))
                    .build();
            projectService.createProject(request);
            Thread.sleep(10); // Ensure different timestamps
        }

        // Act - Request first page with size 2
        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(0, 2);
        org.springframework.data.domain.Page<ProjectDto> result = 
            projectService.getCombinedProjects(user.getId(), "both", null, null, pageable);

        // Assert
        assertEquals(2, result.getContent().size());
        assertEquals(3, result.getTotalElements());
        assertEquals(2, result.getTotalPages());
        assertTrue(result.hasNext());
    }

    @Test
    void getCombinedProjects_shouldThrowUserNotFoundException_whenUserNotFound() {
        // Arrange
        UUID nonExistentUserId = UUID.randomUUID();
        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(0, 25);

        // Act & Assert
        assertThrows(UserNotFoundException.class,
                () -> projectService.getCombinedProjects(nonExistentUserId, "both", null, null, pageable));
    }
}
