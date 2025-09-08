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

    public boolean canCreateProject(CreateProjectRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAdmin(authentication)) {
            return true;
        }

        User user = getAuthenticatedUser(authentication, "create a project");
        UUID requestorId = user.getId();
        UUID builderId = request.getBuilderId();
        UUID ownerId = request.getOwnerId();
        if (!requestorId.equals(builderId) && !requestorId.equals(ownerId)) {
            log.debug("User [{}] is not authorized to create project for builder [{}] and owner [{}].", requestorId, builderId, ownerId);
            return false;
        }
        return true;
    }

}
