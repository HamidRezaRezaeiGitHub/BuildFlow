package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractControllerTest;
import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserRequest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest extends AbstractControllerTest {

    @Test
    void createUser_shouldReturnCreated_whenValidRequest() throws Exception {
        // Given
        when(userService.createUser(any(CreateUserRequest.class))).thenReturn(testCreateBuilderResponse);

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequest)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.userDto.id").exists())
                .andExpect(jsonPath("$.userDto.email").value("john.builder@example.com"))
                .andExpect(jsonPath("$.userDto.registered").value(true));
    }

    @Test
    void createUser_shouldReturnBadRequest_whenContactDtoIsNull() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequestWithNullContact)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createUser_shouldReturnBadRequest_whenFirstNameIsBlank() throws Exception {
        // Given
        CreateUserRequest request = CreateUserRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithBlankFirstName)
                .username(testContactRequestDtoWithBlankFirstName.getEmail())
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createUser_shouldReturnBadRequest_whenLastNameIsBlank() throws Exception {
        // Given
        CreateUserRequest request = CreateUserRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithBlankLastName)
                .username(testContactRequestDtoWithBlankLastName.getEmail())
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createUser_shouldReturnBadRequest_whenEmailIsInvalid() throws Exception {
        // Given
        CreateUserRequest request = CreateUserRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithInvalidEmail)
                .username(testContactRequestDtoWithInvalidEmail.getEmail())
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createUser_shouldReturnBadRequest_whenEmailIsBlank() throws Exception {
        // Given
        CreateUserRequest request = CreateUserRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithBlankEmail)
                .username(testContactRequestDtoWithBlankEmail.getEmail())
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    @Disabled("UI can force user to enter address details, but it's not mandatory in backend")
    void createUser_shouldReturnBadRequest_whenAddressDtoIsNull() throws Exception {
        // Given
        CreateUserRequest request = CreateUserRequest.builder()
                .registered(true)
                .contactRequestDto(testContactRequestDtoWithNullAddress)
                .username(testContactRequestDtoWithNullAddress.getEmail())
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void createUser_shouldReturnBadRequest_whenFieldExceedsMaxLength() throws Exception {
        // Given
        CreateUserRequest request = CreateUserRequest.builder()
                .registered(true)
                .contactRequestDto(ContactRequestDto.builder()
                        .firstName("John")
                        .lastName("Builder")
                        .email("john.builder@example.com")
                        .labels(List.of("BUILDER"))
                        .addressRequestDto(testContactAddressRequestDtoWithLongStreetName)
                        .build())
                .username("john.builder@example.com")
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void getUserByUsername_shouldReturnOk_whenUserExists() throws Exception {
        // Given
        String username = testBuilderUserDto.getEmail();
        when(userService.getUserDtoByUsername(username)).thenReturn(testBuilderUserDto);

        // When & Then
        mockMvc.perform(get("/api/v1/users/{username}", username))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.email").value(testBuilderUserDto.getEmail()))
                .andExpect(jsonPath("$.registered").value(true))
                .andExpect(jsonPath("$.contactDto").exists());
    }

    @Test
    void getUserByUsername_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
        // Given
        String username = "nonexistent.user@example.com";
        when(userService.getUserDtoByUsername(username))
                .thenThrow(new UserNotFoundException("User not found with username: " + username));

        // When & Then
        mockMvc.perform(get("/api/v1/users/{username}", username))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void getUserByUsername_shouldReturnOk_whenOwnerExists() throws Exception {
        // Given
        String username = testOwnerUserDto.getEmail();
        when(userService.getUserDtoByUsername(username)).thenReturn(testOwnerUserDto);

        // When & Then
        mockMvc.perform(get("/api/v1/users/{username}", username))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.email").value(testOwnerUserDto.getEmail()))
                .andExpect(jsonPath("$.registered").value(false))
                .andExpect(jsonPath("$.contactDto").exists());
    }
}
