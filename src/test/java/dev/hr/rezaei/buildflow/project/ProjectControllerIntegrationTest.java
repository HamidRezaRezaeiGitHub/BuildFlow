package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractControllerIntegrationTest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class ProjectControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Test
    void createProject_shouldReturnCreated_whenAdminUser() throws Exception {
        String token = getAdmin().getToken();
        var builder = getBuilder().getUser();
        var owner = getOwner().getUser();
        var projectRequest = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(owner.getId())
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.29." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.projectDto.id").exists())
                .andExpect(jsonPath("$.projectDto.builderId").value(builder.getId().toString()))
                .andExpect(jsonPath("$.projectDto.ownerId").value(owner.getId().toString()));
    }

    @Test
    void createProject_shouldReturnCreated_whenUserHasCreateProjectAuthorityAndIsAllowed() throws Exception {
        var builderToken = getBuilder();
        var builder = builderToken.getUser();
        var token = builderToken.getToken();
        var projectRequest = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(builder.getId())
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.30." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.projectDto.id").exists())
                .andExpect(jsonPath("$.projectDto.builderId").value(builder.getId().toString()))
                .andExpect(jsonPath("$.projectDto.ownerId").value(builder.getId().toString()));
    }

    @Test
    void createProject_shouldReturnForbidden_whenUserHasCreateProjectAuthorityButIsNotAllowed() throws Exception {
        var actingUserToken = getBuilder();
        var token = actingUserToken.getToken();
        var builder = getBuilder().getUser();
        var owner = getOwner().getUser();
        var projectRequest = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(owner.getId())
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.31." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void createProject_shouldReturnForbidden_whenUserLacksRequiredAuthority() throws Exception {
        var viewerToken = getViewer();
        var viewer = viewerToken.getUser();
        var token = viewerToken.getToken();
        var projectRequest = CreateProjectRequest.builder()
                .builderId(viewer.getId())
                .ownerId(viewer.getId())
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.32." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void createProject_shouldReturnUnauthorized_whenNoJwtProvided() throws Exception {
        var builder = userService.createUser(testCreateBuilderRequest);
        var owner = userService.createUser(testCreateOwnerRequest);
        var projectRequest = CreateProjectRequest.builder()
                .builderId(builder.getUserDto().getId())
                .ownerId(owner.getUserDto().getId())
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("X-Forwarded-For", "192.168.33." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }
}
