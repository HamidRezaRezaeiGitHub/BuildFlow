package dev.hr.rezaei.buildflow;

import dev.hr.rezaei.buildflow.estimate.Estimate;
import dev.hr.rezaei.buildflow.estimate.EstimateGroup;
import dev.hr.rezaei.buildflow.estimate.EstimateLine;
import dev.hr.rezaei.buildflow.estimate.EstimateLineStrategy;
import dev.hr.rezaei.buildflow.project.Project;
import dev.hr.rezaei.buildflow.project.ProjectLocation;
import dev.hr.rezaei.buildflow.project.ProjectRole;
import dev.hr.rezaei.buildflow.user.Contact;
import dev.hr.rezaei.buildflow.user.ContactAddress;
import dev.hr.rezaei.buildflow.user.ContactLabel;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.workitem.WorkItem;
import org.junit.jupiter.api.BeforeEach;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;

import static dev.hr.rezaei.buildflow.workitem.WorkItem.UNASSIGNED_GROUP_NAME;
import static dev.hr.rezaei.buildflow.workitem.WorkItemDomain.PUBLIC;

public abstract class AbstractModelTest {

    protected ContactAddress testBuilderUserContactAddress;
    protected ContactAddress testOwnerUserContactAddress;
    protected Contact testBuilderUserContact;
    protected Contact testOwnerUserContact;
    protected User testBuilderUser;
    protected User testOwnerUser;
    protected ProjectLocation testProjectLocation;
    protected Project testProject;
    protected WorkItem testWorkItem;
    protected WorkItem testWorkItem2;
    protected Estimate testEstimate;
    protected EstimateGroup testEstimateGroup;
    protected EstimateGroup testEstimateGroup2;
    protected EstimateLine testEstimateLine;
    protected EstimateLine testEstimateLine2;

    @BeforeEach
    public void setUpEstimateModelObjects() {
        testBuilderUserContactAddress = ContactAddress.builder()
                .unitNumber("1")
                .streetNumberAndName("100 Main St")
                .city("Testville")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("Testland")
                .build();

        testOwnerUserContactAddress = ContactAddress.builder()
                .unitNumber("2")
                .streetNumberAndName("200 Second St")
                .city("Testtown")
                .stateOrProvince("TT")
                .postalOrZipCode("67890")
                .country("Testland")
                .build();

        testBuilderUserContact = Contact.builder()
                .firstName("Test")
                .lastName("User")
                .address(testBuilderUserContactAddress)
                .labels(new ArrayList<>())
                .email("testuser@example.com")
                .phone("1234567890")
                .build();

        testOwnerUserContact = Contact.builder()
                .firstName("Owner")
                .lastName("User")
                .address(testOwnerUserContactAddress)
                .labels(new ArrayList<>())
                .email("testowner@example.com")
                .phone("0987654321")
                .build();

        testBuilderUser = User.builder()
                .username("testuser")
                .email("testuser@example.com")
                .registered(true)
                .contact(testBuilderUserContact)
                .build();

        testOwnerUser = User.builder()
                .username("testowner")
                .email("testowner@example.com")
                .registered(true)
                .contact(testOwnerUserContact)
                .build();

        testProjectLocation = ProjectLocation.builder()
                .unitNumber("2")
                .streetNumberAndName("100 Main St")
                .city("Testville")
                .stateOrProvince("TS")
                .postalOrZipCode("123456")
                .country("Testland")
                .build();

        testProject = Project.builder()
                .user(testBuilderUser)
                .role(ProjectRole.BUILDER)
                .location(testProjectLocation)
                .estimates(new ArrayList<>())
                .participants(new ArrayList<>())
                .build();

        testWorkItem = WorkItem.builder()
                .code("WI-001")
                .name("Test Work Item")
                .description("A test work item.")
                .optional(false)
                .user(testBuilderUser)
                .defaultGroupName(UNASSIGNED_GROUP_NAME)
                .domain(PUBLIC)
                .createdAt(Instant.now().minus(5, ChronoUnit.DAYS))
                .lastUpdatedAt(Instant.now().minus(4, ChronoUnit.DAYS))
                .build();

        testWorkItem2 = WorkItem.builder()
                .code("WI-002")
                .name("Test Work Item 2")
                .description("Another test work item.")
                .optional(false)
                .user(testBuilderUser)
                .defaultGroupName("Second Group")
                .domain(PUBLIC)
                .createdAt(Instant.now().minus(3, ChronoUnit.DAYS))
                .lastUpdatedAt(Instant.now().minus(2, ChronoUnit.DAYS))
                .build();

        testEstimate = Estimate.builder()
                .project(testProject)
                .overallMultiplier(1.0)
                .groups(new HashSet<>())
                .build();

        testEstimateGroup = EstimateGroup.builder()
                .name("Test Group")
                .description("A test estimate group.")
                .estimate(testEstimate)
                .estimateLines(new HashSet<>())
                .build();
        testEstimate.getGroups().add(testEstimateGroup);

        testEstimateGroup2 = EstimateGroup.builder()
                .name("Test Group 2")
                .description("Another test estimate group.")
                .estimate(testEstimate)
                .estimateLines(new HashSet<>())
                .build();
        testEstimate.getGroups().add(testEstimateGroup2);

        testEstimateLine = EstimateLine.builder()
                .estimate(testEstimate)
                .workItem(testWorkItem)
                .quantity(10.0)
                .estimateStrategy(EstimateLineStrategy.AVERAGE)
                .multiplier(1.0)
                .computedCost(BigDecimal.valueOf(100.0))
                .group(testEstimateGroup)
                .build();
        testEstimateGroup.getEstimateLines().add(testEstimateLine);

        testEstimateLine2 = EstimateLine.builder()
                .estimate(testEstimate)
                .workItem(testWorkItem2)
                .quantity(5.0)
                .estimateStrategy(EstimateLineStrategy.AVERAGE)
                .multiplier(1.0)
                .computedCost(BigDecimal.valueOf(50.0))
                .group(testEstimateGroup2)
                .build();
        testEstimateGroup2.getEstimateLines().add(testEstimateLine2);
    }

    protected ContactAddress createRandomContactAddress() {
        return ContactAddress.builder()
                .unitNumber("Unit " + (int) (Math.random() * 100))
                .streetNumberAndName(String.valueOf((int) (Math.random() * 1000)) + " Street " + (int) (Math.random() * 100))
                .city("City " + (int) (Math.random() * 100))
                .stateOrProvince("State " + (int) (Math.random() * 50))
                .postalOrZipCode(String.valueOf((int) (Math.random() * 100000)))
                .country("Country " + (int) (Math.random() * 50))
                .build();
    }

    protected Contact createRandomContact() {
        return Contact.builder()
                .firstName("First " + (int) (Math.random() * 100))
                .lastName("Last " + (int) (Math.random() * 100))
                .address(createRandomContactAddress())
                .labels(new ArrayList<>())
                .email("email" + (int) (Math.random() * 1000) + "@example.com")
                .phone(String.valueOf((int) (Math.random() * 1000000000)))
                .build();
    }

    protected User createRandomBuilderUser() {
        Contact contact = createRandomContact();
        contact.getLabels().add(ContactLabel.BUILDER);
        
        // Generate a single email to use for both user and contact to ensure consistency
        String email = "builder" + (int) (Math.random() * 1000) + "@example.com";
        contact.setEmail(email);
        
        User builder = User.builder()
                .email(email)
                .registered(true)
                .contact(contact)
                .build();
        builder.setUsername(builder.getEmail());
        return builder;
    }

    protected User createRandomOwnerUser() {
        Contact contact = createRandomContact();
        contact.getLabels().add(ContactLabel.OWNER);
        
        // Generate a single email to use for both user and contact to ensure consistency
        String email = "owner" + (int) (Math.random() * 1000) + "@example.com";
        contact.setEmail(email);
        
        User owner = User.builder()
                .email(email)
                .registered(true)
                .contact(contact)
                .build();
        owner.setUsername(owner.getEmail());
        return owner;
    }

    protected ProjectLocation createRandomProjectLocation() {
        return ProjectLocation.builder()
                .unitNumber("Unit " + (int) (Math.random() * 100))
                .streetNumberAndName(String.valueOf((int) (Math.random() * 1000)) + " Street " + (int) (Math.random() * 100))
                .city("City " + (int) (Math.random() * 100))
                .stateOrProvince("State " + (int) (Math.random() * 50))
                .postalOrZipCode(String.valueOf((int) (Math.random() * 100000)))
                .country("Country " + (int) (Math.random() * 50))
                .build();
    }

    protected Project createRandomProject() {
        User user = createRandomBuilderUser();
        ProjectLocation location = createRandomProjectLocation();

        return Project.builder()
                .user(user)
                .role(ProjectRole.BUILDER)
                .location(location)
                .estimates(new ArrayList<>())
                .participants(new ArrayList<>())
                .build();
    }

    protected WorkItem createRandomWorkItem() {
        User user = createRandomBuilderUser();

        // Generate timestamps ensuring createdAt < lastUpdatedAt
        int daysAgo = (int) (Math.random() * 30) + 5; // 5-35 days ago
        Instant createdAt = Instant.now().minus(daysAgo, ChronoUnit.DAYS);
        int updateDaysAgo = (int) (Math.random() * (daysAgo - 1)) + 1; // 1 to (daysAgo-1) days ago
        Instant lastUpdatedAt = Instant.now().minus(updateDaysAgo, ChronoUnit.DAYS);

        return WorkItem.builder()
                .code("WI-" + (int) (Math.random() * 1000))
                .name("Random Work Item " + (int) (Math.random() * 100))
                .description("A randomly generated work item.")
                .optional(Math.random() < 0.5)
                .user(user)
                .defaultGroupName(UNASSIGNED_GROUP_NAME)
                .domain(PUBLIC)
                .createdAt(createdAt)
                .lastUpdatedAt(lastUpdatedAt)
                .build();
    }
}
