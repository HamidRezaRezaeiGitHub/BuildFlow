package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractControllerTest;
import dev.hr.rezaei.buildflow.config.mvc.DateFilter;
import dev.hr.rezaei.buildflow.user.UserNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerTest extends AbstractControllerTest {

    @Test
    void createProject_shouldReturnCreated_whenValidRequest() throws Exception {
        // Given
        when(projectService.createProject(any(UUID.class), any(String.class), any(ProjectLocation.class)))
                .thenReturn(testProject);
        UUID userId = testProject.getUser().getId();
        String role = testProject.getRole().name();
        ProjectLocation location = testProject.getLocation();

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequest)))
                // .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.project.id").exists())
                .andExpect(jsonPath("$.project.userId").value(userId.toString()))
                .andExpect(jsonPath("$.project.role").value(role))
                .andExpect(jsonPath("$.project.location").exists())
                .andExpect(jsonPath("$.project.location.streetNumberAndName").value(location.getStreetNumberAndName()))
                .andExpect(jsonPath("$.project.location.city").value(location.getCity()));
    }

    @Test
    void createProject_shouldReturnBadRequest_whenBuilderUserIdIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequestWithNullBuilderUserId)))
                // .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.status").value(containsString("400")))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void createProject_shouldReturnBadRequest_whenLocationIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequestWithNullLocation)))
                // .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.status").value(containsString("400")))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void createProject_shouldReturnNotFound_whenBuilderNotFound() throws Exception {
        // Given
        UUID nonExistentBuilderId = UUID.randomUUID();
        when(projectService.createProject(any(UUID.class), any(String.class), any(ProjectLocation.class)))
                .thenThrow(new UserNotFoundException("Builder with ID " + nonExistentBuilderId + " does not exist."));

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequest)))
                // .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void createProject_shouldReturnNotFound_whenOwnerNotFound() throws Exception {
        // Given
        UUID nonExistentOwnerId = UUID.randomUUID();
        when(projectService.createProject(any(UUID.class), any(String.class), any(ProjectLocation.class)))
                .thenThrow(new UserNotFoundException("Owner with ID " + nonExistentOwnerId + " does not exist."));

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequest)))
                // .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void getProjectsByUserId_shouldReturnOk_whenUserExists() throws Exception {
        // Given
        Page<Project> page = new PageImpl<>(List.of(testProject));
        when(projectService.getProjectsByUserId(any(UUID.class), any(Pageable.class), any(DateFilter.class)))
                .thenReturn(page);

        // When & Then
        mockMvc.perform(get("/api/v1/projects/user/{userId}", testBuilderUserDto.getId()))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(testProject.getId().toString()))
                .andExpect(jsonPath("$[0].userId").value(testProject.getUser().getId().toString()))
                .andExpect(jsonPath("$[0].role").value(testProject.getRole().name()));
    }

    @Test
    void getProjectsByUserId_shouldReturnNotFound_whenUserNotFound() throws Exception {
        // Given
        UUID nonExistentUserId = UUID.randomUUID();
        when(projectService.getProjectsByUserId(any(UUID.class), any(Pageable.class), any(DateFilter.class)))
                .thenThrow(new UserNotFoundException("User with ID " + nonExistentUserId + " does not exist."));

        // When & Then
        mockMvc.perform(get("/api/v1/projects/user/{userId}", nonExistentUserId))
                // .andDo(print())
                .andExpect(status().isNotFound());
    }
}
