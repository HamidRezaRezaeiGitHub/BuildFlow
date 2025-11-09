package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.config.mvc.AbstractAuthorizationHandler;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * ProjectParticipantAuthService handles authorization for participant operations.
 * Mirrors the pattern used in ProjectAuthService.
 */
@Slf4j
@Component
public class ProjectParticipantAuthService extends AbstractAuthorizationHandler {

    private final ProjectRepository projectRepository;

    public ProjectParticipantAuthService(UserService userService, ProjectRepository projectRepository) {
        super(userService);
        this.projectRepository = projectRepository;
    }

    /**
     * Check if the current user is authorized to view participants for a given project.
     * Admin users can always view. Non-admin users can only view participants for their own projects.
     */
    public boolean isViewParticipantsAuthorized(UUID projectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAdmin(authentication)) {
            return true;
        }

        User user = getAuthenticatedUser(authentication, "view project participants");
        UUID authenticatedUserId = user.getId();

        // Check if the project belongs to the authenticated user
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            log.debug("Project [{}] not found.", projectId);
            return false;
        }

        UUID projectOwnerId = project.get().getUser().getId();
        if (!authenticatedUserId.equals(projectOwnerId)) {
            log.debug("User [{}] is not authorized to view participants for project [{}] owned by [{}].", 
                    authenticatedUserId, projectId, projectOwnerId);
            return false;
        }
        return true;
    }

    /**
     * Check if the current user is authorized to create participants for a given project.
     * Admin users can always create. Non-admin users can only create participants for their own projects.
     */
    public boolean isCreateParticipantAuthorized(UUID projectId) {
        return isViewParticipantsAuthorized(projectId);
    }

    /**
     * Check if the current user is authorized to modify participants for a given project.
     * Admin users can always modify. Non-admin users can only modify participants for their own projects.
     */
    public boolean isModifyParticipantAuthorized(UUID projectId) {
        return isViewParticipantsAuthorized(projectId);
    }

    /**
     * Check if the current user is authorized to delete participants for a given project.
     * Admin users can always delete. Non-admin users can only delete participants for their own projects.
     */
    public boolean isDeleteParticipantAuthorized(UUID projectId) {
        return isViewParticipantsAuthorized(projectId);
    }
}
