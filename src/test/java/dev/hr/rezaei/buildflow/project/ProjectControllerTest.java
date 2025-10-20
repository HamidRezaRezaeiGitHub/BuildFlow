package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractControllerTest;
import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerTest extends AbstractControllerTest {

    @Test
    void createProject_shouldReturnCreated_whenValidRequest() throws Exception {
        // Given
        when(projectService.createProject(any(CreateProjectRequest.class))).thenReturn(testCreateProjectResponse);
        ProjectDto projectDto = testCreateProjectResponse.getProjectDto();
        UUID builderId = projectDto.getBuilderId();
        UUID ownerId = projectDto.getOwnerId();
        ProjectLocationDto locationDto = projectDto.getLocationDto();

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequest)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.projectDto.id").exists())
                .andExpect(jsonPath("$.projectDto.builderId").value(builderId.toString()))
                .andExpect(jsonPath("$.projectDto.ownerId").value(ownerId.toString()))
                .andExpect(jsonPath("$.projectDto.locationDto").exists())
                .andExpect(jsonPath("$.projectDto.locationDto.streetNumberAndName").value(locationDto.getStreetNumberAndName()))
                .andExpect(jsonPath("$.projectDto.locationDto.city").value(locationDto.getCity()));
    }

    @Test
    void createProject_shouldReturnBadRequest_whenBuilderUserIdIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequestWithNullBuilderUserId)))
                .andDo(print())
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
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.status").value(containsString("400")))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void createProject_shouldReturnNotFound_whenBuilderNotFound() throws Exception {
        // Given
        UUID nonExistentBuilderId = UUID.randomUUID();
        when(projectService.createProject(any(CreateProjectRequest.class)))
                .thenThrow(new UserNotFoundException("Builder with ID " + nonExistentBuilderId + " does not exist."));

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequest)))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void createProject_shouldReturnNotFound_whenOwnerNotFound() throws Exception {
        // Given
        UUID nonExistentOwnerId = UUID.randomUUID();
        when(projectService.createProject(any(CreateProjectRequest.class)))
                .thenThrow(new UserNotFoundException("Owner with ID " + nonExistentOwnerId + " does not exist."));

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequest)))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void getProjectsByBuilderId_shouldReturnOk_whenBuilderExists() throws Exception {
        // Given
        org.springframework.data.domain.Page<ProjectDto> page = 
                new org.springframework.data.domain.PageImpl<>(List.of(testProjectDto));
        when(projectService.getProjectsByBuilderId(any(UUID.class), any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(page);

        // When & Then
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", testBuilderUserDto.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(testProjectDto.getId().toString()))
                .andExpect(jsonPath("$[0].builderId").value(testBuilderUserDto.getId().toString()))
                .andExpect(jsonPath("$[0].ownerId").value(testOwnerUserDto.getId().toString()));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnNotFound_whenBuilderNotFound() throws Exception {
        // Given
        UUID nonExistentBuilderId = UUID.randomUUID();
        when(projectService.getProjectsByBuilderId(any(UUID.class), any(org.springframework.data.domain.Pageable.class)))
                .thenThrow(new UserNotFoundException("Builder with ID " + nonExistentBuilderId + " does not exist."));

        // When & Then
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", nonExistentBuilderId))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void getProjectsByOwnerId_shouldReturnOk_whenOwnerExists() throws Exception {
        // Given
        org.springframework.data.domain.Page<ProjectDto> page = 
                new org.springframework.data.domain.PageImpl<>(List.of(testProjectDto));
        when(projectService.getProjectsByOwnerId(any(UUID.class), any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(page);

        // When & Then
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", testOwnerUserDto.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(testProjectDto.getId().toString()))
                .andExpect(jsonPath("$[0].builderId").value(testBuilderUserDto.getId().toString()))
                .andExpect(jsonPath("$[0].ownerId").value(testOwnerUserDto.getId().toString()));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnNotFound_whenOwnerNotFound() throws Exception {
        // Given
        UUID nonExistentOwnerId = UUID.randomUUID();
        when(projectService.getProjectsByOwnerId(any(UUID.class), any(org.springframework.data.domain.Pageable.class)))
                .thenThrow(new UserNotFoundException("Owner with ID " + nonExistentOwnerId + " does not exist."));

        // When & Then
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", nonExistentOwnerId))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}
