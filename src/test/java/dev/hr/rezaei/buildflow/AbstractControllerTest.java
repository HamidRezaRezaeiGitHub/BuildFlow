package dev.hr.rezaei.buildflow;


import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.project.Project;
import dev.hr.rezaei.buildflow.project.ProjectLocation;
import dev.hr.rezaei.buildflow.project.ProjectRole;
import dev.hr.rezaei.buildflow.user.*;
import dev.hr.rezaei.buildflow.user.UserService;
import dev.hr.rezaei.buildflow.project.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "spring.security.enabled=false")
public class AbstractControllerTest extends AbstractDtoTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @MockitoBean
    protected UserService userService;

    @MockitoBean
    protected ProjectService projectService;
    
    // Entity test fixtures
    protected User testBuilderUser;
    protected User testOwnerUser;
    protected Project testProject;
    
    @BeforeEach
    public void setUpEntityFixtures() {
        // Builder user entity
        ContactAddress builderAddress = ContactAddress.builder()
                .streetNumberAndName("123 Main St")
                .city("Test City")
                .stateOrProvince("Test State")
                .country("Test Country")
                .build();
        
        Contact builderContact = Contact.builder()
                .firstName("John")
                .lastName("Builder")
                .email("john.builder@example.com")
                .phone("555-1234")
                .labels(new ArrayList<>())
                .address(builderAddress)
                .build();
        builderContact.getLabels().add(ContactLabel.BUILDER);
        
        testBuilderUser = User.builder()
                .contact(builderContact)
                .username("john.builder@example.com")
                .email("john.builder@example.com")
                .registered(true)
                .build();
        testBuilderUser.setId(testBuilderUserDto.getId());
        
        // Owner user entity
        ContactAddress ownerAddress = ContactAddress.builder()
                .streetNumberAndName("456 Oak Ave")
                .city("Owner City")
                .stateOrProvince("Owner State")
                .country("Owner Country")
                .build();
        
        Contact ownerContact = Contact.builder()
                .firstName("Jane")
                .lastName("Owner")
                .email("jane.owner@example.com")
                .phone("555-5678")
                .labels(new ArrayList<>())
                .address(ownerAddress)
                .build();
        ownerContact.getLabels().add(ContactLabel.OWNER);
        
        testOwnerUser = User.builder()
                .contact(ownerContact)
                .username("jane.owner@example.com")
                .email("jane.owner@example.com")
                .registered(false)
                .build();
        testOwnerUser.setId(testOwnerUserDto.getId());
        
        // Project entity
        ProjectLocation location = ProjectLocation.builder()
                .streetNumberAndName("789 Project Lane")
                .city("Project City")
                .stateOrProvince("Project State")
                .postalOrZipCode("12345")
                .country("Project Country")
                .build();
        location.setId(testProjectLocationDto.getId());
        
        testProject = Project.builder()
                .user(testBuilderUser)
                .role(ProjectRole.BUILDER)
                .location(location)
                .build();
        testProject.setId(testProjectDto.getId());
        testProject.setCreatedAt(java.time.Instant.now());
        testProject.setLastUpdatedAt(java.time.Instant.now());
    }
}
