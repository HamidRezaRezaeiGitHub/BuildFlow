package dev.hr.rezaei.buildflow.workitem;

import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import dev.hr.rezaei.buildflow.workitem.dto.CreateWorkItemRequest;
import dev.hr.rezaei.buildflow.workitem.dto.CreateWorkItemResponse;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static dev.hr.rezaei.buildflow.util.EnumUtil.fromStringOrDefault;
import static dev.hr.rezaei.buildflow.util.StringUtil.orDefault;
import static dev.hr.rezaei.buildflow.workitem.WorkItemDtoMapper.toWorkItemDto;

@Slf4j
@Service
public class WorkItemService {

    private final UserService userService;
    private final WorkItemRepository workItemRepository;

    public WorkItemService(UserService userService,
                           WorkItemRepository workItemRepository) {
        this.userService = userService;
        this.workItemRepository = workItemRepository;
    }

    public WorkItem update(@NonNull WorkItem workItem) {
        if (!isPersisted(workItem)) {
            throw new IllegalArgumentException("WorkItem must be already persisted.");
        }

        workItem.setLastUpdatedAt(Instant.now());

        log.info("Updating work item: {}", workItem);
        return workItemRepository.save(workItem);
    }

    public void delete(@NonNull WorkItem workItem) {
        if (!isPersisted(workItem)) {
            throw new IllegalArgumentException("WorkItem must be already persisted.");
        }
        log.info("Deleting work item: {}", workItem);
        workItemRepository.delete(workItem);
    }

    public boolean isPersisted(@NonNull WorkItem workItem) {
        return workItem.getId() != null && workItemRepository.existsById(workItem.getId());
    }

    public boolean existsById(@NonNull UUID id) {
        return workItemRepository.existsById(id);
    }

    public Optional<WorkItem> findById(@NonNull UUID id) {
        return workItemRepository.findById(id);
    }

    public List<WorkItem> findAll() {
        return workItemRepository.findAll();
    }

    public List<WorkItemDto> getByUser(@NonNull User user) {
        if (user.getId() == null) {
            throw new UserNotFoundException("User ID cannot be null.");
        }

        // Verify user exists and is persisted
        Optional<User> persistedUser = userService.findById(user.getId());
        if (persistedUser.isEmpty()) {
            throw new UserNotFoundException("User with ID " + user.getId() + " does not exist or is not persisted.");
        }

        return workItemRepository.findByUser(user).stream()
                .map(WorkItemDtoMapper::toWorkItemDto)
                .toList();
    }

    public List<WorkItemDto> getByUserId(@NonNull UUID userId) {
        // Verify user exists and is persisted
        Optional<User> persistedUser = userService.findById(userId);
        if (persistedUser.isEmpty()) {
            throw new UserNotFoundException("User with ID " + userId + " does not exist or is not persisted.");
        }

        return workItemRepository.findByUserId(userId).stream()
                .map(WorkItemDtoMapper::toWorkItemDto)
                .toList();
    }

    public List<WorkItem> findByDomain(@NonNull WorkItemDomain domain) {
        return workItemRepository.findByDomain(domain);
    }

    public List<WorkItemDto> getByDomain(@NonNull String domain) {
        WorkItemDomain workItemDomain = fromStringOrDefault(WorkItemDomain.class, domain, null);
        if (workItemDomain == null) {
            throw new IllegalArgumentException("Invalid domain value: " + domain);
        }
        return workItemRepository.findByDomain(workItemDomain).stream()
                .map(WorkItemDtoMapper::toWorkItemDto)
                .toList();
    }

    public Optional<WorkItemDto> getByUserIdAndCode(@NonNull UUID userId, @NonNull String code) {
        if (code.isBlank()) {
            throw new IllegalArgumentException("Code cannot be null or empty.");
        }

        // Verify user exists and is persisted
        Optional<User> persistedUser = userService.findById(userId);
        if (persistedUser.isEmpty()) {
            throw new UserNotFoundException("User with ID " + userId + " does not exist or is not persisted.");
        }

        return workItemRepository.findByUserIdAndCode(userId, code)
                .map(WorkItemDtoMapper::toWorkItemDto);
    }

    public List<WorkItemDto> getByUserIdAndDomain(@NonNull UUID userId, @NonNull WorkItemDomain domain) {
        // Verify user exists and is persisted
        Optional<User> persistedUser = userService.findById(userId);
        if (persistedUser.isEmpty()) {
            throw new UserNotFoundException("User with ID " + userId + " does not exist or is not persisted.");
        }

        return workItemRepository.findByUserIdAndDomain(userId, domain).stream()
                .map(WorkItemDtoMapper::toWorkItemDto)
                .toList();
    }

    public long count() {
        return workItemRepository.count();
    }

    public CreateWorkItemResponse createWorkItem(@NonNull CreateWorkItemRequest request) {
        // Verify user exists and is persisted
        Optional<User> persistedUser = userService.findById(request.getUserId());
        if (persistedUser.isEmpty()) {
            throw new UserNotFoundException("User with ID " + request.getUserId() + " does not exist or is not persisted.");
        }

        Instant now = Instant.now();
        WorkItem workItem = WorkItem.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .optional(request.isOptional())
                .user(persistedUser.get())
                .defaultGroupName(orDefault(request.getDefaultGroupName(), WorkItem.UNASSIGNED_GROUP_NAME))
                .domain(fromStringOrDefault(WorkItemDomain.class, request.getDomain(), WorkItemDomain.PUBLIC))
                .createdAt(now)
                .lastUpdatedAt(now)
                .build();

        WorkItem savedWorkItem = workItemRepository.save(workItem);
        WorkItemDto workItemDto = toWorkItemDto(savedWorkItem);

        return CreateWorkItemResponse.builder()
                .workItemDto(workItemDto)
                .build();
    }
}
