package dev.hr.rezaei.buildflow.model;

import dev.hr.rezaei.buildflow.model.estimate.*;
import dev.hr.rezaei.buildflow.model.project.Project;
import dev.hr.rezaei.buildflow.model.project.ProjectLocation;
import dev.hr.rezaei.buildflow.model.user.Contact;
import dev.hr.rezaei.buildflow.model.user.ContactAddress;
import dev.hr.rezaei.buildflow.model.user.User;
import org.junit.jupiter.api.BeforeEach;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;

import static dev.hr.rezaei.buildflow.model.estimate.WorkItem.UNASSIGNED_GROUP_NAME;
import static dev.hr.rezaei.buildflow.model.estimate.WorkItemDomain.PUBLIC;

public abstract class AbstractModelTest {

    protected ContactAddress testContactAddress;
    protected Contact testContact;
    protected User testUser;
    protected ProjectLocation testProjectLocation;
    protected Project testProject;
    protected WorkItem testWorkItem;
    protected Estimate testEstimate;
    protected EstimateGroup testEstimateGroup;
    protected EstimateLine testEstimateLine;

    @BeforeEach
    public void setUpEstimateModelObjects() {
        testContactAddress = ContactAddress.builder()
                .unitNumber("1")
                .streetNumber("100")
                .streetName("Main St")
                .city("Testville")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("Testland")
                .build();

        testContact = Contact.builder()
                .firstName("Test")
                .lastName("User")
                .address(testContactAddress)
                .labels(new ArrayList<>())
                .email("testuser@example.com")
                .phone("1234567890")
                .build();

        testUser = User.builder()
                .username("testuser")
                .email("testuser@example.com")
                .registered(true)
                .contact(testContact)
                .builtProjects(new ArrayList<>())
                .ownedProjects(new ArrayList<>())
                .createdQuotes(new ArrayList<>())
                .suppliedQuotes(new ArrayList<>())
                .build();

        testProjectLocation = ProjectLocation.builder()
                .unitNumber("2")
                .streetNumber("100")
                .streetName("Main St")
                .city("Testville")
                .stateOrProvince("TS")
                .postalOrZipCode("123456")
                .country("Testland")
                .build();

        testProject = Project.builder()
                .builderUser(testUser)
                .owner(testUser)
                .location(testProjectLocation)
                .estimates(new ArrayList<>())
                .build();

        testWorkItem = WorkItem.builder()
                .code("WI-001")
                .name("Test Work Item")
                .description("A test work item.")
                .optional(false)
                .owner(testUser)
                .defaultGroupName(UNASSIGNED_GROUP_NAME)
                .domain(PUBLIC)
                .createdAt(Instant.now().minus(5, ChronoUnit.DAYS))
                .lastUpdatedAt(Instant.now().minus(4, ChronoUnit.DAYS))
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

        testEstimateLine = EstimateLine.builder()
                .estimate(testEstimate)
                .workItem(testWorkItem)
                .quantity(10.0)
                .estimateStrategy(EstimateLineStrategy.AVERAGE)
                .multiplier(1.0)
                .computedCost(BigDecimal.valueOf(100.0))
                .group(testEstimateGroup)
                .build();
    }
}
