package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractControllerIntegrationTest;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderResponse;
import dev.hr.rezaei.buildflow.user.dto.CreateOwnerRequest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class UserControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Test
    void createBuilder_shouldReturnCreated_whenValidRegisteredRequest() throws Exception {
        ContactRequestDto contactRequestDto = testCreateBuilderRequest.getContactRequestDto();

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.userDto.id").exists())
                .andExpect(jsonPath("$.userDto.username").value(contactRequestDto.getEmail()))
                .andExpect(jsonPath("$.userDto.email").value(contactRequestDto.getEmail()))
                .andExpect(jsonPath("$.userDto.registered").value(testCreateBuilderRequest.isRegistered()))
                .andExpect(jsonPath("$.userDto.contactDto").exists())
                .andExpect(jsonPath("$.userDto.contactDto.firstName").value(contactRequestDto.getFirstName()))
                .andExpect(jsonPath("$.userDto.contactDto.lastName").value(contactRequestDto.getLastName()))
                .andExpect(jsonPath("$.userDto.contactDto.email").value(contactRequestDto.getEmail()))
                .andExpect(jsonPath("$.userDto.contactDto.phone").value(contactRequestDto.getPhone()));
    }

    @Test
    void createBuilder_shouldReturnCreated_whenValidUnregisteredRequest() throws Exception {
        // Given
        ContactRequestDto contactRequestDto = testBuilderContactRequestDto;
        var unregisteredBuilderRequest = CreateBuilderRequest.builder()
                .registered(false)
                .contactRequestDto(contactRequestDto)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(unregisteredBuilderRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.userDto.id").exists())
                .andExpect(jsonPath("$.userDto.username").value(contactRequestDto.getEmail()))
                .andExpect(jsonPath("$.userDto.email").value(contactRequestDto.getEmail()))
                .andExpect(jsonPath("$.userDto.registered").value(false))
                .andExpect(jsonPath("$.userDto.contactDto").exists())
                .andExpect(jsonPath("$.userDto.contactDto.firstName").value(contactRequestDto.getFirstName()))
                .andExpect(jsonPath("$.userDto.contactDto.lastName").value(contactRequestDto.getLastName()));
    }

    @Test
    void createOwner_shouldReturnCreated_whenValidRegisteredRequest() throws Exception {
        // Given
        ContactRequestDto contactRequestDto = testCreateOwnerRequest.getContactRequestDto();

        // When & Then
        mockMvc.perform(post("/api/v1/users/owners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateOwnerRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.userDto.id").exists())
                .andExpect(jsonPath("$.userDto.username").value(contactRequestDto.getEmail()))
                .andExpect(jsonPath("$.userDto.email").value(contactRequestDto.getEmail()))
                .andExpect(jsonPath("$.userDto.registered").value(testCreateOwnerRequest.isRegistered()))
                .andExpect(jsonPath("$.userDto.contactDto").exists())
                .andExpect(jsonPath("$.userDto.contactDto.firstName").value(contactRequestDto.getFirstName()))
                .andExpect(jsonPath("$.userDto.contactDto.lastName").value(contactRequestDto.getLastName()))
                .andExpect(jsonPath("$.userDto.contactDto.email").value(contactRequestDto.getEmail()))
                .andExpect(jsonPath("$.userDto.contactDto.phone").value(contactRequestDto.getPhone()));
    }

    @Test
    void getUserByUsername_shouldReturnOk_whenUserExists() throws Exception {
        // Given
        MvcResult result = mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequest)))
                .andExpect(status().isCreated())
                .andReturn();
        String responseContent = result.getResponse().getContentAsString();
        CreateBuilderResponse responseDto = objectMapper.readValue(responseContent, CreateBuilderResponse.class);
        UserDto userDto = responseDto.getUserDto();
        ContactDto contactDto = userDto.getContactDto();

        // When & Then
        mockMvc.perform(get("/api/v1/users/{username}", userDto.getUsername()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(userDto.getId().toString()))
                .andExpect(jsonPath("$.username").value(userDto.getUsername()))
                .andExpect(jsonPath("$.email").value(userDto.getEmail()))
                .andExpect(jsonPath("$.registered").value(userDto.isRegistered()))
                .andExpect(jsonPath("$.contactDto").exists())
                .andExpect(jsonPath("$.contactDto.firstName").value(contactDto.getFirstName()))
                .andExpect(jsonPath("$.contactDto.lastName").value(contactDto.getLastName()))
                .andExpect(jsonPath("$.contactDto.email").value(contactDto.getEmail()));
    }

    @Test
    void getUserByUsername_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
        // Given
        String nonExistentUsername = "nonexistent@test.com";

        // When & Then
        mockMvc.perform(get("/api/v1/users/{username}", nonExistentUsername))
                .andExpect(status().isNotFound());
    }

    @Test
    void createBuilder_shouldReturnBadRequest_whenContactDtoIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequestWithNullContact)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createBuilder_shouldReturnBadRequest_whenFirstNameIsBlank() throws Exception {
        // Given
        ContactRequestDto invalidContactRequestDto = testContactRequestDtoWithBlankFirstName;
        var requestWithBlankFirstName = CreateBuilderRequest.builder()
                .registered(testCreateBuilderRequest.isRegistered())
                .contactRequestDto(invalidContactRequestDto)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestWithBlankFirstName)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createOwner_shouldReturnBadRequest_whenEmailIsInvalid() throws Exception {
        // Given
        ContactRequestDto invalidContactRequestDto = testContactRequestDtoWithInvalidEmail;
        var requestWithInvalidEmail = CreateOwnerRequest.builder()
                .registered(testCreateOwnerRequest.isRegistered())
                .contactRequestDto(invalidContactRequestDto)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/owners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestWithInvalidEmail)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }
}
