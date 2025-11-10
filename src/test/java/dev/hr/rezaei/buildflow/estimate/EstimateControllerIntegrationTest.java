package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.AbstractControllerIntegrationTest;
import dev.hr.rezaei.buildflow.project.Project;
import dev.hr.rezaei.buildflow.project.ProjectLocation;
import dev.hr.rezaei.buildflow.project.ProjectService;
import dev.hr.rezaei.buildflow.project.ProjectRole;
import dev.hr.rezaei.buildflow.user.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for EstimateController endpoints.
 */
@SpringBootTest
public class EstimateControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Autowired
    private EstimateService estimateService;

    @Autowired
    private ProjectService projectService;

    /**
     * Helper method to create and save a project for testing.
     */
    private Project createTestProject(User user) {
        ProjectLocation location = ProjectLocation.builder()
                .streetNumberAndName("123 Test Street")
                .city("Test City")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("Testland")
                .build();
        
        return projectService.createProject(user.getId(), ProjectRole.BUILDER.name(), location);
    }

    @Test
    void createEstimate_shouldReturnCreated() throws Exception {
        User builder = registerBuilder();
        String token = login(builder);
        Project project = createTestProject(builder);

        String requestBody = """
                {
                    "overallMultiplier": 1.5
                }
                """;

        mockMvc.perform(post("/api/v1/projects/" + project.getId() + "/estimates")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.projectId").value(project.getId().toString()))
                .andExpect(jsonPath("$.overallMultiplier").value(1.5));
    }

    @Test
    void getEstimates_shouldReturnPaginatedList() throws Exception {
        User builder = registerBuilder();
        String token = login(builder);
        Project project = createTestProject(builder);

        // Create a few estimates
        estimateService.createEstimate(project.getId(), 1.0);
        estimateService.createEstimate(project.getId(), 1.5);
        estimateService.createEstimate(project.getId(), 2.0);

        mockMvc.perform(get("/api/v1/projects/" + project.getId() + "/estimates")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void getEstimate_shouldReturnEstimate_whenExists() throws Exception {
        User builder = registerBuilder();
        String token = login(builder);
        Project project = createTestProject(builder);
        Estimate estimate = estimateService.createEstimate(project.getId(), 1.5);

        mockMvc.perform(get("/api/v1/projects/" + project.getId() + "/estimates/" + estimate.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(estimate.getId().toString()))
                .andExpect(jsonPath("$.projectId").value(project.getId().toString()))
                .andExpect(jsonPath("$.overallMultiplier").value(1.5));
    }

    @Test
    void updateEstimate_shouldReturnUpdated() throws Exception {
        User builder = registerBuilder();
        String token = login(builder);
        Project project = createTestProject(builder);
        Estimate estimate = estimateService.createEstimate(project.getId(), 1.0);

        String requestBody = """
                {
                    "overallMultiplier": 2.5
                }
                """;

        mockMvc.perform(put("/api/v1/projects/" + project.getId() + "/estimates/" + estimate.getId())
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(estimate.getId().toString()))
                .andExpect(jsonPath("$.overallMultiplier").value(2.5));
    }

    @Test
    void deleteEstimate_shouldReturnNoContent() throws Exception {
        User builder = registerBuilder();
        String token = login(builder);
        Project project = createTestProject(builder);
        Estimate estimate = estimateService.createEstimate(project.getId(), 1.0);

        mockMvc.perform(delete("/api/v1/projects/" + project.getId() + "/estimates/" + estimate.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    @Test
    void getEstimate_shouldReturnBadRequest_whenEstimateBelongsToDifferentProject() throws Exception {
        User builder = registerBuilder();
        String token = login(builder);
        Project project1 = createTestProject(builder);
        Project project2 = createTestProject(builder);
        Estimate estimate = estimateService.createEstimate(project1.getId(), 1.0);

        // Try to access estimate from project1 via project2's endpoint
        mockMvc.perform(get("/api/v1/projects/" + project2.getId() + "/estimates/" + estimate.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().is4xxClientError());
    }
}
