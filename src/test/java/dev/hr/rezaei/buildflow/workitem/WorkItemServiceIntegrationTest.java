package dev.hr.rezaei.buildflow.workitem;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.user.*;
import dev.hr.rezaei.buildflow.workitem.dto.CreateWorkItemRequest;
import dev.hr.rezaei.buildflow.workitem.dto.CreateWorkItemResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
class WorkItemServiceIntegrationTest extends AbstractModelJpaTest {

    @TestConfiguration
    static class WorkItemServiceTestConfig {
        @Bean
        public ContactService contactService(ContactRepository contactRepository) {
            return new ContactService(contactRepository);
        }

        @Bean
        public UserService userService(UserRepository userRepository, ContactService contactService) {
            return new UserService(userRepository, contactService);
        }

        @Bean
        public WorkItemService workItemService(UserService userService, WorkItemRepository workItemRepository) {
            return new WorkItemService(userService, workItemRepository);
        }
    }

    @Autowired
    private WorkItemService workItemService;

    @Autowired
    private UserService userService;

    @Test
    void update_shouldThrowException_whenWorkItemIsNotPersisted() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> workItemService.update(testWorkItem));
    }

    @Test
    void update_shouldPersistChanges_whenWorkItemIsPersisted() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        WorkItem savedWorkItem = workItemRepository.save(testWorkItem);
        savedWorkItem.setName("Updated Work Item Name");
        savedWorkItem.setDescription("Updated description");

        // Act
        WorkItem updatedWorkItem = workItemService.update(savedWorkItem);

        // Assert
        assertEquals("Updated Work Item Name", updatedWorkItem.getName());
        assertEquals("Updated description", updatedWorkItem.getDescription());
        assertEquals(savedWorkItem.getId(), updatedWorkItem.getId());
    }

    @Test
    void delete_shouldThrowException_whenWorkItemIsNotPersisted() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> workItemService.delete(testWorkItem));
    }

    @Test
    void delete_shouldRemoveWorkItem_whenWorkItemIsPersisted() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        WorkItem savedWorkItem = workItemRepository.save(testWorkItem);

        // Act
        workItemService.delete(savedWorkItem);

        // Assert
        assertFalse(workItemService.existsById(savedWorkItem.getId()));
        assertFalse(workItemRepository.existsById(savedWorkItem.getId()));
    }

    @Test
    void isPersisted_shouldReturnTrue_whenWorkItemExists() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        WorkItem savedWorkItem = workItemRepository.save(testWorkItem);

        // Act & Assert
        assertTrue(workItemService.isPersisted(savedWorkItem));
    }

    @Test
    void isPersisted_shouldReturnFalse_whenWorkItemDoesNotExist() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);

        // Act & Assert
        assertFalse(workItemService.isPersisted(testWorkItem));
    }

    @Test
    void existsById_shouldReturnTrue_whenWorkItemExists() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        WorkItem savedWorkItem = workItemRepository.save(testWorkItem);

        // Act & Assert
        assertTrue(workItemService.existsById(savedWorkItem.getId()));
    }

    @Test
    void existsById_shouldReturnFalse_whenWorkItemDoesNotExist() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();

        // Act & Assert
        assertFalse(workItemService.existsById(nonExistentId));
    }

    @Test
    void findById_shouldReturnWorkItem_whenExists() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        WorkItem savedWorkItem = workItemRepository.save(testWorkItem);

        // Act
        Optional<WorkItem> foundWorkItem = workItemService.findById(savedWorkItem.getId());

        // Assert
        assertTrue(foundWorkItem.isPresent());
        assertEquals(savedWorkItem.getId(), foundWorkItem.get().getId());
        assertEquals("WI-001", foundWorkItem.get().getCode());
    }

    @Test
    void findById_shouldReturnEmpty_whenNotExists() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();

        // Act
        Optional<WorkItem> foundWorkItem = workItemService.findById(nonExistentId);

        // Assert
        assertTrue(foundWorkItem.isEmpty());
    }

    @Test
    void findAll_shouldReturnAllWorkItems_whenMultipleExist() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        workItemRepository.save(testWorkItem);

        // Create a second user for the second work item
        Contact secondContact = Contact.builder()
                .email("second@example.com")
                .firstName("Second")
                .lastName("User")
                .build();
        User secondUser = userService.newRegisteredUser(secondContact, ContactLabel.BUILDER);

        WorkItem workItem2 = WorkItem.builder()
                .code("WI-002")
                .name("Second Test Work Item")
                .description("A second test work item")
                .optional(false)
                .user(secondUser)
                .defaultGroupName("Test Group")
                .domain(WorkItemDomain.PUBLIC)
                .build();

        workItemRepository.save(workItem2);

        // Act
        List<WorkItem> allWorkItems = workItemService.findAll();

        // Assert
        assertEquals(2, allWorkItems.size());
        assertTrue(allWorkItems.stream().anyMatch(wi -> "WI-001".equals(wi.getCode())));
        assertTrue(allWorkItems.stream().anyMatch(wi -> "WI-002".equals(wi.getCode())));
    }

    @Test
    void findByUser_shouldReturnWorkItemsForSpecificUser_whenUserHasWorkItems() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        workItemRepository.save(testWorkItem);

        // Create a second contact for the second user
        Contact secondContact = Contact.builder()
                .email("user2@example.com")
                .firstName("User2")
                .lastName("Test")
                .build();
        User user2 = userService.newRegisteredUser(secondContact, ContactLabel.OWNER);

        WorkItem workItem2 = WorkItem.builder()
                .code("USER2-001")
                .name("User 2 Work Item")
                .user(user2)
                .optional(false)
                .domain(WorkItemDomain.PUBLIC)
                .build();

        workItemRepository.save(workItem2);

        // Act
        List<WorkItem> user1WorkItems = workItemService.findByUser(testBuilderUser);

        // Assert
        assertEquals(1, user1WorkItems.size());
        assertEquals("WI-001", user1WorkItems.getFirst().getCode());
        assertEquals(testBuilderUser.getId(), user1WorkItems.getFirst().getUser().getId());
    }

    @Test
    void findByUser_shouldThrowException_whenUserIdIsNull() {
        // Arrange
        User userWithNullId = User.builder().id(null).build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> workItemService.findByUser(userWithNullId));
    }

    @Test
    void findByUser_shouldThrowException_whenUserDoesNotExist() {
        // Arrange
        UUID nonExistentUserId = UUID.randomUUID();
        User nonExistentUser = User.builder().id(nonExistentUserId).build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> workItemService.findByUser(nonExistentUser));
    }

    @Test
    void findByUserId_shouldReturnWorkItemsForSpecificUserId_whenUserHasWorkItems() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        workItemRepository.save(testWorkItem);

        // Act
        List<WorkItem> userWorkItems = workItemService.findByUserId(testBuilderUser.getId());

        // Assert
        assertEquals(1, userWorkItems.size());
        assertEquals("WI-001", userWorkItems.getFirst().getCode());
        assertEquals(testBuilderUser.getId(), userWorkItems.getFirst().getUser().getId());
    }

    @Test
    void findByUserId_shouldThrowException_whenUserDoesNotExist() {
        // Arrange
        UUID nonExistentUserId = UUID.randomUUID();

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> workItemService.findByUserId(nonExistentUserId));
    }

    @Test
    void findByDomain_shouldReturnWorkItemsForSpecificDomain_whenDomainHasWorkItems() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        workItemRepository.save(testWorkItem);

        // Create a separate user for the private work item
        Contact privateContact = Contact.builder()
                .email("private@example.com")
                .firstName(WorkItemDomain.PRIVATE.name())
                .lastName("User")
                .build();
        User privateUser = userService.newRegisteredUser(privateContact, ContactLabel.BUILDER);

        WorkItem privateWorkItem = WorkItem.builder()
                .code("PRIVATE-001")
                .name("Private Work Item")
                .description("A private work item")
                .optional(false)
                .user(privateUser)
                .defaultGroupName("Private Group")
                .domain(WorkItemDomain.PRIVATE)
                .build();

        workItemRepository.save(privateWorkItem);

        // Act
        List<WorkItem> publicWorkItems = workItemService.findByDomain(WorkItemDomain.PUBLIC);

        // Assert
        assertEquals(1, publicWorkItems.size());
        assertEquals("WI-001", publicWorkItems.getFirst().getCode());
        assertEquals(WorkItemDomain.PUBLIC, publicWorkItems.getFirst().getDomain());
    }

    @Test
    void count_shouldReturnCorrectCount_whenWorkItemsExist() {
        // Arrange
        assertEquals(0, workItemService.count());

        persistWorkItemDependencies(testWorkItem);
        workItemRepository.save(testWorkItem);

        // Create a separate user for the second work item
        Contact countContact = Contact.builder()
                .email("count@example.com")
                .firstName("Count")
                .lastName("User")
                .build();
        User countUser = userService.newRegisteredUser(countContact, ContactLabel.BUILDER);

        WorkItem workItem2 = WorkItem.builder()
                .code("COUNT-002")
                .name("Second Test Work Item")
                .description("A second test work item")
                .optional(false)
                .user(countUser)
                .defaultGroupName("Test Group")
                .domain(WorkItemDomain.PUBLIC)
                .build();

        workItemRepository.save(workItem2);

        // Act & Assert
        assertEquals(2, workItemService.count());
    }

    @Test
    void findByUserIdAndCode_shouldReturnWorkItem_whenExists() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        workItemRepository.save(testWorkItem);

        // Act
        Optional<WorkItem> foundWorkItem = workItemService.findByUserIdAndCode(testBuilderUser.getId(), "WI-001");

        // Assert
        assertTrue(foundWorkItem.isPresent());
        assertEquals("WI-001", foundWorkItem.get().getCode());
        assertEquals(testBuilderUser.getId(), foundWorkItem.get().getUser().getId());
    }

    @Test
    void findByUserIdAndCode_shouldReturnEmpty_whenNotExists() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        workItemRepository.save(testWorkItem);

        // Act
        Optional<WorkItem> foundWorkItem = workItemService.findByUserIdAndCode(testBuilderUser.getId(), "NON-EXISTENT");

        // Assert
        assertTrue(foundWorkItem.isEmpty());
    }

    @Test
    void findByUserIdAndCode_shouldThrowException_whenCodeIsEmpty() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        workItemRepository.save(testWorkItem);

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> workItemService.findByUserIdAndCode(testBuilderUser.getId(), "   "));
    }

    @Test
    void findByUserIdAndCode_shouldThrowException_whenUserDoesNotExist() {
        // Arrange
        UUID nonExistentUserId = UUID.randomUUID();

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> workItemService.findByUserIdAndCode(nonExistentUserId, "CODE"));
    }

    @Test
    void findByUserIdAndDomain_shouldReturnWorkItemsForUserAndDomain_whenMatches() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        workItemRepository.save(testWorkItem);

        WorkItem privateWorkItem = WorkItem.builder()
                .code("PRIVATE-USER-001")
                .name("Private User Work Item")
                .user(testBuilderUser)
                .optional(false)
                .domain(WorkItemDomain.PRIVATE)
                .build();

        workItemRepository.save(privateWorkItem);

        // Act
        List<WorkItem> publicUserWorkItems = workItemService.findByUserIdAndDomain(testBuilderUser.getId(), WorkItemDomain.PUBLIC);

        // Assert
        assertEquals(1, publicUserWorkItems.size());
        assertEquals("WI-001", publicUserWorkItems.getFirst().getCode());
        assertEquals(WorkItemDomain.PUBLIC, publicUserWorkItems.getFirst().getDomain());
        assertEquals(testBuilderUser.getId(), publicUserWorkItems.getFirst().getUser().getId());
    }

    @Test
    void findByUserIdAndDomain_shouldReturnEmpty_whenNoneMatch() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        workItemRepository.save(testWorkItem);

        // Act
        List<WorkItem> workItems = workItemService.findByUserIdAndDomain(testBuilderUser.getId(), WorkItemDomain.PRIVATE);

        // Assert
        assertTrue(workItems.isEmpty());
    }

    @Test
    void findByUserIdAndDomain_shouldThrowException_whenUserDoesNotExist() {
        // Arrange
        UUID nonExistentUserId = UUID.randomUUID();

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> workItemService.findByUserIdAndDomain(nonExistentUserId, WorkItemDomain.PUBLIC));
    }

    @Test
    void createWorkItem_shouldCreateWorkItem_whenValidRequest() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        CreateWorkItemRequest request = CreateWorkItemRequest.builder()
                .code(testWorkItem.getCode())
                .name(testWorkItem.getName())
                .description(testWorkItem.getDescription())
                .optional(testWorkItem.isOptional())
                .userId(testWorkItem.getUser().getId())
                .defaultGroupName(testWorkItem.getDefaultGroupName())
                .domain(testWorkItem.getDomain().name())
                .build();

        // Act
        CreateWorkItemResponse response = workItemService.createWorkItem(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getWorkItemDto());
        assertEquals(testWorkItem.getCode(), response.getWorkItemDto().getCode());
        assertEquals(testWorkItem.getName(), response.getWorkItemDto().getName());
        assertEquals(testWorkItem.getDescription(), response.getWorkItemDto().getDescription());
        assertEquals(testWorkItem.isOptional(), response.getWorkItemDto().isOptional());
        assertEquals(testWorkItem.getUser().getId(), response.getWorkItemDto().getUserId());
        assertEquals(testWorkItem.getDefaultGroupName(), response.getWorkItemDto().getDefaultGroupName());
        assertEquals(testWorkItem.getDomain().name(), response.getWorkItemDto().getDomain());

        // Verify it was persisted
        Optional<WorkItem> savedWorkItem = workItemService.findByUserIdAndCode(testWorkItem.getUser().getId(), testWorkItem.getCode());
        assertTrue(savedWorkItem.isPresent());
    }

    @Test
    void createWorkItem_shouldUseDefaultValues_whenOptionalFieldsNotProvided() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        CreateWorkItemRequest request = CreateWorkItemRequest.builder()
                .code(testWorkItem.getCode() + "-DEFAULT")
                .name(testWorkItem.getName() + " Default")
                .description(testWorkItem.getDescription() + " with defaults")
                .optional(false)
                .userId(testWorkItem.getUser().getId())
                // defaultGroupName is null - should use default
                // domain is null - should use default
                .build();

        // Act
        CreateWorkItemResponse response = workItemService.createWorkItem(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getWorkItemDto());
        assertEquals(testWorkItem.getCode() + "-DEFAULT", response.getWorkItemDto().getCode());
        assertEquals(testWorkItem.getName() + " Default", response.getWorkItemDto().getName());
        assertEquals(testWorkItem.getDescription() + " with defaults", response.getWorkItemDto().getDescription());
        assertFalse(response.getWorkItemDto().isOptional());
        assertEquals(testWorkItem.getUser().getId(), response.getWorkItemDto().getUserId());
        assertEquals(WorkItem.UNASSIGNED_GROUP_NAME, response.getWorkItemDto().getDefaultGroupName());
        assertEquals(WorkItemDomain.PUBLIC.name(), response.getWorkItemDto().getDomain());
    }

    @Test
    void createWorkItem_shouldHandlePrivateDomain_whenDomainSpecified() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        CreateWorkItemRequest request = CreateWorkItemRequest.builder()
                .code(testWorkItem.getCode() + "-PRIVATE")
                .name(testWorkItem.getName() + " Private")
                .description(testWorkItem.getDescription() + " private")
                .optional(testWorkItem.isOptional())
                .userId(testWorkItem.getUser().getId())
                .defaultGroupName(testWorkItem.getDefaultGroupName() + " Private")
                .domain(WorkItemDomain.PRIVATE.name())
                .build();

        // Act
        CreateWorkItemResponse response = workItemService.createWorkItem(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getWorkItemDto());
        assertEquals(testWorkItem.getCode() + "-PRIVATE", response.getWorkItemDto().getCode());
        assertEquals(testWorkItem.getName() + " Private", response.getWorkItemDto().getName());
        assertEquals(WorkItemDomain.PRIVATE.name(), response.getWorkItemDto().getDomain());
        assertEquals(testWorkItem.getUser().getId(), response.getWorkItemDto().getUserId());
    }

    @Test
    void createWorkItem_shouldThrowException_whenUserDoesNotExist() {
        // Arrange
        UUID nonExistentUserId = UUID.randomUUID();
        CreateWorkItemRequest request = CreateWorkItemRequest.builder()
                .code(testWorkItem.getCode() + "-FAIL")
                .name(testWorkItem.getName() + " Failing")
                .description(testWorkItem.getDescription() + " should fail")
                .optional(testWorkItem.isOptional())
                .userId(nonExistentUserId)
                .defaultGroupName(testWorkItem.getDefaultGroupName())
                .domain(testWorkItem.getDomain().name())
                .build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> workItemService.createWorkItem(request));
    }

    @Test
    void createWorkItem_shouldHandleInvalidDomain_withDefaultFallback() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        CreateWorkItemRequest request = CreateWorkItemRequest.builder()
                .code(testWorkItem.getCode() + "-INVALID")
                .name(testWorkItem.getName() + " Invalid Domain")
                .description(testWorkItem.getDescription() + " with invalid domain")
                .optional(testWorkItem.isOptional())
                .userId(testWorkItem.getUser().getId())
                .defaultGroupName(testWorkItem.getDefaultGroupName())
                .domain("INVALID_DOMAIN")
                .build();

        // Act
        CreateWorkItemResponse response = workItemService.createWorkItem(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getWorkItemDto());
        assertEquals(testWorkItem.getCode() + "-INVALID", response.getWorkItemDto().getCode());
        assertEquals(testWorkItem.getName() + " Invalid Domain", response.getWorkItemDto().getName());
        // Should fallback to PUBLIC domain for invalid domain
        assertEquals(WorkItemDomain.PUBLIC.name(), response.getWorkItemDto().getDomain());
    }

    @Test
    void createWorkItem_shouldIncrementCount_whenWorkItemCreated() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);
        long initialCount = workItemService.count();

        CreateWorkItemRequest request = CreateWorkItemRequest.builder()
                .code("COUNT-001")
                .name("Count Test Work Item")
                .description("Testing count increment")
                .optional(false)
                .userId(testBuilderUser.getId())
                .defaultGroupName("Count Group")
                .domain(WorkItemDomain.PUBLIC.name())
                .build();

        // Act
        workItemService.createWorkItem(request);

        // Assert
        assertEquals(initialCount + 1, workItemService.count());
    }

    @Test
    void createWorkItem_shouldCreateMultipleWorkItems_forSameUser() {
        // Arrange
        persistWorkItemDependencies(testWorkItem);

        CreateWorkItemRequest request1 = CreateWorkItemRequest.builder()
                .code("MULTI-001")
                .name("First Multi Work Item")
                .description("First work item")
                .optional(false)
                .userId(testBuilderUser.getId())
                .defaultGroupName("Multi Group")
                .domain(WorkItemDomain.PUBLIC.name())
                .build();

        CreateWorkItemRequest request2 = CreateWorkItemRequest.builder()
                .code("MULTI-002")
                .name("Second Multi Work Item")
                .description("Second work item")
                .optional(true)
                .userId(testBuilderUser.getId())
                .defaultGroupName("Multi Group")
                .domain(WorkItemDomain.PRIVATE.name())
                .build();

        // Act
        CreateWorkItemResponse response1 = workItemService.createWorkItem(request1);
        CreateWorkItemResponse response2 = workItemService.createWorkItem(request2);

        // Assert
        assertNotNull(response1);
        assertNotNull(response2);

        List<WorkItem> userWorkItems = workItemService.findByUserId(testBuilderUser.getId());
        assertEquals(2, userWorkItems.size());

        assertTrue(userWorkItems.stream().anyMatch(wi -> "MULTI-001".equals(wi.getCode())));
        assertTrue(userWorkItems.stream().anyMatch(wi -> "MULTI-002".equals(wi.getCode())));
    }
}
