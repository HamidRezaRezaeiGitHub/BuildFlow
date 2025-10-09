package dev.hr.rezaei.buildflow.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.config.security.dto.JwtAuthenticationResponse;
import dev.hr.rezaei.buildflow.config.security.dto.LoginRequest;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.config.security.dto.UserSummaryResponse;
import dev.hr.rezaei.buildflow.user.UserDto;
import dev.hr.rezaei.buildflow.user.UserService;
import dev.hr.rezaei.buildflow.user.dto.ContactAddressRequestDto;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import lombok.NonNull;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

public interface AuthServiceConsumer {

    default ContactAddressRequestDto createValidRandomContactAddressRequestDto() {
        int randomNum = (int) (Math.random() * 1000);
        return ContactAddressRequestDto.builder()
                .unitNumber("Apt " + randomNum)
                .streetNumberAndName(randomNum + " Main St " + randomNum)
                .city("City " + randomNum)
                .country("Country " + randomNum)
                .stateOrProvince("State " + randomNum)
                .postalOrZipCode("000" + randomNum)
                .build();
    }

    default ContactRequestDto createValidRandomContactRequestDto() {
        int randomNum = (int) (Math.random() * 1000);
        return ContactRequestDto.builder()
                .firstName("FirstName" + randomNum)
                .lastName("LastName" + randomNum)
                .email("user" + randomNum + "@example.com")
                .phone("+1234567890" + randomNum)
                .addressRequestDto(createValidRandomContactAddressRequestDto())
                .labels(new ArrayList<>())
                .build();
    }

    default SignUpRequest createValidRandomSignUpRequest() {
        int randomNum = (int) (Math.random() * 1000);
        return SignUpRequest.builder()
                .username("user" + randomNum)
                .password("Password123!_xyz")
                .contactRequestDto(createValidRandomContactRequestDto())
                .build();
    }

    default CreateUserResponse registerUser(@NonNull MockMvc mockMvc, @NonNull ObjectMapper objectMapper,
                                            SignUpRequest signUpRequest) throws Exception {
        MvcResult mvcResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andDo(print())
                .andReturn();

        String responseContent = mvcResult.getResponse().getContentAsString();
        return objectMapper.readValue(responseContent, CreateUserResponse.class);
    }

    default JwtAuthenticationResponse login(@NonNull MockMvc mockMvc, @NonNull ObjectMapper objectMapper,
                                            LoginRequest loginRequest) throws Exception {

        MvcResult mvcResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(print())
                .andReturn();

        String responseContent = mvcResult.getResponse().getContentAsString();
        return objectMapper.readValue(responseContent, JwtAuthenticationResponse.class);
    }

    default UserSummaryResponse getCurrentUser(@NonNull MockMvc mockMvc, @NonNull ObjectMapper objectMapper,
                                              String jwtToken) throws Exception {
        MvcResult mvcResult = mockMvc.perform(get("/api/auth/current")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andReturn();

        String responseContent = mvcResult.getResponse().getContentAsString();
        return objectMapper.readValue(responseContent, UserSummaryResponse.class);
    }

    default CreateUserResponse registerUser(MockMvc mockMvc, ObjectMapper objectMapper,
                                            SignUpRequest signUpRequest, String clientIp) throws Exception {
        MvcResult mvcResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest))
                        .header("X-Forwarded-For", clientIp))
                .andDo(print())
                .andReturn();

        String responseContent = mvcResult.getResponse().getContentAsString();
        return objectMapper.readValue(responseContent, CreateUserResponse.class);
    }

    default LoginRequest registerUserAndCreateLoginRequest(MockMvc mockMvc, ObjectMapper objectMapper,
                                                           SignUpRequest signUpRequest, String clientIp,
                                                           UserService userService) throws Exception {
        CreateUserResponse createUserResponse = registerUser(mockMvc, objectMapper, signUpRequest, clientIp);
        UserDto userDto = createUserResponse.getUserDto();
        UUID userId = userDto.getId();
        String username = userDto.getUsername();
        String password = signUpRequest.getPassword();
        assertEquals(signUpRequest.getUsername(), username);
        assertEquals(signUpRequest.getPassword(), password);
        assertTrue(userService.findById(userId).isPresent());

        return LoginRequest.builder()
                .username(username)
                .password(password)
                .build();
    }

    default LoginRequest registerUserAndCreateLoginRequest(MockMvc mockMvc, ObjectMapper objectMapper,
                                                           String clientIp,UserService userService) throws Exception {
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        CreateUserResponse createUserResponse = registerUser(mockMvc, objectMapper, signUpRequest, clientIp);
        UserDto userDto = createUserResponse.getUserDto();
        UUID userId = userDto.getId();
        String username = userDto.getUsername();
        String password = signUpRequest.getPassword();
        assertEquals(signUpRequest.getUsername(), username);
        assertEquals(signUpRequest.getPassword(), password);
        assertTrue(userService.findById(userId).isPresent());

        return LoginRequest.builder()
                .username(username)
                .password(password)
                .build();
    }

    default JwtAuthenticationResponse login(MockMvc mockMvc, ObjectMapper objectMapper,
                                            LoginRequest loginRequest, String clientIp) throws Exception {
        MvcResult mvcResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .header("X-Forwarded-For", clientIp))
                .andDo(print())
                .andReturn();

        String responseContent = mvcResult.getResponse().getContentAsString();
        return objectMapper.readValue(responseContent, JwtAuthenticationResponse.class);
    }

    default String registerUserAndLoginAndGetToken(MockMvc mockMvc, ObjectMapper objectMapper,
                                                   SignUpRequest signUpRequest, String clientIp,
                                                   UserService userService) throws Exception {
        LoginRequest loginRequest = registerUserAndCreateLoginRequest(mockMvc, objectMapper,
                signUpRequest, clientIp, userService);
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper,
                loginRequest, clientIp);
        return jwtAuthenticationResponse.getAccessToken();
    }

    default String registerUserAndLoginAndGetToken(MockMvc mockMvc, ObjectMapper objectMapper,
                                                   String clientIp, UserService userService) throws Exception {
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        LoginRequest loginRequest = registerUserAndCreateLoginRequest(mockMvc, objectMapper,
                signUpRequest, clientIp, userService);
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper,
                loginRequest, clientIp);
        return jwtAuthenticationResponse.getAccessToken();
    }

    default UserSummaryResponse getCurrentUser(MockMvc mockMvc, ObjectMapper objectMapper,
                                               String jwtToken, String clientIp) throws Exception {
        MvcResult mvcResult = mockMvc.perform(get("/api/auth/current")
                        .header("Authorization", "Bearer " + jwtToken)
                        .header("X-Forwarded-For", clientIp)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andReturn();

        String responseContent = mvcResult.getResponse().getContentAsString();
        return objectMapper.readValue(responseContent, UserSummaryResponse.class);
    }
}
