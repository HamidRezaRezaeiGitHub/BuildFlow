package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractControllerTest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.ProjectLocationRequestDto;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerIntegrationTest extends AbstractControllerTest {

    @Test
    void createProject_shouldReturnCreated_whenValidRequest() throws Exception {
        // Given
        when(projectService.createProject(any(CreateProjectRequest.class))).thenReturn(testCreateProjectResponse);

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.projectDto.id").exists())
                .andExpect(jsonPath("$.projectDto.builderId").value(testBuilderUserDto.getId().toString()))
                .andExpect(jsonPath("$.projectDto.ownerId").value(testOwnerUserDto.getId().toString()))
                .andExpect(jsonPath("$.projectDto.locationDto").exists())
                .andExpect(jsonPath("$.projectDto.locationDto.streetName").value("789 Project Lane"))
                .andExpect(jsonPath("$.projectDto.locationDto.city").value("Project City"));
    }

    @Test
    void createProject_shouldReturnBadRequest_whenBuilderUserIdIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequestWithNullBuilderUserId)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createProject_shouldReturnBadRequest_whenOwnerUserIdIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequestWithNullOwnerUserId)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createProject_shouldReturnBadRequest_whenLocationRequestDtoIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequestWithNullLocation)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createProject_shouldReturnBadRequest_whenLocationStreetNameExceedsMaxLength() throws Exception {
        // Given
        CreateProjectRequest request = CreateProjectRequest.builder()
                .builderId(testBuilderUserDto.getId())
                .ownerId(testOwnerUserDto.getId())
                .locationRequestDto(testProjectLocationRequestDtoWithLongStreetName)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createProject_shouldReturnBadRequest_whenLocationHasBlankRequiredFields() throws Exception {
        // Given
        ProjectLocationRequestDto locationWithBlankFields = ProjectLocationRequestDto.builder()
                .streetName("")  // Invalid: blank
                .city("")        // Invalid: blank
                .stateOrProvince("Project State")
                .country("Project Country")
                .build();

        CreateProjectRequest request = CreateProjectRequest.builder()
                .builderId(testBuilderUserDto.getId())
                .ownerId(testOwnerUserDto.getId())
                .locationRequestDto(locationWithBlankFields)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createProject_shouldReturnBadRequest_whenRequestBodyIsEmpty() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createProject_shouldReturnBadRequest_whenContentTypeIsNotJson() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequest)))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    void createProject_shouldReturnBadRequest_whenAllRequiredFieldsAreMissing() throws Exception {
        // Given
        CreateProjectRequest emptyRequest = CreateProjectRequest.builder().build();

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }
}
