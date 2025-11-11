package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.user.UserNotFoundException;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    public void validate(UUID userId, String roleStr, ProjectLocation location) {
        if (!userService.existsById(userId)) {
            throw new UserNotFoundException("User with ID " + userId + " does not exist.");
        }

        if (roleStr == null || roleStr.trim().isEmpty()) {
            throw new IllegalArgumentException("Role is required.");
        }
        
        try {
            ProjectRole.valueOf(roleStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleStr + ". Must be BUILDER or OWNER.");
        }

        if (location == null) {
            throw new IllegalArgumentException("Cannot create project with null location.");
        }
        if (location.getId() != null) {
            throw new IllegalArgumentException("Project location should only be cascaded, not persisted directly.");
        }
    }

    @SuppressWarnings("OptionalGetWithoutIsPresent")
    public Project createProject(@NonNull UUID userId, @NonNull String roleStr, @NonNull ProjectLocation location) {
        validate(userId, roleStr, location);
        
        User user = userService.findById(userId).get();
        ProjectRole role = ProjectRole.valueOf(roleStr);

        Instant now = Instant.now();
        Project project = Project.builder()
                .user(user)
                .role(role)
                .location(location)
                .createdAt(now)
                .lastUpdatedAt(now)
                .build();

        log.info("Persisting new project for user ID [{}] with role [{}] at location: {}",
                userId, role, location);
        Project savedProject = projectRepository.save(project);

        return savedProject;
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

    public List<Project> findByUserId(@NonNull UUID userId) {
        return projectRepository.findByUserId(userId);
    }

    /**
     * Get all projects for a user with validation.
     * Transaction ensures participants are loaded within session.
     */
    @Transactional(readOnly = true)
    public List<Project> getProjectsByUserId(@NonNull UUID userId) {
        // Verify user exists and is persisted
        Optional<User> persistedUser = userService.findById(userId);
        if (persistedUser.isEmpty()) {
            throw new UserNotFoundException("User with ID " + userId + " does not exist.");
        }

        return findByUserId(userId);
    }

    /**
     * Find projects by user ID with pagination support.
     * Applies default sort by lastUpdatedAt DESC if pageable is unsorted.
     * Transaction ensures participants are loaded within session.
     */
    @Transactional(readOnly = true)
    public Page<Project> getProjectsByUserId(@NonNull UUID userId, @NonNull Pageable pageable) {
        // Verify user exists and is persisted
        Optional<User> persistedUser = userService.findById(userId);
        if (persistedUser.isEmpty()) {
            throw new UserNotFoundException("User with ID " + userId + " does not exist.");
        }

        Pageable pageableWithSort = ensureDefaultSort(pageable);
        return projectRepository.findByUserId(userId, pageableWithSort);
    }

    /**
     * Ensures that the pageable has default sorting by lastUpdatedAt DESC if no sort is provided.
     */
    private Pageable ensureDefaultSort(Pageable pageable) {
        if (pageable.getSort().isUnsorted()) {
            return PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "lastUpdatedAt")
            );
        }
        return pageable;
    }
}
