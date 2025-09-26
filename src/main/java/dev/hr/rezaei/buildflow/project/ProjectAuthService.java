package dev.hr.rezaei.buildflow.project;

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

        User user = getAuthenticatedUser(authentication, "view builder/owner projects");
        UUID requestorId = user.getId();

        if (!requestorId.equals(requestedId)) {
            log.debug("User [{}] is not authorized to view projects for another builder/owner [{}].", requestorId, requestedId);
            return false;
        }
        return true;
    }

}
