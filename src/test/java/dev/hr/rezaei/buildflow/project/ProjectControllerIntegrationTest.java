package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractControllerIntegrationTest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.user.dto.*;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class ProjectControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Test
    void createProject_shouldReturnCreated_whenValidRequest() throws Exception {
        // Given - extract inner DTOs for safer assertions
        var projectLocationRequestDto = testCreateProjectRequest.getLocationRequestDto();

        // Create users first by calling the API endpoints
        var builderRequest = testCreateBuilderRequest;
        var ownerRequest = testCreateOwnerRequest;

        // Create builder user via API
        String builderResponseJson = mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(builderRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        var builderResponse = objectMapper.readValue(builderResponseJson, CreateBuilderResponse.class);

        // Create owner user via API
        String ownerResponseJson = mockMvc.perform(post("/api/v1/users/owners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ownerRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        var ownerResponse = objectMapper.readValue(ownerResponseJson, CreateOwnerResponse.class);

        var projectRequest = CreateProjectRequest.builder()
                .builderId(builderResponse.getUserDto().getId())
                .ownerId(ownerResponse.getUserDto().getId())
                .locationRequestDto(projectLocationRequestDto)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.projectDto.id").exists())
                .andExpect(jsonPath("$.projectDto.builderId").value(builderResponse.getUserDto().getId().toString()))
                .andExpect(jsonPath("$.projectDto.ownerId").value(ownerResponse.getUserDto().getId().toString()))
                .andExpect(jsonPath("$.projectDto.locationDto").exists())
                .andExpect(jsonPath("$.projectDto.locationDto.streetName").value(projectLocationRequestDto.getStreetName()))
                .andExpect(jsonPath("$.projectDto.locationDto.city").value(projectLocationRequestDto.getCity()))
                .andExpect(jsonPath("$.projectDto.locationDto.stateOrProvince").value(projectLocationRequestDto.getStateOrProvince()))
                .andExpect(jsonPath("$.projectDto.locationDto.country").value(projectLocationRequestDto.getCountry()));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnOk_whenBuilderHasProjects() throws Exception {
        // Given - extract inner DTOs for safer assertions
        var builderContactRequestDto = testBuilderContactRequestDto;
        var ownerContactRequestDto = testOwnerContactRequestDto;
        var projectLocationRequestDto = testCreateProjectRequest.getLocationRequestDto();

        // Create users first by calling the API endpoints with unique emails
        var builderRequest = CreateBuilderRequest.builder()
                .registered(testCreateBuilderRequest.isRegistered())
                .contactRequestDto(ContactRequestDto.builder()
                        .firstName(builderContactRequestDto.getFirstName())
                        .lastName(builderContactRequestDto.getLastName())
                        .email("builder.with.projects@test.com") // Use unique email
                        .phone(builderContactRequestDto.getPhone())
                        .labels(builderContactRequestDto.getLabels())
                        .addressRequestDto(builderContactRequestDto.getAddressRequestDto())
                        .build())
                .build();

        var ownerRequest = CreateOwnerRequest.builder()
                .registered(testCreateOwnerRequest.isRegistered())
                .contactRequestDto(ContactRequestDto.builder()
                        .firstName(ownerContactRequestDto.getFirstName())
                        .lastName(ownerContactRequestDto.getLastName())
                        .email("owner.for.builder@test.com") // Use unique email
                        .phone(ownerContactRequestDto.getPhone())
                        .labels(ownerContactRequestDto.getLabels())
                        .addressRequestDto(ownerContactRequestDto.getAddressRequestDto())
                        .build())
                .build();

        // Create builder user via API
        String builderResponseJson = mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(builderRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        var builderResponse = objectMapper.readValue(builderResponseJson, CreateBuilderResponse.class);

        // Create owner user via API
        String ownerResponseJson = mockMvc.perform(post("/api/v1/users/owners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ownerRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        var ownerResponse = objectMapper.readValue(ownerResponseJson, CreateOwnerResponse.class);

        var projectRequest = CreateProjectRequest.builder()
                .builderId(builderResponse.getUserDto().getId())
                .ownerId(ownerResponse.getUserDto().getId())
                .locationRequestDto(projectLocationRequestDto)
                .build();

        // Create the project via API
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isCreated());

        // When & Then
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builderResponse.getUserDto().getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].builderId").value(builderResponse.getUserDto().getId().toString()))
                .andExpect(jsonPath("$[0].ownerId").value(ownerResponse.getUserDto().getId().toString()))
                .andExpect(jsonPath("$[0].locationDto.streetName").value(projectLocationRequestDto.getStreetName()))
                .andExpect(jsonPath("$[0].locationDto.city").value(projectLocationRequestDto.getCity()));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnOk_whenOwnerHasProjects() throws Exception {
        // Given - extract inner DTOs for safer assertions
        var builderContactRequestDto = testBuilderContactRequestDto;
        var ownerContactRequestDto = testOwnerContactRequestDto;
        var projectLocationRequestDto = testCreateProjectRequest.getLocationRequestDto();

        // Create users first by calling the API endpoints with unique emails
        var builderRequest = CreateBuilderRequest.builder()
                .registered(testCreateBuilderRequest.isRegistered())
                .contactRequestDto(ContactRequestDto.builder()
                        .firstName(builderContactRequestDto.getFirstName())
                        .lastName(builderContactRequestDto.getLastName())
                        .email("builder.for.owner@test.com") // Use unique email
                        .phone(builderContactRequestDto.getPhone())
                        .labels(builderContactRequestDto.getLabels())
                        .addressRequestDto(builderContactRequestDto.getAddressRequestDto())
                        .build())
                .build();

        var ownerRequest = CreateOwnerRequest.builder()
                .registered(testCreateOwnerRequest.isRegistered())
                .contactRequestDto(ContactRequestDto.builder()
                        .firstName(ownerContactRequestDto.getFirstName())
                        .lastName(ownerContactRequestDto.getLastName())
                        .email("owner.with.projects@test.com") // Use unique email
                        .phone(ownerContactRequestDto.getPhone())
                        .labels(ownerContactRequestDto.getLabels())
                        .addressRequestDto(ownerContactRequestDto.getAddressRequestDto())
                        .build())
                .build();

        // Create builder user via API
        String builderResponseJson = mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(builderRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        var builderResponse = objectMapper.readValue(builderResponseJson, CreateBuilderResponse.class);

        // Create owner user via API
        String ownerResponseJson = mockMvc.perform(post("/api/v1/users/owners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ownerRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        var ownerResponse = objectMapper.readValue(ownerResponseJson, CreateOwnerResponse.class);

        var projectRequest = CreateProjectRequest.builder()
                .builderId(builderResponse.getUserDto().getId())
                .ownerId(ownerResponse.getUserDto().getId())
                .locationRequestDto(projectLocationRequestDto)
                .build();

        // Create the project via API
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isCreated());

        // When & Then
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", ownerResponse.getUserDto().getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].builderId").value(builderResponse.getUserDto().getId().toString()))
                .andExpect(jsonPath("$[0].ownerId").value(ownerResponse.getUserDto().getId().toString()))
                .andExpect(jsonPath("$[0].locationDto.streetName").value(projectLocationRequestDto.getStreetName()))
                .andExpect(jsonPath("$[0].locationDto.city").value(projectLocationRequestDto.getCity()));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnEmptyList_whenBuilderHasNoProjects() throws Exception {
        // Given - extract inner DTOs for safer assertions
        var builderContactRequestDto = testBuilderContactRequestDto;

        // Create builder user via API with unique email
        var builderRequest = CreateBuilderRequest.builder()
                .registered(testCreateBuilderRequest.isRegistered())
                .contactRequestDto(ContactRequestDto.builder()
                        .firstName(builderContactRequestDto.getFirstName())
                        .lastName(builderContactRequestDto.getLastName())
                        .email("builder.no.projects@test.com") // Use unique email
                        .phone(builderContactRequestDto.getPhone())
                        .labels(builderContactRequestDto.getLabels())
                        .addressRequestDto(builderContactRequestDto.getAddressRequestDto())
                        .build())
                .build();

        String builderResponseJson = mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(builderRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        var builderResponse = objectMapper.readValue(builderResponseJson, CreateBuilderResponse.class);

        // When & Then
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builderResponse.getUserDto().getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnEmptyList_whenOwnerHasNoProjects() throws Exception {
        // Given - extract inner DTOs for safer assertions
        var ownerContactRequestDto = testOwnerContactRequestDto;

        // Create owner user via API with unique email
        var ownerRequest = CreateOwnerRequest.builder()
                .registered(testCreateOwnerRequest.isRegistered())
                .contactRequestDto(ContactRequestDto.builder()
                        .firstName(ownerContactRequestDto.getFirstName())
                        .lastName(ownerContactRequestDto.getLastName())
                        .email("owner.no.projects@test.com") // Use unique email
                        .phone(ownerContactRequestDto.getPhone())
                        .labels(ownerContactRequestDto.getLabels())
                        .addressRequestDto(ownerContactRequestDto.getAddressRequestDto())
                        .build())
                .build();

        String ownerResponseJson = mockMvc.perform(post("/api/v1/users/owners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ownerRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        var ownerResponse = objectMapper.readValue(ownerResponseJson, CreateOwnerResponse.class);

        // When & Then
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", ownerResponse.getUserDto().getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void createProject_shouldReturnBadRequest_whenBuilderUserIdIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateProjectRequestWithNullBuilderUserId)))
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
}
