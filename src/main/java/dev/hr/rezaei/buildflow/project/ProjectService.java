package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectResponse;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static dev.hr.rezaei.buildflow.project.ProjectDtoMapper.toProjectDto;
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

    public void validate(CreateProjectRequest request) {
        UUID userId = request.getUserId();
        if (!userService.existsById(userId)) {
            throw new UserNotFoundException("User with ID " + userId + " does not exist.");
        }

        if (request.getLocationRequestDto() == null) {
            throw new IllegalArgumentException("Cannot create project with null location.");
        }
        ProjectLocation location = toProjectLocationEntity(request.getLocationRequestDto());
        if (location == null) {
            throw new IllegalArgumentException("Cannot create project with null location.");
        }
        if (location.getId() != null) {
            throw new IllegalArgumentException("Project location should only be cascaded, not persisted directly.");
        }
    }

    @SuppressWarnings("OptionalGetWithoutIsPresent")
    public CreateProjectResponse createProject(@NonNull CreateProjectRequest request) {
        validate(request);
        User builder = null;
        User owner = null;
        if (request.isBuilder()) {
            builder = userService.findById(request.getUserId()).get();
        } else {
            owner = userService.findById(request.getUserId()).get();
        }
        ProjectLocation location = toProjectLocationEntity(request.getLocationRequestDto());

        Instant now = Instant.now();
        Project project = Project.builder()
                .builderUser(builder)
                .owner(owner)
                .location(location)
                .createdAt(now)
                .lastUpdatedAt(now)
                .build();

        log.info("Persisting new project for user ID [{}], who is {}a builder, at location: {}",
                request.getUserId(), request.isBuilder() ? "" : "not ", location);
        Project savedProject = projectRepository.save(project);

        return CreateProjectResponse.builder()
                .projectDto(toProjectDto(savedProject))
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

    /**
     * Find projects by builder ID with pagination support.
     * Applies default sort by lastUpdatedAt DESC if pageable is unsorted.
     */
    public Page<Project> findByBuilderId(@NonNull UUID builderId, @NonNull Pageable pageable) {
        Pageable pageableWithSort = ensureDefaultSort(pageable);
        return projectRepository.findByBuilderUserId(builderId, pageableWithSort);
    }

    /**
     * Find projects by owner ID with pagination support.
     * Applies default sort by lastUpdatedAt DESC if pageable is unsorted.
     */
    public Page<Project> findByOwnerId(@NonNull UUID ownerId, @NonNull Pageable pageable) {
        Pageable pageableWithSort = ensureDefaultSort(pageable);
        return projectRepository.findByOwnerId(ownerId, pageableWithSort);
    }

    /**
     * Get paginated project DTOs by builder ID with default sorting.
     */
    public Page<ProjectDto> getProjectsByBuilderId(@NonNull UUID builderId, @NonNull Pageable pageable) {
        // Verify builder exists and is persisted
        Optional<User> persistedBuilder = userService.findById(builderId);
        if (persistedBuilder.isEmpty()) {
            throw new UserNotFoundException("Builder with ID " + builderId + " does not exist.");
        }

        Page<Project> projects = findByBuilderId(builderId, pageable);
        return projects.map(ProjectDtoMapper::toProjectDto);
    }

    /**
     * Get paginated project DTOs by owner ID with default sorting.
     */
    public Page<ProjectDto> getProjectsByOwnerId(@NonNull UUID ownerId, @NonNull Pageable pageable) {
        // Verify owner exists and is persisted
        Optional<User> persistedOwner = userService.findById(ownerId);
        if (persistedOwner.isEmpty()) {
            throw new UserNotFoundException("Owner with ID " + ownerId + " does not exist.");
        }

        Page<Project> projects = findByOwnerId(ownerId, pageable);
        return projects.map(ProjectDtoMapper::toProjectDto);
    }

    /**
     * Ensures that the pageable has default sorting by lastUpdatedAt DESC if no sort is provided.
     */
    private Pageable ensureDefaultSort(Pageable pageable) {
        if (pageable.getSort().isUnsorted()) {
            return org.springframework.data.domain.PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "lastUpdatedAt")
            );
        }
        return pageable;
    }
    
    /**
     * Get combined projects where user is either builder OR owner with date filtering.
     * 
     * @param userId The user ID to search for
     * @param scope The scope: "both", "builder", or "owner"
     * @param createdFrom Optional start date filter (inclusive)
     * @param createdTo Optional end date filter (inclusive)
     * @param pageable Pagination and sorting parameters
     * @return Page of ProjectDto with de-duplicated, filtered, and sorted results
     */
    public Page<ProjectDto> getCombinedProjects(
            @NonNull UUID userId,
            @NonNull String scope,
            Instant createdFrom,
            Instant createdTo,
            @NonNull Pageable pageable) {
        
        // Verify user exists
        Optional<User> persistedUser = userService.findById(userId);
        if (persistedUser.isEmpty()) {
            throw new UserNotFoundException("User with ID " + userId + " does not exist.");
        }
        
        Pageable pageableWithSort = ensureDefaultSort(pageable);
        Page<Project> projects;
        
        // Route to appropriate query based on scope
        switch (scope.toLowerCase()) {
            case "builder":
                projects = projectRepository.findBuilderProjects(userId, createdFrom, createdTo, pageableWithSort);
                break;
            case "owner":
                projects = projectRepository.findOwnerProjects(userId, createdFrom, createdTo, pageableWithSort);
                break;
            case "both":
            default:
                projects = projectRepository.findCombinedProjects(userId, createdFrom, createdTo, pageableWithSort);
                break;
        }
        
        return projects.map(ProjectDtoMapper::toProjectDto);
    }
}
