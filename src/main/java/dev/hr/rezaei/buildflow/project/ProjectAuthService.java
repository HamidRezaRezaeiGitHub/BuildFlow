package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.base.UserNotAuthorizedException;
import dev.hr.rezaei.buildflow.config.mvc.AbstractAuthorizationHandler;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
public class ProjectAuthService extends AbstractAuthorizationHandler {

    public ProjectAuthService(UserService userService) {
        super(userService);
    }

    public boolean isCreateRequestAuthorized(CreateProjectRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAdmin(authentication)) {
            return true;
        }

        User user = getAuthenticatedUser(authentication, "create a project");
        UUID authenticatedUserId = user.getId();
        UUID requestorId = request.getUserId();
        if (!authenticatedUserId.equals(requestorId)) {
            log.debug("User [{}] is not authorized to create project for another user [{}].", authenticatedUserId, requestorId);
            return false;
        }
        return true;
    }

    public boolean isViewProjectsAuthorized(UUID requestedId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAdmin(authentication)) {
            return true;
        }

        User user = getAuthenticatedUser(authentication, "view user projects");
        UUID requestorId = user.getId();

        if (!requestorId.equals(requestedId)) {
            log.debug("User [{}] is not authorized to view projects for another user [{}].", requestorId, requestedId);
            return false;
        }
        return true;
    }

    public boolean isViewProjectAuthorized(UUID projectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAdmin(authentication)) {
            return true;
        }

        User user = getAuthenticatedUser(authentication, "view project");
        UUID requestorId = user.getId();
        
        // Note: In a real implementation, you would fetch the project and check if the user
        // is associated with it. For now, we'll assume any authenticated user can view projects.
        // This should be enhanced to check project ownership/participation.
        log.debug("User [{}] is authorized to view project [{}].", requestorId, projectId);
        return true;
    }

    /**
     * Post-authorization check: Verifies if the authenticated user is authorized to view the given project.
     * This is called AFTER the project is retrieved to check actual ownership.
     * Throws UserNotAuthorizedException if the user is not authorized.
     * 
     * @param project The project to check authorization for
     * @throws UserNotAuthorizedException if user is not authorized
     */
    public void postAuthorizeProjectView(Project project) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAdmin(authentication)) {
            return;
        }

        User user = getAuthenticatedUser(authentication, "view project");
        UUID requestorId = user.getId();
        UUID projectUserId = project.getUser().getId();

        if (!requestorId.equals(projectUserId)) {
            log.warn("User [{}] is not authorized to view project [{}] owned by user [{}].", 
                    requestorId, project.getId(), projectUserId);
            throw new UserNotAuthorizedException("You are not authorized to view this project");
        }

        log.debug("User [{}] is authorized to view their own project [{}].", requestorId, project.getId());
    }

}
