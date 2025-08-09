package dev.hr.rezaei.buildflow.workitem;

import dev.hr.rezaei.buildflow.user.UserService;
import org.springframework.stereotype.Service;

@Service
public class WorkItemService {

    private final UserService userService;
    private final WorkItemRepository workItemRepository;

    public WorkItemService(UserService userService,
                           WorkItemRepository workItemRepository) {
        this.userService = userService;
        this.workItemRepository = workItemRepository;
    }
}

