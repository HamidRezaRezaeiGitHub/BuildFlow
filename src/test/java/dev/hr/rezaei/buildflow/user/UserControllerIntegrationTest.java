package dev.hr.rezaei.buildflow.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.AbstractDtoTest;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderResponse;
import dev.hr.rezaei.buildflow.user.dto.CreateOwnerRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateOwnerResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "spring.security.enabled=false")
class UserControllerIntegrationTest extends AbstractDtoTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

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
                .contactDto(testContactDtoWithBlankFirstName)
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
                .contactDto(testContactDtoWithBlankLastName)
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
                .contactDto(testContactDtoWithInvalidEmail)
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
                .contactDto(testContactDtoWithBlankEmail)
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
                .contactDto(testContactDtoWithNullLabels)
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
                .contactDto(testContactDtoWithNullAddress)
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
        ContactDto contactDto = ContactDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("john.builder@example.com")
                .labels(List.of("BUILDER"))
                .addressDto(testContactAddressDtoWithLongStreetName)
                .build();

        CreateBuilderRequest request = CreateBuilderRequest.builder()
                .registered(true)
                .contactDto(contactDto)
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
        ContactDto invalidContactDto = ContactDto.builder()
                .firstName("Jane")
                .lastName("Owner")
                .email("not-an-email")  // Invalid: not a valid email format
                .labels(List.of("OWNER"))
                .addressDto(testOwnerContactAddressDto)
                .build();

        CreateOwnerRequest request = CreateOwnerRequest.builder()
                .registered(false)
                .contactDto(invalidContactDto)
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
