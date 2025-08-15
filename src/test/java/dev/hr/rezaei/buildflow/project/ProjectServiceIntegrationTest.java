package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
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
class ProjectServiceIntegrationTest extends AbstractModelJpaTest {

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
    void createProject_shouldPersistProject_whenValidRequest() {
        // Arrange
        persistProjectDependencies(testProject);
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());
        User builder = testProject.getBuilderUser();
        User owner = testProject.getOwner();

        CreateProjectRequest request = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(owner.getId())
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
        assertEquals(owner.getId(), projectDto.getOwnerId());
        assertNotNull(projectDto.getLocationDto());
        assertNotNull(projectDto.getCreatedAt());
        assertNotNull(projectDto.getLastUpdatedAt());

        // Verify persistence by finding the project in the database
        Optional<Project> persistedProject = projectService.findById(projectDto.getId());
        assertTrue(persistedProject.isPresent());
        Project foundProject = persistedProject.get();
        assertEquals(projectDto.getId(), foundProject.getId());
        assertEquals(builder.getId(), foundProject.getBuilderUser().getId());
        assertEquals(owner.getId(), foundProject.getOwner().getId());
    }

    @Test
    void createProject_shouldThrow_whenBuilderNotFound() {
        // Arrange
        User owner = testProject.getOwner();
        owner = userService.newRegisteredUser(owner.getContact());
        assertNotNull(owner.getId());
        UUID nonExistentBuilderId = UUID.randomUUID();
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .builderId(nonExistentBuilderId)
                .ownerId(owner.getId())
                .locationRequestDto(locationRequestDto)
                .build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> projectService.createProject(request));
    }

    @Test
    void createProject_shouldThrow_whenOwnerNotFound() {
        // Arrange
        User builder = testProject.getBuilderUser();
        builder = userService.newRegisteredUser(builder.getContact());
        assertNotNull(builder.getId());
        UUID nonExistentOwnerId = UUID.randomUUID();
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(nonExistentOwnerId)
                .locationRequestDto(locationRequestDto)
                .build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
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
        User builder = userService.newRegisteredUser(testProject.getBuilderUser().getContact());
        User owner = userService.newRegisteredUser(testProject.getOwner().getContact());
        assertNotNull(builder.getId());
        assertNotNull(owner.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(owner.getId())
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
        User builder = userService.newRegisteredUser(testProject.getBuilderUser().getContact());
        User owner = userService.newRegisteredUser(testProject.getOwner().getContact());
        assertNotNull(builder.getId());
        assertNotNull(owner.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(owner.getId())
                .locationRequestDto(locationRequestDto)
                .build();

        CreateProjectResponse response = projectService.createProject(request);
        Optional<Project> projectOptional = projectService.findById(response.getProjectDto().getId());
        assertTrue(projectOptional.isPresent());
        Project project = projectOptional.get();

        // Act
        projectService.delete(project);

        // Assert
        assertFalse(projectRepository.existsById(project.getId()));
        assertTrue(projectService.findById(project.getId()).isEmpty());
    }

    @Test
    void isPersisted_shouldReturnTrue_whenProjectIsPersisted() {
        // Arrange
        User builder = userService.newRegisteredUser(testProject.getBuilderUser().getContact());
        User owner = userService.newRegisteredUser(testProject.getOwner().getContact());
        assertNotNull(builder.getId());
        assertNotNull(owner.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(owner.getId())
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
        User builder = userService.newRegisteredUser(testProject.getBuilderUser().getContact());
        User owner = userService.newRegisteredUser(testProject.getOwner().getContact());
        assertNotNull(builder.getId());
        assertNotNull(owner.getId());
        ProjectLocationRequestDto locationRequestDto = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(owner.getId())
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
        User builder = userService.newRegisteredUser(testProject.getBuilderUser().getContact());
        User owner1 = userService.newRegisteredUser(testProject.getOwner().getContact());
        assertNotNull(builder.getId());
        assertNotNull(owner1.getId());
        Contact owner1Contact = testOwnerUser.getContact();
        ContactAddress owner1ContactAddress = owner1Contact.getAddress();

        // Create a second owner with different email
        ContactAddress owner2ContactAddress = ContactAddress.builder()
                .unitNumber("22")
                .streetNumber("200")
                .streetName("Owner St")
                .city("Ownerville")
                .stateOrProvince("OS")
                .postalOrZipCode("22222")
                .country("Ownerland")
                .build();
        Contact owner2Contact = Contact.builder()
                .email("owner2@example.com")
                .firstName("Owner2")
                .lastName("User2")
                .phone(owner1Contact.getPhone())
                .address(owner2ContactAddress)
                .labels(new ArrayList<>(owner1Contact.getLabels()))
                .build();
        User owner2 = userService.newRegisteredUser(owner2Contact);
        assertNotNull(owner2.getId());

        // Create first project using test location data
        ProjectLocationRequestDto locationRequestDto1 = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request1 = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(owner1.getId())
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
                .builderId(builder.getId())
                .ownerId(owner2.getId())
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
        User builder = userService.newRegisteredUser(testBuilderUserContact);

        // Act
        List<Project> builderProjects = projectService.findByBuilderId(builder.getId());

        // Assert
        assertTrue(builderProjects.isEmpty());
    }

    @Test
    void findByOwnerId_shouldReturnProjects_whenOwnerHasProjects() {
        // Arrange
        User owner = userService.newRegisteredUser(testProject.getOwner().getContact());
        User builder1 = userService.newRegisteredUser(testProject.getBuilderUser().getContact());
        assertNotNull(owner.getId());
        assertNotNull(builder1.getId());
        Contact builder1Contact = testBuilderUser.getContact();

        // Create a second builder with different email
        ContactAddress builder2ContactAddress = ContactAddress.builder()
                .unitNumber("33")
                .streetNumber("300")
                .streetName("Builder St")
                .city("Builderville")
                .stateOrProvince("BS")
                .postalOrZipCode("33333")
                .country("Builderland")
                .build();
        Contact builder2Contact = Contact.builder()
                .email("builder2@example.com")
                .firstName("Builder2")
                .lastName("User2")
                .phone(builder1Contact.getPhone())
                .address(builder2ContactAddress)
                .labels(new ArrayList<>(builder1Contact.getLabels()))
                .build();
        User builder2 = userService.newRegisteredUser(builder2Contact);
        assertNotNull(builder2.getId());

        // Create first project using test location data
        ProjectLocationRequestDto locationRequestDto1 = toProjectLocationRequestDto(testProject.getLocation());

        CreateProjectRequest request1 = CreateProjectRequest.builder()
                .builderId(builder1.getId())
                .ownerId(owner.getId())
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
                .builderId(builder2.getId())
                .ownerId(owner.getId())
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
        User owner = userService.newRegisteredUser(testOwnerUserContact);

        // Act
        List<Project> ownerProjects = projectService.findByOwnerId(owner.getId());

        // Assert
        assertTrue(ownerProjects.isEmpty());
    }
}
