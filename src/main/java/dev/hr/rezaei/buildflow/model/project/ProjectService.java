package dev.hr.rezaei.buildflow.model.project;

import dev.hr.rezaei.buildflow.model.user.User;
import dev.hr.rezaei.buildflow.model.user.UserService;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectLocationService projectLocationService;
    private final UserService userService;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectLocationService projectLocationService,
                          UserService userService) {
        this.projectRepository = projectRepository;
        this.projectLocationService = projectLocationService;
        this.userService = userService;
    }

    public Project create(@NonNull UUID builderId,
                          @NonNull UUID ownerId,
                          @NonNull ProjectLocation location) {
        Optional<User> optionalBuilder = userService.findById(builderId);
        if (optionalBuilder.isEmpty()) {
            throw new IllegalArgumentException("Builder with ID " + builderId + " does not exist.");
        }
        User builder = optionalBuilder.get();

        Optional<User> optionalOwner = userService.findById(ownerId);
        if (optionalOwner.isEmpty()) {
            throw new IllegalArgumentException("Owner with ID " + ownerId + " does not exist.");
        }
        User owner = optionalOwner.get();

        if (projectLocationService.isPersisted(location)) {
            throw new IllegalArgumentException("Project location must not be already persisted.");
        }

        Instant now = Instant.now();
        Project project = Project.builder()
                .builderUser(builder)
                .owner(owner)
                .location(location)
                .createdAt(now)
                .lastUpdatedAt(now)
                .build();

        return projectRepository.save(project);
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
}
