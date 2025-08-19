package dev.hr.rezaei.buildflow.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import lombok.NonNull;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public interface UserControllerConsumerTest {

    default CreateUserResponse registerUser(@NonNull MockMvc mockMvc, @NonNull ObjectMapper objectMapper,
                                            @NonNull ContactRequestDto contactRequestDto) throws Exception {
        return registerUser(mockMvc, objectMapper, contactRequestDto, contactRequestDto.getEmail());
    }

    default CreateUserResponse registerUser(@NonNull MockMvc mockMvc, @NonNull ObjectMapper objectMapper,
                                            @NonNull ContactRequestDto contactRequestDto,
                                            @NonNull String username) throws Exception {
        CreateUserRequest request = CreateUserRequest.builder()
                .contactRequestDto(contactRequestDto)
                .registered(true)
                .username(username)
                .build();
        return registerUser(mockMvc, objectMapper, request);
    }

    default CreateUserResponse registerUser(@NonNull MockMvc mockMvc, @NonNull ObjectMapper objectMapper,
                                            @NonNull CreateUserRequest request) throws Exception {
        String responseJson = mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readValue(responseJson, CreateUserResponse.class);
    }
}
