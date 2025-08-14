package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractControllerTest;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateOwnerRequest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest extends AbstractControllerTest {

    @Test
    void createBuilder_shouldReturnCreated_whenValidRequest() throws Exception {
        // Given
        when(userService.createBuilder(any(CreateBuilderRequest.class))).thenReturn(testCreateBuilderResponse);

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.userDto.id").exists())
                .andExpect(jsonPath("$.userDto.email").value("john.builder@example.com"))
                .andExpect(jsonPath("$.userDto.registered").value(true));
    }

    @Test
    void createOwner_shouldReturnCreated_whenValidRequest() throws Exception {
        // Given
        when(userService.createOwner(any(CreateOwnerRequest.class))).thenReturn(testCreateOwnerResponse);

        // When & Then
        mockMvc.perform(post("/api/v1/users/owners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateOwnerRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.userDto.id").exists())
                .andExpect(jsonPath("$.userDto.email").value("jane.owner@example.com"))
                .andExpect(jsonPath("$.userDto.registered").value(false));
    }

    @Test
    void createBuilder_shouldReturnBadRequest_whenContactDtoIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequestWithNullContact)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createBuilder_shouldReturnBadRequest_whenFirstNameIsBlank() throws Exception {
        // Given
        CreateBuilderRequest request = CreateBuilderRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithBlankFirstName)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createBuilder_shouldReturnBadRequest_whenLastNameIsBlank() throws Exception {
        // Given
        CreateBuilderRequest request = CreateBuilderRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithBlankLastName)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createBuilder_shouldReturnBadRequest_whenEmailIsInvalid() throws Exception {
        // Given
        CreateBuilderRequest request = CreateBuilderRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithInvalidEmail)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createBuilder_shouldReturnBadRequest_whenEmailIsBlank() throws Exception {
        // Given
        CreateBuilderRequest request = CreateBuilderRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithBlankEmail)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createBuilder_shouldReturnBadRequest_whenLabelsIsNull() throws Exception {
        // Given
        CreateBuilderRequest request = CreateBuilderRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithNullLabels)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createBuilder_shouldReturnBadRequest_whenAddressDtoIsNull() throws Exception {
        // Given
        CreateBuilderRequest request = CreateBuilderRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithNullAddress)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createBuilder_shouldReturnBadRequest_whenFieldExceedsMaxLength() throws Exception {
        // Given
        CreateBuilderRequest request = CreateBuilderRequest.builder()
                .registered(true)
                .contactRequestDto(ContactRequestDto.builder()
                        .firstName("John")
                        .lastName("Builder")
                        .email("john.builder@example.com")
                        .labels(List.of("BUILDER"))
                        .addressRequestDto(testContactAddressRequestDtoWithLongStreetName)
                        .build())
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/builders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createOwner_shouldReturnBadRequest_whenContactDtoIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/users/owners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateOwnerRequestWithNullContact)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createOwner_shouldReturnBadRequest_whenEmailIsInvalid() throws Exception {
        // Given
        CreateOwnerRequest request = CreateOwnerRequest.builder()
                .registered(false)
                .contactRequestDto(testContactRequestDtoWithInvalidEmail)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users/owners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }
}
