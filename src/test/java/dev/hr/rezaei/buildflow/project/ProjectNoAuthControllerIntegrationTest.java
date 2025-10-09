package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractNoAuthControllerIntegrationTest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.user.UserService;
import dev.hr.rezaei.buildflow.user.UserServiceConsumer;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class ProjectNoAuthControllerIntegrationTest extends AbstractNoAuthControllerIntegrationTest implements UserServiceConsumer {

    @Autowired
    private UserService userService;

    @Test
    void createProject_shouldReturnCreated_whenValidRequest() throws Exception {
        // Given
        var projectLocationRequestDto = testCreateProjectRequest.getLocationRequestDto();
        var builderResponse = userService.createUser(testCreateBuilderRequest);

        var projectRequest = CreateProjectRequest.builder()
                .userId(builderResponse.getUserDto().getId())
                .isBuilder(true)
                .locationRequestDto(projectLocationRequestDto)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.projectDto.id").exists())
                .andExpect(jsonPath("$.projectDto.builderId").value(builderResponse.getUserDto().getId().toString()))
                .andExpect(jsonPath("$.projectDto.locationDto").exists())
                .andExpect(jsonPath("$.projectDto.locationDto.streetNumberAndName").value(projectLocationRequestDto.getStreetNumberAndName()))
                .andExpect(jsonPath("$.projectDto.locationDto.city").value(projectLocationRequestDto.getCity()))
                .andExpect(jsonPath("$.projectDto.locationDto.stateOrProvince").value(projectLocationRequestDto.getStateOrProvince()))
                .andExpect(jsonPath("$.projectDto.locationDto.country").value(projectLocationRequestDto.getCountry()));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnOk_whenBuilderHasProjects() throws Exception {
        // Given
        var projectLocationRequestDto = testCreateProjectRequest.getLocationRequestDto();
        var builderResponse = createUniqUser(userService, testBuilderContactRequestDto);
        UUID builderId = builderResponse.getUserDto().getId();
        var projectRequest = CreateProjectRequest.builder()
                .userId(builderId)
                .isBuilder(true)
                .locationRequestDto(projectLocationRequestDto)
                .build();

        // Create the project via API
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isCreated());

        // When & Then
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builderId))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].builderId").value(builderId.toString()))
                .andExpect(jsonPath("$[0].locationDto.streetNumberAndName").value(projectLocationRequestDto.getStreetNumberAndName()))
                .andExpect(jsonPath("$[0].locationDto.city").value(projectLocationRequestDto.getCity()));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnOk_whenOwnerHasProjects() throws Exception {
        // Given
        var projectLocationRequestDto = testCreateProjectRequest.getLocationRequestDto();
        CreateUserResponse ownerResponse = createUniqUser(userService, testOwnerContactRequestDto);
        UUID ownerId = ownerResponse.getUserDto().getId();
        var projectRequest = CreateProjectRequest.builder()
                .userId(ownerId)
                .isBuilder(false)
                .locationRequestDto(projectLocationRequestDto)
                .build();

        // Create the project via API
        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isCreated());

        // When & Then
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", ownerId))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].ownerId").value(ownerId.toString()))
                .andExpect(jsonPath("$[0].locationDto.streetNumberAndName").value(projectLocationRequestDto.getStreetNumberAndName()))
                .andExpect(jsonPath("$[0].locationDto.city").value(projectLocationRequestDto.getCity()));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnEmptyList_whenBuilderHasNoProjects() throws Exception {
        // Given
        CreateUserResponse builderResponse = createUniqUser(userService, testBuilderContactRequestDto);
        UUID builderId = builderResponse.getUserDto().getId();

        // When & Then
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builderId))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnEmptyList_whenOwnerHasNoProjects() throws Exception {
        // Given
        CreateUserResponse ownerResponse = createUniqUser(userService, testOwnerContactRequestDto);

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
}
