package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectResponse;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static dev.hr.rezaei.buildflow.project.ProjectLocationDtoMapper.toProjectLocationEntity;

/**
 * ProjectService providing business logic for project management operations.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>Project package documentation: "ProjectServices.md"</li>
 *     <li>Base package documentation: "../Services.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@Slf4j
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public ProjectService(ProjectRepository projectRepository,
                          UserService userService) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    public CreateProjectResponse createProject(@NonNull CreateProjectRequest request) {
        UUID builderId = request.getBuilderId();
        Optional<User> optionalBuilder = userService.findById(builderId);
        if (optionalBuilder.isEmpty()) {
            throw new UserNotFoundException("Builder with ID " + builderId + " does not exist.");
        }
        User builder = optionalBuilder.get();

        UUID ownerId = request.getOwnerId();
        Optional<User> optionalOwner = userService.findById(ownerId);
        if (optionalOwner.isEmpty()) {
            throw new UserNotFoundException("Owner with ID " + ownerId + " does not exist.");
        }
        User owner = optionalOwner.get();

        ProjectLocation location = toProjectLocationEntity(request.getLocationRequestDto());
        if (location == null) {
            throw new IllegalArgumentException("Cannot create project with null location.");
        }
        if (location.getId() != null) {
            throw new IllegalArgumentException("Project location should only be cascaded, not persisted directly.");
        }

        Instant now = Instant.now();
        Project project = Project.builder()
                .builderUser(builder)
                .owner(owner)
                .location(location)
                .createdAt(now)
                .lastUpdatedAt(now)
                .build();

        log.info("Persisting new project for builder Id {}, owner Id {}, at location {}", builderId, ownerId, location);
        Project savedProject = projectRepository.save(project);

        return CreateProjectResponse.builder()
                .projectDto(ProjectDtoMapper.toProjectDto(savedProject))
                .build();
    }

    public Project update(@NonNull Project project) {
        if (!isPersisted(project)) {
            throw new IllegalArgumentException("Project must be already persisted.");
        }

        Instant now = Instant.now();
        project.setLastUpdatedAt(now);
        return projectRepository.save(project);
    }

    public void delete(@NonNull Project project) {
        if (!isPersisted(project)) {
            throw new IllegalArgumentException("Project must be already persisted.");
        }
        projectRepository.delete(project);
    }

    public boolean isPersisted(@NonNull Project project) {
        return project.getId() != null && projectRepository.existsById(project.getId());
    }

    public Optional<Project> findById(@NonNull UUID id) {
        return projectRepository.findById(id);
    }

    public List<Project> findByBuilderId(@NonNull UUID builderId) {
        return projectRepository.findByBuilderUserId(builderId);
    }

    public List<Project> findByOwnerId(@NonNull UUID ownerId) {
        return projectRepository.findByOwnerId(ownerId);
    }

    public List<ProjectDto> getProjectsByBuilderId(@NonNull UUID builderId) {
        // Verify builder exists and is persisted
        Optional<User> persistedBuilder = userService.findById(builderId);
        if (persistedBuilder.isEmpty()) {
            throw new UserNotFoundException("Builder with ID " + builderId + " does not exist.");
        }

        List<Project> projects = findByBuilderId(builderId);
        return projects.stream()
                .map(ProjectDtoMapper::toProjectDto)
                .toList();
    }

    public List<ProjectDto> getProjectsByOwnerId(@NonNull UUID ownerId) {
        // Verify owner exists and is persisted
        Optional<User> persistedOwner = userService.findById(ownerId);
        if (persistedOwner.isEmpty()) {
            throw new UserNotFoundException("Owner with ID " + ownerId + " does not exist.");
        }

        List<Project> projects = findByOwnerId(ownerId);
        return projects.stream()
                .map(ProjectDtoMapper::toProjectDto)
                .toList();
    }
}
