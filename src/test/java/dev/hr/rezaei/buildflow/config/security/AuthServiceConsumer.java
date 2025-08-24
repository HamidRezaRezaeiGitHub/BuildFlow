package dev.hr.rezaei.buildflow.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.user.dto.ContactAddressRequestDto;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import lombok.NonNull;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public interface AuthServiceConsumer {

    default ContactAddressRequestDto createValidRandomContactAddressRequestDto() {
        int randomNum = (int) (Math.random() * 1000);
        return ContactAddressRequestDto.builder()
                .unitNumber("Apt " + randomNum)
                .streetNumber("" + randomNum)
                .streetName("Main St " + randomNum)
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
                .andReturn();

        String responseContent = mvcResult.getResponse().getContentAsString();
        return objectMapper.readValue(responseContent, CreateUserResponse.class);
    }
}
