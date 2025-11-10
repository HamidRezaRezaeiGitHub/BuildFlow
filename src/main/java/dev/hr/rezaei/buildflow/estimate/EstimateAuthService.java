package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.config.mvc.AbstractAuthorizationHandler;
import dev.hr.rezaei.buildflow.project.Project;
import dev.hr.rezaei.buildflow.project.ProjectRepository;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * EstimateAuthService handles authorization for estimate operations.
 * Mirrors the pattern used in ProjectParticipantAuthService.
 */
@Slf4j
@Component
public class EstimateAuthService extends AbstractAuthorizationHandler {

    private final ProjectRepository projectRepository;

    public EstimateAuthService(UserService userService, ProjectRepository projectRepository) {
        super(userService);
        this.projectRepository = projectRepository;
    }

    /**
     * Check if the current user is authorized to view estimates for a given project.
     * Admin users can always view. Non-admin users can only view estimates for their own projects.
     */
    public boolean isViewEstimatesAuthorized(UUID projectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAdmin(authentication)) {
            return true;
        }

        User user = getAuthenticatedUser(authentication, "view project estimates");
        UUID authenticatedUserId = user.getId();

        // Check if the project belongs to the authenticated user
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            log.debug("Project [{}] not found.", projectId);
            return false;
        }

        UUID projectOwnerId = project.get().getUser().getId();
        if (!authenticatedUserId.equals(projectOwnerId)) {
            log.debug("User [{}] is not authorized to view estimates for project [{}] owned by [{}].", 
                    authenticatedUserId, projectId, projectOwnerId);
            return false;
        }
        return true;
    }

    /**
     * Check if the current user is authorized to create estimates for a given project.
     * Admin users can always create. Non-admin users can only create estimates for their own projects.
     */
    public boolean isCreateEstimateAuthorized(UUID projectId) {
        return isViewEstimatesAuthorized(projectId);
    }

    /**
     * Check if the current user is authorized to modify estimates for a given project.
     * Admin users can always modify. Non-admin users can only modify estimates for their own projects.
     */
    public boolean isModifyEstimateAuthorized(UUID projectId) {
        return isViewEstimatesAuthorized(projectId);
    }

    /**
     * Check if the current user is authorized to delete estimates for a given project.
     * Admin users can always delete. Non-admin users can only delete estimates for their own projects.
     */
    public boolean isDeleteEstimateAuthorized(UUID projectId) {
        return isViewEstimatesAuthorized(projectId);
    }
}
